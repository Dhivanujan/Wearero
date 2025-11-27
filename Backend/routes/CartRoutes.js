const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const buildCartFilter = (userId, guestId) => {
  if (userId) {
    return { user: userId };
  }
  if (guestId) {
    return { guestId };
  }
  return null;
};

const calculateCartTotal = (items = []) =>
  items.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
    0
  );

const getCart = async (userId, guestId) => {
  const filter = buildCartFilter(userId, guestId);
  if (!filter) {
    return null;
  }
  return Cart.findOne(filter);
};

const emptyCartPayload = { products: [], totalPrice: 0, guestId: null };

// @route   POST /api/cart
// @desc    Add item to cart (guest or user)
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity = 1, size, color, guestId, userId } = req.body;

  try {
    // ✅ Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!size || !color) {
      return res.status(400).json({ message: "Size and color are required" });
    }

    // ✅ Get or create cart
    let cart = await getCart(userId, guestId);
    const isNewCart = !cart;

    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [],
        totalPrice: 0,
      });
    }

    const normalizedQuantity = Math.max(1, Number(quantity) || 1);

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    const snapshot = {
      productId,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: product.discountPrice || product.price,
      size,
      color,
      quantity: normalizedQuantity,
    };

    if (productIndex > -1) {
      cart.products[productIndex].quantity += normalizedQuantity;
    } else {
      cart.products.push(snapshot);
    }

    cart.totalPrice = calculateCartTotal(cart.products);

    if (userId && !cart.user) {
      cart.user = userId;
    }

    if (!userId && !cart.guestId) {
      cart.guestId = guestId || `guest_${Date.now()}`;
    }

    await cart.save();
    return res.status(isNewCart ? 201 : 200).json(cart);
  } catch (error) {
    console.error("Cart creation error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/cart
//@desc Update cart item quantity
//@access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      //Update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = Math.max(1, Number(quantity));
      } else {
        //Remove item if quantity is 0
        cart.products.splice(productIndex, 1);
      }

      if (cart.products.length === 0) {
        await cart.deleteOne();
        return res.status(200).json(emptyCartPayload);
      }

      cart.totalPrice = calculateCartTotal(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/cart
//@desc Remove specific item from cart
//@access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      if (cart.products.length === 0) {
        await Cart.deleteOne({ _id: cart._id });
        return res.status(200).json(emptyCartPayload);
      }

      cart.totalPrice = calculateCartTotal(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Cart delete error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/cart
//@desc Get cart for user or guest
//@access Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    if (!userId && !guestId) {
      return res.json(emptyCartPayload);
    }

    const cart = await getCart(userId, guestId);
    if (cart) {
      return res.json(cart);
    }

    res.json(emptyCartPayload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/cart/merge
// @desc    Merge guest cart into user cart upon login
// @access  Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    if (!guestId) {
      const existingCart = await Cart.findOne({ user: req.user.id });
      return res.status(200).json(existingCart || emptyCartPayload);
    }

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user.id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }

      if (userCart) {
        // ✅ Merge carts
        guestCart.products.forEach((guestItem) => {
          guestItem.quantity = Math.max(1, Number(guestItem.quantity) || 1);
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            // Update quantity if item exists
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // Add new item
            userCart.products.push(guestItem);
          }
        });

        // ✅ Recalculate total price
        userCart.totalPrice = calculateCartTotal(userCart.products);

        await userCart.save();

        // ✅ Remove guest cart after merging
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }

        return res.status(200).json(userCart);
      } else {
        // ✅ Assign guest cart to user
        guestCart.user = req.user.id;
        guestCart.guestId = undefined;
        await guestCart.save();

        return res.status(200).json(guestCart);
      }
    } else {
      // ✅ No guest cart found
      if (userCart) {
        return res.status(200).json(userCart);
      } else {
        return res.status(404).json({ message: "No cart found for user" });
      }
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

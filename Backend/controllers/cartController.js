const Cart = require('../models/Cart');
const Product = require('../models/Product');

const buildCartFilter = (userId, guestId) => {
  if (userId) return { user: userId };
  if (guestId) return { guestId };
  return null;
};

const calculateCartTotal = (items = []) =>
  items.reduce(
    (acc, item) => acc + Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
    0
  );

const getCartDoc = async (userId, guestId) => {
  const filter = buildCartFilter(userId, guestId);
  if (!filter) return null;
  return Cart.findOne(filter);
};

const emptyCartPayload = { products: [], totalPrice: 0, guestId: null };

// @desc    Add item to cart
// @access  Public
const addToCart = async (req, res, next) => {
  const { productId, quantity = 1, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    if (!size || !color) {
      res.status(400);
      throw new Error('Size and color are required');
    }

    let cart = await getCartDoc(userId, guestId);
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
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    const snapshot = {
      productId,
      name: product.name,
      image: product.images?.[0]?.url || '',
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
    if (userId && !cart.user) cart.user = userId;
    if (!userId && !cart.guestId) cart.guestId = guestId || `guest_${Date.now()}`;

    await cart.save();
    return res.status(isNewCart ? 201 : 200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @access  Public
const updateCartItem = async (req, res, next) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCartDoc(userId, guestId);
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = Math.max(1, Number(quantity));
      } else {
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
      res.status(404);
      throw new Error('Product not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove specific item from cart
// @access  Public
const removeFromCart = async (req, res, next) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCartDoc(userId, guestId);
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
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
      res.status(404);
      throw new Error('Product not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart for user or guest
// @access  Public
const getCart = async (req, res, next) => {
  const { userId, guestId } = req.query;

  try {
    if (!userId && !guestId) {
      return res.json(emptyCartPayload);
    }

    const cart = await getCartDoc(userId, guestId);
    return res.json(cart || emptyCartPayload);
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart into user cart upon login
// @access  Private
const mergeCart = async (req, res, next) => {
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
        res.status(400);
        throw new Error('Guest cart is empty');
      }

      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          guestItem.quantity = Math.max(1, Number(guestItem.quantity) || 1);
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = calculateCartTotal(userCart.products);
        await userCart.save();

        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (cleanupErr) {
          console.error('Error deleting guest cart:', cleanupErr);
        }

        return res.status(200).json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        return res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      } else {
        res.status(404);
        throw new Error('No cart found for user');
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  mergeCart,
};

const Product = require('../models/Product');

// @desc    Create a new product
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, discountPrice, countInStock,
      category, brand, sizes, colors, collections, material,
      gender, images, isFeatured, isPublished, tags,
      dimensions, weight, sku,
    } = req.body;

    if (!name || !description || !price || !category || !sizes || !colors || !collections || !gender || !sku) {
      res.status(400);
      throw new Error('Please fill all required fields.');
    }

    const product = new Product({
      name, description, price, discountPrice, countInStock,
      category, brand, sizes, colors, collections, material,
      gender, images, isFeatured, isPublished, tags,
      dimensions, weight, sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Product created successfully', product: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const fields = [
      'name', 'description', 'price', 'discountPrice', 'countInStock',
      'category', 'brand', 'sizes', 'colors', 'collections', 'material',
      'gender', 'images', 'tags', 'dimensions', 'weight', 'sku',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Boolean fields need explicit check
    if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured;
    if (req.body.isPublished !== undefined) product.isPublished = req.body.isPublished;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      collection, size, color, gender, minPrice, maxPrice,
      sortBy, search, category, material, brand, limit, page,
    } = req.query;

    let query = {};

    // Filter logic
    if (collection && collection.toLowerCase() !== 'all') query.collections = collection;
    if (category && category.toLowerCase() !== 'all') query.category = category;
    if (material) query.material = { $in: material.split(',') };
    if (brand) query.brand = { $in: brand.split(',') };
    if (size) query.sizes = { $in: size.split(',') };
    if (color) {
      query.colors = { $in: color.split(',').map((v) => v.trim()) };
    }
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'priceAsc': sort = { price: 1 }; break;
        case 'priceDesc': sort = { price: -1 }; break;
        case 'popularity': sort = { rating: -1 }; break;
        case 'newest': sort = { createdAt: -1 }; break;
        default: break;
      }
    }

    // Pagination
    const pageSize = Number(limit) || 12;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.json({
      products,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best-selling products
// @access  Public
const getBestSellers = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const bestSellers = await Product.find()
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit);

    if (!bestSellers || bestSellers.length === 0) {
      res.status(404);
      throw new Error('No best-selling products found');
    }

    res.json(bestSellers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get newly added products
// @access  Public
const getNewArrivals = async (req, res, next) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar products by category
// @access  Public
const getSimilarProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const similarProducts = await Product.find({
      _id: { $ne: req.params.id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new review
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getBestSellers,
  getNewArrivals,
  getSimilarProducts,
  getProductById,
  createReview,
};

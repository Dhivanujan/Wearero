const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @desc    Register a new user
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('Invalid Credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid Credentials');
    }

    const token = generateToken(user._id, user.role);
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @access  Private
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Get all users (Admin only)
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user (Admin only)
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin only)
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (typeof req.body.role !== 'undefined') {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isProductInWishlist = user.wishlist.includes(productId);

    if (isProductInWishlist) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
      await user.save();
      res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleWishlist,
  getWishlist,
};

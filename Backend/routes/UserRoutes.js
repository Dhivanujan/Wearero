const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  register, login, getProfile, getUsers, createUser,
  updateUser, deleteUser, toggleWishlist, getWishlist,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);
router.route('/').get(protect, admin, getUsers).post(protect, admin, createUser);
router.route('/:id').put(protect, admin, updateUser).delete(protect, admin, deleteUser);

module.exports = router;

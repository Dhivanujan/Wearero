const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addToCart, updateCartItem, removeFromCart, getCart, mergeCart } = require('../controllers/cartController');

const router = express.Router();

router.route('/').get(getCart).post(addToCart).put(updateCartItem).delete(removeFromCart);
router.post('/merge', protect, mergeCart);

module.exports = router;

const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createProduct, updateProduct, deleteProduct, getProducts,
  getBestSellers, getNewArrivals, getSimilarProducts, getProductById, createReview,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/best-seller', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/similar/:id', getSimilarProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;

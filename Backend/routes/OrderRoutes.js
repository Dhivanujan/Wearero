const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

const router = express.Router();

router.route('/').get(protect, admin, getAllOrders).post(protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;

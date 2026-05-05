const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent, handleWebhook } = require('../controllers/checkoutController');

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;

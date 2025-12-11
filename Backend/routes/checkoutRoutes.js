const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/checkout/create-payment-intent
// @desc    Create a payment intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
    const { products } = req.body;

    if (!products || products.length === 0) {
        return res.status(400).json({ error: 'No products provided' });
    }

    try {
        let totalAmount = 0;

        for (const item of products) {
            const id = item.productId._id || item.productId;
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${id}` });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
            currency: 'usd',
            metadata: {
                userId: req.user._id.toString(),
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// @route   POST /api/checkout/webhook
// @desc    Stripe webhook to handle payment success/failure
// @access  Public
// Note: This needs to be configured in Stripe Dashboard to point to this URL
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            // You can update order status here if you save order before payment
            // or just log it. Since we save order after payment confirmation on frontend,
            // this might be redundant unless we want to ensure consistency.
            break;
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object;
            console.log('PaymentIntent failed!', paymentFailed.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
});

module.exports = router;

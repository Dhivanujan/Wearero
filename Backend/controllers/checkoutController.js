const Stripe = require('stripe');
const Product = require('../models/Product');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const toCents = (amount = 0) => Math.round(Number(amount) * 100);
const resolveUnitPrice = (product) => Number(product.discountPrice ?? product.price ?? 0);

const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) { res.status(503); throw new Error('Stripe is not configured'); }
    const { products } = req.body;
    if (!products || products.length === 0) { res.status(400); throw new Error('No products provided'); }

    let totalAmount = 0;
    for (const item of products) {
      const id = item.productId._id || item.productId;
      const product = await Product.findById(id);
      if (!product) { res.status(404); throw new Error(`Product not found: ${id}`); }
      totalAmount += resolveUnitPrice(product) * Math.max(1, Number(item.quantity) || 1);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(totalAmount), currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user._id.toString(), cartTotal: totalAmount.toFixed(2), itemCount: products.length.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount: totalAmount });
  } catch (error) { next(error); }
};

const handleWebhook = async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    switch (event.type) {
      case 'payment_intent.succeeded': console.log('Payment succeeded:', event.data.object.id); break;
      case 'payment_intent.payment_failed': console.log('Payment failed:', event.data.object.id); break;
      default: console.log(`Unhandled event: ${event.type}`);
    }
    res.send();
  } catch (err) { console.error(`Webhook Error: ${err.message}`); res.status(400).send(`Webhook Error: ${err.message}`); }
};

module.exports = { createPaymentIntent, handleWebhook };

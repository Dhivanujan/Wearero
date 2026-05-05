const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, paymentStatus, paymentResult } = req.body;
    if (!orderItems || orderItems.length === 0) { res.status(400); throw new Error('No order items'); }
    if (!['Stripe', 'COD'].includes(paymentMethod)) { res.status(400); throw new Error('Invalid payment method'); }

    const order = new Order({
      user: req.user._id, orderItems, shippingAddress, paymentMethod, totalPrice, paymentStatus, paymentResult,
      isPaid: paymentStatus === 'paid', paidAt: paymentStatus === 'paid' ? Date.now() : null,
    });
    const createdOrder = await order.save();
    try { await Cart.deleteOne({ user: req.user._id }); } catch (e) { console.error('Cart cleanup failed:', e); }
    res.status(201).json(createdOrder);
  } catch (error) { next(error); }
};

const getMyOrders = async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 })); } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) { res.status(404); throw new Error('Order not found'); }
    res.json(order);
  } catch (error) { next(error); }
};

const getAllOrders = async (req, res, next) => {
  try { res.json(await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 })); } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    order.status = req.body.status || order.status;
    order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered;
    order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt;
    res.json(await order.save());
  } catch (error) { next(error); }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) { next(error); }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder };

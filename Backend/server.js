const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const userRoutes = require('./routes/UserRoutes.js');
const productRoutes = require('./routes/ProductRoutes.js');
const cartRoutes = require('./routes/CartRoutes.js');
const orderRoutes = require('./routes/OrderRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const checkoutRoutes = require('./routes/checkoutRoutes.js');

const app = express();

// Middleware to handle JSON, excluding Stripe Webhook
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/payment/webhook')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to WEARERO API!');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', checkoutRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
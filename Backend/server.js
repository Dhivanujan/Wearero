const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes.js');
const productRoutes = require('./routes/ProductRoutes.js');
const cartRoutes = require('./routes/CartRoutes.js');
const orderRoutes = require('./routes/OrderRoutes.js');

const app = express();

app.use(express.json());
app.use(cors());
 
dotenv.config();

const PORT = process.env.PORT || 3000;

//Connect to the MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to WEARERO API!");
});

//API Routes
app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
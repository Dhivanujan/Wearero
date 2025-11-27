const mongoose = require("mongoose");
const dotenv = require("dotenv");
const product = require("./models/Product");
const user = require("./models/User");
const cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

//Connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

//Function to seed data
const seedData = async () => {
    try {
        //Clear existing data
        await product.deleteMany();
        await user.deleteMany();
        await cart.deleteMany();

    //Create a default Admin User
        const createdUser = await user.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
        });

    //Assign the default user ID to each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product) => {
            return { ...product, user: userID, isPublished: true };
        });

    //Insert sample products into DB
        await product.insertMany(sampleProducts);
        console.log("Data Seeded Successfully");
        process.exit();
    } catch (error) {
       console.error("Error seeding data:", error);
       process.exit(1); 
    }
}

seedData();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./models/Product");

const test = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Wearero";
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected.");
    const products = await Product.find({}).limit(5);
    console.log("Found products count:", products.length);
    if (products.length > 0) {
      products.forEach((p, idx) => {
        console.log(`Product ${idx + 1}:`, p.name);
        console.log("Images:", JSON.stringify(p.images, null, 2));
      });
    } else {
      console.log("No products found in DB.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

test();

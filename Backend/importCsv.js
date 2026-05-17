const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

const importCsv = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            console.error("No admin user found. Cannot assign user to products.");
            process.exit(1);
        }

        const csvFilePath = path.join(__dirname, "clothing_products_sample.csv");
        const fileContent = fs.readFileSync(csvFilePath, "utf8");
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        // Skip header line
        const dataLines = lines.slice(1);
        let count = 0;

        for (const line of dataLines) {
            const columns = parseCSVLine(line);
            if (columns.length < 12) continue;

            const [
                name, description, price, stock, sku, category,
                collection, material, brand, gender, sizesStr, colorsStr
            ] = columns;

            // Check if SKU already exists
            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                console.log(`Product with SKU ${sku} already exists, skipping...`);
                continue;
            }

            const product = new Product({
                name,
                description,
                price: Number(price),
                countInStock: Number(stock),
                sku,
                category,
                collections: collection,
                material,
                brand,
                gender,
                sizes: sizesStr.split(",").map(s => s.trim()),
                colors: colorsStr.split(",").map(c => c.trim()),
                user: adminUser._id,
                images: [], // Images to be added manually
                isPublished: true,
            });

            await product.save();
            count++;
            console.log(`Imported: ${name}`);
        }

        console.log(`\nSuccessfully imported ${count} products.`);
        process.exit(0);
    } catch (error) {
        console.error("Error importing CSV:", error);
        process.exit(1);
    }
};

importCsv();

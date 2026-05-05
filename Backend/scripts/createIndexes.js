const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Product indexes
    console.log('Creating Product indexes...');
    await db.collection('products').createIndex({ gender: 1, category: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ rating: -1, numReviews: -1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ collections: 1 });
    await db.collection('products').createIndex(
      { name: 'text', description: 'text' },
      { weights: { name: 10, description: 5 } }
    );

    // Order indexes
    console.log('Creating Order indexes...');
    await db.collection('orders').createIndex({ user: 1, createdAt: -1 });

    // Cart indexes
    console.log('Creating Cart indexes...');
    await db.collection('carts').createIndex({ user: 1 });
    await db.collection('carts').createIndex({ guestId: 1 });

    console.log('All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();

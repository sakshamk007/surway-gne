const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

module.exports = connectDB;
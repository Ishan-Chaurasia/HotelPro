const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB Connected]: Successfully established connection to ${conn.connection.host}`);
  } catch (error) {
    console.warn('----------------------------------------------------------------------');
    console.warn(`[MongoDB Connection Notice]: ${error.message}`);
    console.warn('To connect to MongoDB:');
    console.warn('1. Set your MongoDB Atlas connection string in server/.env:');
    console.warn('   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hotelpro?retryWrites=true&w=majority');
    console.warn('2. Or start your local MongoDB service: net start MongoDB');
    console.warn('----------------------------------------------------------------------');
  }
};

module.exports = connectDB;

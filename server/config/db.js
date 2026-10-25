const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    
    // Disable infinite buffering so queries fail immediately or fallback to mockStore if MongoDB is offline
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: Successfully connected to ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn('----------------------------------------------------------------------');
    console.warn(`[Local MongoDB Notice]: MongoDB is not currently running locally (${error.message}).`);
    console.warn('[Autonomous Fallback]: HotelPro is operating in Resilient In-Memory Mode.');
    console.warn('All features (Auth, Rooms, Bookings, Admin) are fully functional right now!');
    console.warn('To connect to MongoDB Atlas, add your connection string to server/.env');
    console.warn('----------------------------------------------------------------------');
  }
};

const isMongooseConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, isMongooseConnected };

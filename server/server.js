const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize MongoDB connection (falls back to resilient memory store if offline)
connectDB();

const app = express();

// Global Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'HotelPro API is live and operational',
    timestamp: new Date().toISOString(),
  });
});

// Primary API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Serve Frontend Static Build (Single-Port Turnkey Solution)
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================================`);
  console.log(`🏨 HotelPro Full-Stack Application is Live!`);
  console.log(`======================================================================`);
  console.log(`  ▸ Web Application & API : http://localhost:${PORT}`);
  console.log(`  ▸ Health Check Endpoint : http://localhost:${PORT}/api/health`);
  console.log(`  ▸ Demo Admin Login      : admin@hotelpro.com / admin123`);
  console.log(`  ▸ Demo Guest Login      : guest@hotelpro.com / guest123`);
  console.log(`======================================================================`);
});

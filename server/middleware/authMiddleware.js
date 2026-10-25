const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isMongooseConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hotelpro_super_secure_secret_key_2026_jwt_token'
      );

      if (isMongooseConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const u = mockStore.users.find((user) => user._id.toString() === decoded.id.toString());
        if (u) {
          const { password, ...rest } = u;
          req.user = rest;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or session expired' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin authorization required' });
  }
};

module.exports = { protect, adminOnly };

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, adminOnly, getAllBookings);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/status').put(protect, adminOnly, updateBookingStatus);
router.route('/:id/cancel').put(protect, cancelBooking);

module.exports = router;

const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { isMongooseConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Create a new booking with overlap collision detection
// @route   POST /api/bookings
// @access  Private (Guest / Admin)
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestsCount,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Room and check-in/check-out dates are required' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn) || isNaN(checkOut)) {
      return res.status(400).json({ message: 'Invalid dates provided' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (isMongooseConnected()) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Selected room not found' });
      }

      if (!room.isAvailable) {
        return res.status(400).json({ message: 'Room is currently under maintenance or unavailable' });
      }

      if (guestsCount && Number(guestsCount) > room.maxGuests) {
        return res.status(400).json({
          message: `Maximum allowed guests for this room is ${room.maxGuests}`,
        });
      }

      // Overlap algorithm
      const conflictingBooking = await Booking.findOne({
        room: roomId,
        bookingStatus: { $ne: 'Cancelled' },
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      });

      if (conflictingBooking) {
        return res.status(400).json({
          message:
            'This room is already reserved for the selected dates. Please choose different dates or select another room.',
        });
      }

      const diffTime = Math.abs(checkOut - checkIn);
      const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalAmount = totalNights * room.pricePerNight;

      const booking = new Booking({
        user: req.user._id,
        room: roomId,
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone || '',
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalNights,
        guestsCount: Number(guestsCount) || 1,
        totalAmount,
        specialRequests: specialRequests || '',
        paymentStatus: 'Paid',
        bookingStatus: 'Confirmed',
      });

      const createdBooking = await booking.save();
      const populated = await Booking.findById(createdBooking._id).populate('room');

      return res.status(201).json(populated);
    } else {
      // Memory Store Fallback
      const room = mockStore.rooms.find((r) => r._id.toString() === roomId.toString());
      if (!room) {
        return res.status(404).json({ message: 'Selected room not found' });
      }

      if (!room.isAvailable) {
        return res.status(400).json({ message: 'Room is currently under maintenance or unavailable' });
      }

      if (guestsCount && Number(guestsCount) > room.maxGuests) {
        return res.status(400).json({
          message: `Maximum allowed guests for this room is ${room.maxGuests}`,
        });
      }

      const conflicting = mockStore.bookings.find(
        (b) =>
          (b.room?._id || b.room).toString() === roomId.toString() &&
          b.bookingStatus !== 'Cancelled' &&
          new Date(b.checkInDate) < checkOut &&
          new Date(b.checkOutDate) > checkIn
      );

      if (conflicting) {
        return res.status(400).json({
          message:
            'This room is already reserved for the selected dates. Please choose different dates or select another room.',
        });
      }

      const diffTime = Math.abs(checkOut - checkIn);
      const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalAmount = totalNights * room.pricePerNight;

      const newBooking = {
        _id: 'mock_bk_' + Date.now(),
        user: req.user._id,
        room: room,
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone || '',
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalNights,
        guestsCount: Number(guestsCount) || 1,
        totalAmount,
        specialRequests: specialRequests || '',
        paymentStatus: 'Paid',
        bookingStatus: 'Confirmed',
        createdAt: new Date(),
      };

      mockStore.bookings.unshift(newBooking);
      return res.status(201).json(newBooking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings of current logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('room')
        .sort({ createdAt: -1 });

      return res.json(bookings);
    } else {
      const bookings = mockStore.bookings
        .filter((b) => b.user.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const bookings = await Booking.find({})
        .populate('room')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

      return res.json(bookings);
    } else {
      return res.json(mockStore.bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const booking = await Booking.findById(req.params.id)
        .populate('room')
        .populate('user', 'name email phone');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }

      return res.json(booking);
    } else {
      const booking = mockStore.bookings.find((b) => b._id.toString() === req.params.id.toString());
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;

    if (isMongooseConnected()) {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (bookingStatus) booking.bookingStatus = bookingStatus;
      if (paymentStatus) booking.paymentStatus = paymentStatus;

      const updated = await booking.save();
      const populated = await Booking.findById(updated._id)
        .populate('room')
        .populate('user', 'name email');

      return res.json(populated);
    } else {
      const index = mockStore.bookings.findIndex((b) => b._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (bookingStatus) mockStore.bookings[index].bookingStatus = bookingStatus;
      if (paymentStatus) mockStore.bookings[index].paymentStatus = paymentStatus;

      return res.json(mockStore.bookings[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (User or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      if (booking.bookingStatus === 'Cancelled') {
        return res.status(400).json({ message: 'This reservation is already cancelled' });
      }

      if (booking.bookingStatus === 'Checked-Out') {
        return res.status(400).json({ message: 'Cannot cancel a completed stay' });
      }

      booking.bookingStatus = 'Cancelled';
      booking.paymentStatus = 'Refunded';

      const updated = await booking.save();
      const populated = await Booking.findById(updated._id).populate('room');

      return res.json({ message: 'Booking cancelled successfully and refund issued', booking: populated });
    } else {
      const index = mockStore.bookings.findIndex((b) => b._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const booking = mockStore.bookings[index];
      if (booking.bookingStatus === 'Cancelled') {
        return res.status(400).json({ message: 'This reservation is already cancelled' });
      }

      booking.bookingStatus = 'Cancelled';
      booking.paymentStatus = 'Refunded';

      return res.json({ message: 'Booking cancelled successfully and refund issued', booking });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};

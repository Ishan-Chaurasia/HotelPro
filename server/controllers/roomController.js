const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search, and availability check
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, guests, search, checkIn, checkOut } = req.query;

    const filter = {};

    // Filter by room type
    if (type && type !== 'All') {
      filter.type = type;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    // Filter by minimum guests capacity
    if (guests) {
      filter.maxGuests = { $gte: Number(guests) };
    }

    // Text search in title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range availability filter
    if (checkIn && checkOut) {
      const parsedCheckIn = new Date(checkIn);
      const parsedCheckOut = new Date(checkOut);

      if (!isNaN(parsedCheckIn) && !isNaN(parsedCheckOut) && parsedCheckIn < parsedCheckOut) {
        const conflictingBookings = await Booking.find({
          bookingStatus: { $ne: 'Cancelled' },
          checkInDate: { $lt: parsedCheckOut },
          checkOutDate: { $gt: parsedCheckIn },
        }).select('room');

        const bookedRoomIds = conflictingBookings.map((b) => b.room);
        if (bookedRoomIds.length > 0) {
          filter._id = { $nin: bookedRoomIds };
        }
      }
    }

    const rooms = await Room.find(filter).sort({ pricePerNight: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const {
      title,
      roomNumber,
      type,
      pricePerNight,
      maxGuests,
      bedType,
      sizeSqFt,
      amenities,
      images,
      description,
    } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: `Room number ${roomNumber} already exists` });
    }

    const room = new Room({
      title,
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests) || 2,
      bedType: bedType || 'King Bed',
      sizeSqFt: Number(sizeSqFt) || 350,
      amenities: Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map((a) => a.trim())
        : [],
      images: Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'],
      description,
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if new roomNumber conflicts with another room
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const roomExists = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (roomExists) {
        return res.status(400).json({ message: `Room number ${req.body.roomNumber} is already in use` });
      }
    }

    if (req.body.amenities && typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities.split(',').map((a) => a.trim());
    }

    Object.assign(room, req.body);
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room has active bookings
    const activeBooking = await Booking.findOne({
      room: req.params.id,
      bookingStatus: { $in: ['Confirmed', 'Checked-In'] },
    });

    if (activeBooking) {
      return res.status(400).json({
        message: 'Cannot delete room with active or upcoming reservations. Cancel the reservations first.',
      });
    }

    await Room.deleteOne({ _id: req.params.id });
    res.json({ message: 'Room removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

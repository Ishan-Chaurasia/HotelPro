const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { isMongooseConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get all rooms with filtering, search, and availability check
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, guests, search, checkIn, checkOut } = req.query;

    if (isMongooseConnected()) {
      const filter = {};

      if (type && type !== 'All') {
        filter.type = type;
      }

      if (minPrice || maxPrice) {
        filter.pricePerNight = {};
        if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
      }

      if (guests) {
        filter.maxGuests = { $gte: Number(guests) };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { roomNumber: { $regex: search, $options: 'i' } },
        ];
      }

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
      return res.json(rooms);
    } else {
      // Memory Store Filter Fallback
      let result = [...mockStore.rooms];

      if (type && type !== 'All') {
        result = result.filter((r) => r.type.toLowerCase() === type.toLowerCase());
      }

      if (minPrice) {
        result = result.filter((r) => r.pricePerNight >= Number(minPrice));
      }
      if (maxPrice) {
        result = result.filter((r) => r.pricePerNight <= Number(maxPrice));
      }

      if (guests) {
        result = result.filter((r) => r.maxGuests >= Number(guests));
      }

      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.roomNumber.toLowerCase().includes(q)
        );
      }

      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        if (!isNaN(start) && !isNaN(end) && start < end) {
          const bookedRoomIds = mockStore.bookings
            .filter(
              (b) =>
                b.bookingStatus !== 'Cancelled' &&
                new Date(b.checkInDate) < end &&
                new Date(b.checkOutDate) > start
            )
            .map((b) => (b.room?._id || b.room).toString());

          result = result.filter((r) => !bookedRoomIds.includes(r._id.toString()));
        }
      }

      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
      return res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      return res.json(room);
    } else {
      const room = mockStore.rooms.find((r) => r._id.toString() === req.params.id.toString());
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      return res.json(room);
    }
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

    if (isMongooseConnected()) {
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
      return res.status(201).json(savedRoom);
    } else {
      const existingRoom = mockStore.rooms.find((r) => r.roomNumber === roomNumber);
      if (existingRoom) {
        return res.status(400).json({ message: `Room number ${roomNumber} already exists` });
      }

      const newRoom = {
        _id: 'mock_rm_' + Date.now(),
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
        rating: 4.8,
        reviewsCount: 12,
        isAvailable: true,
      };

      mockStore.rooms.unshift(newRoom);
      return res.status(201).json(newRoom);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

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
      return res.json(updatedRoom);
    } else {
      const index = mockStore.rooms.findIndex((r) => r._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (req.body.roomNumber && req.body.roomNumber !== mockStore.rooms[index].roomNumber) {
        const exists = mockStore.rooms.find((r) => r.roomNumber === req.body.roomNumber);
        if (exists) {
          return res.status(400).json({ message: `Room number ${req.body.roomNumber} is already in use` });
        }
      }

      mockStore.rooms[index] = { ...mockStore.rooms[index], ...req.body };
      return res.json(mockStore.rooms[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const activeBooking = await Booking.findOne({
        room: req.params.id,
        bookingStatus: { $in: ['Confirmed', 'Checked-In'] },
      });

      if (activeBooking) {
        return res.status(400).json({
          message: 'Cannot delete room with active reservations. Cancel the reservations first.',
        });
      }

      await Room.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Room removed successfully' });
    } else {
      const index = mockStore.rooms.findIndex((r) => r._id.toString() === req.params.id.toString());
      if (index === -1) {
        return res.status(404).json({ message: 'Room not found' });
      }

      mockStore.rooms.splice(index, 1);
      return res.json({ message: 'Room removed successfully' });
    }
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

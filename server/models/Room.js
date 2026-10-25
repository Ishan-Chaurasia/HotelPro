const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a room title'],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please specify the room number'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify the room type'],
      enum: ['Standard', 'Deluxe', 'Suite', 'Executive', 'Family'],
      default: 'Deluxe',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please specify the price per night'],
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please specify max allowed guests'],
      default: 2,
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 380,
    },
    amenities: {
      type: [String],
      default: [
        'Free High-Speed Wi-Fi',
        'Air Conditioning',
        'Flat-Screen Smart TV',
        'Private Bathroom',
        'Mini Fridge',
      ],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description for the room'],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);

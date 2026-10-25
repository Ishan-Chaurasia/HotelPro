const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();

const seedRooms = [
  {
    title: 'Presidential Oceanfront Penthouse Suite',
    roomNumber: 'PH-101',
    type: 'Suite',
    pricePerNight: 499,
    maxGuests: 4,
    bedType: '1 California King + 1 Queen Bed',
    sizeSqFt: 1100,
    amenities: [
      'Panoramic Oceanfront Balcony',
      'Private Jacuzzi Spa',
      'Free Ultra-Fast Wi-Fi',
      '65" 4K Smart OLED TV',
      'Fully Stocked Premium Bar',
      '24/7 Dedicated Butler Service',
      'Complimentary Gourmet Breakfast',
      'Nespresso Coffee Machine',
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Experience the pinnacle of luxury in our flagship Presidential Suite. Boasting wrap-around floor-to-ceiling glass windows overlooking the endless azure ocean, designer Italian furnishings, dual walk-in marble showers, and an expansive private terrace jacuzzi.',
    rating: 4.95,
    reviewsCount: 42,
    isAvailable: true,
  },
  {
    title: 'Executive Skyline City View Room',
    roomNumber: 'EX-402',
    type: 'Executive',
    pricePerNight: 289,
    maxGuests: 2,
    bedType: '1 King Bed',
    sizeSqFt: 520,
    amenities: [
      'Downtown Skyline View',
      'Executive Workstation & Ergonomic Chair',
      'High-Speed Wi-Fi',
      'Smart Climate Control',
      'Walk-in Rain Shower',
      'Luxury Bathrobes & Slippers',
      'Complimentary Lounge Access',
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Tailored for discerning business travelers and modern couples, the Executive Skyline room combines sleek contemporary elegance with productivity-enhancing amenities, sweeping skyline views, and private club lounge privileges.',
    rating: 4.88,
    reviewsCount: 31,
    isAvailable: true,
  },
  {
    title: 'Deluxe Garden Oasis Suite',
    roomNumber: 'DLX-205',
    type: 'Deluxe',
    pricePerNight: 219,
    maxGuests: 3,
    bedType: '1 King Bed + 1 Daybed',
    sizeSqFt: 620,
    amenities: [
      'Private Garden Veranda',
      'Plush Marble Bathroom & Deep Soaking Tub',
      'High-Speed Wi-Fi',
      '55" Smart TV',
      'Organic Herbal Teas & Coffee Bar',
      'Mini Refrigerator',
      'Air Conditioning',
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Immerse yourself in tranquility amidst our manicured botanical gardens. This deluxe room offers an expansive outdoor veranda, plush linens, hand-crafted wooden furnishings, and a spa-inspired bathroom.',
    rating: 4.79,
    reviewsCount: 28,
    isAvailable: true,
  },
  {
    title: 'Grand Family Vacation Suite',
    roomNumber: 'FAM-310',
    type: 'Family',
    pricePerNight: 349,
    maxGuests: 5,
    bedType: '2 Queen Beds + 1 Pullout Sofa',
    sizeSqFt: 850,
    amenities: [
      'Two Connecting Bedrooms',
      'Double Vanities & Bathtub',
      'Kid-Friendly Game Station & Board Games',
      'High-Speed Wi-Fi',
      'Microwave & Mini Kitchenette',
      'In-Room Safe',
      'Daily Family Breakfast Included',
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Designed with the comfort of the entire family in mind. Featuring two spacious bedroom zones, multiple entertainment setups, a kitchenette with refrigeration, and ample room to unwind together.',
    rating: 4.84,
    reviewsCount: 39,
    isAvailable: true,
  },
  {
    title: 'Modern Classic Standard Room',
    roomNumber: 'STD-104',
    type: 'Standard',
    pricePerNight: 129,
    maxGuests: 2,
    bedType: '1 Queen Bed',
    sizeSqFt: 340,
    amenities: [
      'Plush Memory Foam Mattress',
      'Fast Wi-Fi',
      'Private Ensuite Shower',
      'Smart TV with Streaming Apps',
      'Air Conditioning & Heating',
      'Work Desk',
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Our Standard Room offers exceptional comfort, contemporary aesthetics, and smart utility without breaking the budget. Perfect for weekend getaways, solo adventurers, and quick stopovers.',
    rating: 4.67,
    reviewsCount: 54,
    isAvailable: true,
  },
  {
    title: 'Azure Lagoon Poolside Villa',
    roomNumber: 'VIL-007',
    type: 'Suite',
    pricePerNight: 420,
    maxGuests: 3,
    bedType: '1 King Bed + Lounge Daybed',
    sizeSqFt: 780,
    amenities: [
      'Direct Lagoon Pool Access (Step-in)',
      'Private Sun Loungers & Cabana',
      'Outdoor Tropical Rain Shower',
      'Free Ultra-Fast Wi-Fi',
      'Espresso Machine',
      'Cocktail Hour Pass Included',
    ],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Step straight from your private wooden sun deck into the turquoise waters of our resort lagoon pool. Complete with tropical garden accents, outdoor shower, and secluded cabana.',
    rating: 4.92,
    reviewsCount: 22,
    isAvailable: true,
  },
  {
    title: 'Heritage Deluxe King Room',
    roomNumber: 'DLX-308',
    type: 'Deluxe',
    pricePerNight: 199,
    maxGuests: 2,
    bedType: '1 King Bed',
    sizeSqFt: 480,
    amenities: [
      'Artisan Teak Wood Furnishings',
      'Courtyard Fountain View',
      'Deep Clawfoot Soaking Tub',
      'Free Wi-Fi',
      'Boutique Toiletries',
      'Iron & Ironing Board',
    ],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Celebrate classic architecture blended with modern hospitality. Hand-carved accents, historical charm, and relaxing courtyard views make this room a timeless guest favorite.',
    rating: 4.75,
    reviewsCount: 19,
    isAvailable: true,
  },
  {
    title: 'Urban Studio Standard Twin',
    roomNumber: 'STD-215',
    type: 'Standard',
    pricePerNight: 139,
    maxGuests: 2,
    bedType: '2 Twin XL Beds',
    sizeSqFt: 360,
    amenities: [
      'Two Comfortable Twin Beds',
      'High-Speed Wi-Fi',
      'Soundproof Triple-Pane Windows',
      'Ensuite Bathroom',
      'USB Charging Ports at Bedside',
    ],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Ideal for friends, colleagues, or siblings traveling together. Quiet, comfortable, and centrally positioned with easy elevator access to dining and wellness facilities.',
    rating: 4.7,
    reviewsCount: 25,
    isAvailable: true,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder]: Purging existing records...');
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    console.log('[Seeder]: Creating default users...');
    const adminUser = await User.create({
      name: 'HotelPro Administrator',
      email: 'admin@hotelpro.com',
      password: 'admin123',
      phone: '+1 (555) 019-2834',
      role: 'admin',
    });

    const guestUser = await User.create({
      name: 'Alex Mercer',
      email: 'guest@hotelpro.com',
      password: 'guest123',
      phone: '+1 (555) 749-1029',
      role: 'guest',
    });

    console.log('[Seeder]: Creating curated hotel rooms...');
    const createdRooms = await Room.insertMany(seedRooms);

    console.log('[Seeder]: Creating sample initial booking for dashboard analytics...');
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 2);
    const checkOut = new Date(today);
    checkOut.setDate(today.getDate() + 5);

    await Booking.create({
      user: guestUser._id,
      room: createdRooms[0]._id,
      guestName: guestUser.name,
      guestEmail: guestUser.email,
      guestPhone: guestUser.phone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: 3,
      guestsCount: 2,
      totalAmount: createdRooms[0].pricePerNight * 3,
      specialRequests: 'High floor preferred, late arrival around 8 PM.',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
    });

    console.log('--------------------------------------------------');
    console.log('>>> HOTELPRO DATABASE SEEDED SUCCESSFULLY! <<<');
    console.log('--------------------------------------------------');
    console.log('Admin Account: admin@hotelpro.com / admin123');
    console.log('Guest Account: guest@hotelpro.com / guest123');
    console.log(`Rooms Created: ${createdRooms.length}`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();

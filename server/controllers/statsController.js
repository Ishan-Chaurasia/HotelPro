const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { isMongooseConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get admin statistics and analytics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const totalRooms = await Room.countDocuments({});
      const totalUsers = await User.countDocuments({ role: 'guest' });
      const allBookings = await Booking.find({});

      const totalBookings = allBookings.length;
      const activeBookings = allBookings.filter(
        (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In'
      ).length;

      const checkedInGuests = allBookings.filter(
        (b) => b.bookingStatus === 'Checked-In'
      ).length;

      const cancelledBookings = allBookings.filter(
        (b) => b.bookingStatus === 'Cancelled'
      ).length;

      const totalRevenue = allBookings
        .filter((b) => b.bookingStatus !== 'Cancelled' && b.paymentStatus === 'Paid')
        .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

      const occupancyRate =
        totalRooms > 0 ? Math.min(100, Math.round((checkedInGuests / totalRooms) * 100)) : 0;

      const recentBookings = await Booking.find({})
        .populate('room', 'title roomNumber type')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      const roomTypesCount = await Room.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 }, avgPrice: { $avg: '$pricePerNight' } } },
      ]);

      return res.json({
        kpis: {
          totalRevenue,
          totalBookings,
          activeBookings,
          checkedInGuests,
          cancelledBookings,
          totalRooms,
          totalUsers,
          occupancyRate,
        },
        recentBookings,
        roomTypes: roomTypesCount,
      });
    } else {
      // Memory Store Analytics
      const totalRooms = mockStore.rooms.length;
      const totalUsers = mockStore.users.filter((u) => u.role === 'guest').length;
      const allBookings = mockStore.bookings;

      const totalBookings = allBookings.length;
      const activeBookings = allBookings.filter(
        (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In'
      ).length;

      const checkedInGuests = allBookings.filter(
        (b) => b.bookingStatus === 'Checked-In'
      ).length;

      const cancelledBookings = allBookings.filter(
        (b) => b.bookingStatus === 'Cancelled'
      ).length;

      const totalRevenue = allBookings
        .filter((b) => b.bookingStatus !== 'Cancelled' && b.paymentStatus === 'Paid')
        .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

      const occupancyRate =
        totalRooms > 0 ? Math.min(100, Math.round((checkedInGuests / totalRooms) * 100)) : 0;

      const recentBookings = allBookings.slice(0, 5);

      const typeMap = {};
      mockStore.rooms.forEach((r) => {
        if (!typeMap[r.type]) {
          typeMap[r.type] = { count: 0, totalPrice: 0 };
        }
        typeMap[r.type].count++;
        typeMap[r.type].totalPrice += r.pricePerNight;
      });

      const roomTypesCount = Object.keys(typeMap).map((type) => ({
        _id: type,
        count: typeMap[type].count,
        avgPrice: Math.round(typeMap[type].totalPrice / typeMap[type].count),
      }));

      return res.json({
        kpis: {
          totalRevenue,
          totalBookings,
          activeBookings,
          checkedInGuests,
          cancelledBookings,
          totalRooms,
          totalUsers,
          occupancyRate,
        },
        recentBookings,
        roomTypes: roomTypesCount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};

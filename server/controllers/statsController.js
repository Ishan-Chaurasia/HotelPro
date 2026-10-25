const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get admin statistics and analytics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
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

    // Total revenue from non-cancelled bookings
    const totalRevenue = allBookings
      .filter((b) => b.bookingStatus !== 'Cancelled' && b.paymentStatus === 'Paid')
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    // Occupancy rate calculation
    const occupancyRate = totalRooms > 0 ? Math.min(100, Math.round((checkedInGuests / totalRooms) * 100)) : 0;

    // Recent 5 bookings
    const recentBookings = await Booking.find({})
      .populate('room', 'title roomNumber type')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Grouping by room types
    const roomTypesCount = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, avgPrice: { $avg: '$pricePerNight' } } },
    ]);

    res.json({
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};

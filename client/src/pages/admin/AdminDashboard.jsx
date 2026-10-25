import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  DollarSign,
  CalendarCheck,
  Users,
  BedDouble,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  Clock,
  Eye,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const recentBookings = stats?.recentBookings || [];
  const roomTypes = stats?.roomTypes || [];

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger px-3 py-1 rounded-pill small fw-semibold">
                ADMIN CONSOLE
              </span>
              <span className="text-muted small">Live Operations & Telemetry</span>
            </div>
            <h1 className="display-6 fw-bold font-serif text-dark mb-0">HotelPro Executive Overview</h1>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/rooms" className="btn btn-hotelpro d-flex align-items-center gap-1 rounded-pill px-3 py-2 shadow-sm">
              <PlusCircle size={18} />
              <span>Manage Inventory</span>
            </Link>
            <Link to="/admin/bookings" className="btn btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3 py-2 bg-white">
              <CalendarCheck size={18} />
              <span>All Bookings</span>
            </Link>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-bold">TOTAL REVENUE</span>
                <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                  <DollarSign size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark font-serif mb-1">
                ${kpis.totalRevenue?.toLocaleString() || 0}
              </h3>
              <div className="small text-success d-flex align-items-center gap-1">
                <ArrowUpRight size={14} /> From paid reservations
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-bold">TOTAL RESERVATIONS</span>
                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark font-serif mb-1">{kpis.totalBookings || 0}</h3>
              <div className="small text-muted">{kpis.activeBookings || 0} active & confirmed stays</div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-bold">OCCUPANCY RATE</span>
                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3">
                  <Activity size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark font-serif mb-1">{kpis.occupancyRate || 0}%</h3>
              <div className="small text-muted">{kpis.checkedInGuests || 0} rooms currently occupied</div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-bold">ROOM INVENTORY</span>
                <div className="p-2 bg-info bg-opacity-10 text-info rounded-3">
                  <BedDouble size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark font-serif mb-1">{kpis.totalRooms || 0}</h3>
              <div className="small text-muted">Across all luxury & standard tiers</div>
            </div>
          </div>
        </div>

        {/* Recent Reservations & Room Categories */}
        <div className="row g-4 mb-4">
          {/* Recent Reservations Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold font-serif mb-0">Recent Guest Reservations</h5>
                <Link to="/admin/bookings" className="text-primary small fw-bold text-decoration-none">
                  View All &rarr;
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="text-center py-4 text-muted small">No recent bookings recorded.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {recentBookings.map((b) => (
                        <tr key={b._id}>
                          <td>
                            <div className="fw-bold text-dark">{b.guestName}</div>
                            <div className="text-muted small">{b.guestEmail}</div>
                          </td>
                          <td>
                            <div className="fw-semibold">{b.room?.title || 'Room'}</div>
                            <span className="badge bg-light text-muted border">
                              #{b.room?.roomNumber}
                            </span>
                          </td>
                          <td>
                            <div>{new Date(b.checkInDate).toLocaleDateString()}</div>
                            <div className="text-muted small">
                              to {new Date(b.checkOutDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="fw-bold">${b.totalAmount}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                b.bookingStatus === 'Confirmed'
                                  ? 'bg-success'
                                  : b.bookingStatus === 'Checked-In'
                                  ? 'bg-primary'
                                  : b.bookingStatus === 'Checked-Out'
                                  ? 'bg-secondary'
                                  : 'bg-danger'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Room Categories Breakdown */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold font-serif mb-3">Inventory by Category</h5>
              <div className="d-flex flex-column gap-3">
                {roomTypes.map((rt) => (
                  <div key={rt._id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark">{rt._id} Tier</div>
                      <div className="text-muted small">
                        Avg: ${Math.round(rt.avgPrice)} / night
                      </div>
                    </div>
                    <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                      {rt.count} room{rt.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top">
                <Link to="/admin/rooms" className="btn btn-outline-primary w-100 rounded-pill py-2 small fw-semibold">
                  Manage Room Types & Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

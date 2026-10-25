import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  CalendarCheck,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Filter,
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      setSuccessMsg(`Reservation updated to ${newStatus}`);
      fetchBookings();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update reservation status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.room?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.room?.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b._id.includes(search);

    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Navigation & Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <Link to="/admin/dashboard" className="text-muted small text-decoration-none d-flex align-items-center gap-1 mb-1">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="display-6 fw-bold font-serif text-dark mb-0">Guest Reservations Engine</h1>
          </div>
          <div className="text-muted small">
            Total active & historical bookings: <strong className="text-dark">{bookings.length}</strong>
          </div>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2 small py-2 mb-4">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by guest name, email, room, or reference ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-muted flex-shrink-0" />
                <select
                  className="form-select bg-light"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Checked-Out">Checked-Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th>Booking Ref</th>
                  <th>Guest Contact</th>
                  <th>Room</th>
                  <th>Check-In & Out</th>
                  <th>Billing</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No reservations match the specified search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold">
                          #{b._id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-muted small mt-1">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td>
                        <div className="fw-bold text-dark">{b.guestName}</div>
                        <div className="text-muted small">{b.guestEmail}</div>
                        {b.guestPhone && <div className="text-muted small">{b.guestPhone}</div>}
                      </td>

                      <td>
                        <div className="fw-semibold text-dark">{b.room?.title || 'Room Removed'}</div>
                        <span className="badge bg-light text-primary border">
                          Room #{b.room?.roomNumber}
                        </span>
                      </td>

                      <td>
                        <div><strong>In:</strong> {new Date(b.checkInDate).toLocaleDateString()}</div>
                        <div><strong>Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}</div>
                        <div className="text-muted small">
                          ({b.totalNights} night{b.totalNights > 1 ? 's' : ''}, {b.guestsCount} guests)
                        </div>
                      </td>

                      <td>
                        <div className="fw-bold text-dark fs-6">${b.totalAmount}</div>
                        <span
                          className={`badge ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-success'
                              : b.paymentStatus === 'Refunded'
                              ? 'bg-secondary'
                              : 'bg-warning'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>

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

                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={b.bookingStatus}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Checked-In">Check In</option>
                          <option value="Checked-Out">Check Out</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BedDouble,
  ArrowRight,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund will be initiated.')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      setMessage(res.data.message || 'Reservation cancelled successfully');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">Confirmed</span>;
      case 'Checked-In':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill">Checked In</span>;
      case 'Checked-Out':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 rounded-pill">Checked Out</span>;
      case 'Cancelled':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reservations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <div>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">My Reservations</h1>
            <p className="text-muted small mb-0">Track and manage your upcoming stays, receipts, and bookings</p>
          </div>
          <Link to="/rooms" className="btn btn-hotelpro d-inline-flex align-items-center gap-1 rounded-pill">
            <BedDouble size={18} />
            <span>Book Another Stay</span>
          </Link>
        </div>

        {message && (
          <div className="alert alert-success alert-dismissible fade show small py-2 mb-4" role="alert">
            {message}
            <button type="button" className="btn-close py-2" onClick={() => setMessage('')}></button>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="mb-3 text-muted">
              <Calendar size={48} className="opacity-50" />
            </div>
            <h4 className="fw-bold font-serif text-dark">No Reservations Found</h4>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 420 }}>
              You haven't made any hotel reservations yet. Browse our luxury suites and plan your next peaceful retreat today!
            </p>
            <div>
              <Link to="/rooms" className="btn btn-hotelpro px-4 py-2 rounded-pill">
                Explore Available Rooms
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => {
              const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isCancellable =
                booking.bookingStatus === 'Confirmed' &&
                new Date(booking.checkInDate) > new Date();

              return (
                <div key={booking._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="row g-3 align-items-center">
                      {/* Room Thumbnail */}
                      <div className="col-md-3">
                        <div className="rounded-3 overflow-hidden" style={{ height: '140px' }}>
                          <img
                            src={
                              booking.room?.images?.[0] ||
                              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
                            }
                            alt="Room"
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="col-md-5">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-light text-muted border small">
                            #{booking._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-muted small">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="fw-bold text-dark font-serif mb-2">
                          {booking.room?.title || 'Luxury Accommodation'}
                        </h5>
                        <div className="text-muted small d-flex flex-wrap gap-3">
                          <span>
                            <strong>Dates:</strong> {checkIn} &rarr; {checkOut}
                          </span>
                          <span>
                            <strong>Stay:</strong> {booking.totalNights} night{booking.totalNights > 1 ? 's' : ''}
                          </span>
                          <span>
                            <strong>Guests:</strong> {booking.guestsCount}
                          </span>
                        </div>
                      </div>

                      {/* Status & Pricing */}
                      <div className="col-md-2 text-md-center">
                        <div className="mb-2">{getStatusBadge(booking.bookingStatus)}</div>
                        <div className="fw-bold fs-5 text-dark">${booking.totalAmount}</div>
                        <div className="small text-muted">
                          Payment: <span className="text-success fw-semibold">{booking.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-md-2 text-md-end">
                        {isCancellable && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 w-100 mb-2"
                            disabled={actionLoading}
                          >
                            Cancel Stay
                          </button>
                        )}
                        <Link
                          to={`/rooms/${booking.room?._id}`}
                          className="btn btn-light btn-sm rounded-pill px-3 py-2 w-100 text-muted"
                        >
                          View Room
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

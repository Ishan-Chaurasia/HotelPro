import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bed,
  Users,
  Maximize2,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Star,
  ArrowLeft,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Booking Form State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');

  const [errorMessage, setErrorMessage] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        setErrorMessage('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone && user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  // Calculate nights & pricing
  const calculatePricing = () => {
    if (!checkInDate || !checkOutDate || !room) return { nights: 0, subtotal: 0, tax: 0, total: 0 };
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = nights * room.pricePerNight;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    return { nights, subtotal, tax, total };
  };

  const { nights, subtotal, tax, total } = calculatePricing();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guestsCount: Number(guestsCount),
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
      };

      const res = await api.post('/bookings', payload);
      setSuccessBooking(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete booking. Please try again.';
      setErrorMessage(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading room...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">Room Not Found</h3>
        <p className="text-muted">The requested room does not exist or has been removed.</p>
        <Link to="/rooms" className="btn btn-hotelpro">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="py-4">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link to="/rooms" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Rooms Catalog
          </Link>
        </div>

        {/* Room Header Info */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary px-3 py-1 rounded-pill">{room.type}</span>
              <span className="badge bg-light text-dark border px-2 py-1 rounded-pill">
                Room #{room.roomNumber}
              </span>
              <span className="d-inline-flex align-items-center gap-1 small fw-bold text-dark">
                <Star size={14} className="text-warning fill-warning" />
                {room.rating || 4.8} ({room.reviewsCount || 24} verified guest reviews)
              </span>
            </div>
            <h1 className="display-6 fw-bold font-serif text-dark mb-0">{room.title}</h1>
          </div>

          <div className="text-md-end">
            <div className="text-muted small">Nightly Rate</div>
            <div className="display-6 fw-bold text-primary font-serif">
              ${room.pricePerNight} <span className="fs-6 text-muted fw-normal">/ night</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '460px' }}>
              <img
                src={images[activeImage]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
          <div className="col-lg-4 d-flex flex-column gap-3">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`rounded-3 overflow-hidden cursor-pointer border-2 transition ${
                  activeImage === idx ? 'border-primary shadow' : 'opacity-75'
                }`}
                style={{ height: '140px', cursor: 'pointer' }}
                onClick={() => setActiveImage(idx)}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-100 h-100 object-fit-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content & Booking Split */}
        <div className="row g-5">
          {/* Left Column: Details, Specs, Amenities */}
          <div className="col-lg-7">
            {/* Quick Specs */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold mb-3 font-serif">Key Accommodations & Specs</h5>
              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <Users size={22} className="text-primary mb-1" />
                    <div className="small text-muted">Max Capacity</div>
                    <div className="fw-bold text-dark">{room.maxGuests} Guests</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <Bed size={22} className="text-primary mb-1" />
                    <div className="small text-muted">Bed Arrangement</div>
                    <div className="fw-bold text-dark">{room.bedType || 'King Bed'}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <Maximize2 size={22} className="text-primary mb-1" />
                    <div className="small text-muted">Room Area</div>
                    <div className="fw-bold text-dark">{room.sizeSqFt || 400} sq.ft</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold mb-3 font-serif">About This Space</h5>
              <p className="text-secondary leading-relaxed mb-0">{room.description}</p>
            </div>

            {/* Amenities List */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold mb-3 font-serif">Included Amenities & Services</h5>
              <div className="row g-3">
                {room.amenities.map((amenity, i) => (
                  <div key={i} className="col-md-6 d-flex align-items-center gap-2 text-dark small">
                    <CheckCircle size={18} className="text-success flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee Policy */}
            <div className="p-3 bg-light rounded-4 d-flex align-items-center gap-3 border">
              <ShieldCheck size={32} className="text-primary flex-shrink-0" />
              <div className="small">
                <strong>HotelPro Collision-Free Guarantee:</strong> When you book, your reservation is instantly synchronized with our centralized engine, preventing duplicate bookings.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Widget */}
          <div className="col-lg-5">
            <div className="card border-0 shadow rounded-4 p-4 bg-white sticky-top" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h4 className="fw-bold font-serif mb-0">Reserve Room</h4>
                <div className="text-end">
                  <span className="fs-5 fw-bold text-primary">${room.pricePerNight}</span>
                  <span className="small text-muted"> / night</span>
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {successBooking ? (
                <div className="text-center py-4">
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-inline-flex mb-3">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="fw-bold font-serif text-dark mb-1">Reservation Confirmed!</h4>
                  <p className="text-muted small mb-3">
                    Your booking reference is <strong className="text-dark">#{successBooking._id.slice(-6).toUpperCase()}</strong>.
                  </p>
                  <div className="card bg-light p-3 small text-start mb-4 rounded-3">
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Room:</span>
                      <span className="fw-bold">{room.title}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Dates:</span>
                      <span className="fw-bold">{checkInDate} to {checkOutDate}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1">
                      <span className="text-muted">Total Paid:</span>
                      <span className="fw-bold text-success">${successBooking.totalAmount}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="btn btn-hotelpro w-100 rounded-pill py-2"
                  >
                    View in My Bookings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {/* Dates */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Check-In</label>
                      <input
                        type="date"
                        className="form-control"
                        min={today}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Check-Out</label>
                      <input
                        type="date"
                        className="form-control"
                        min={checkInDate || today}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Total Guests</label>
                    <select
                      className="form-select"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                    >
                      {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''} (Max {room.maxGuests})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guest Contact Information */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Guest Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="guest@domain.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+1 (555) 000-0000"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Special Requests (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Early check-in, quiet floor, extra pillows..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Price Calculation Card */}
                  <div className="p-3 bg-light rounded-3 small mb-3 border">
                    <div className="d-flex justify-content-between py-1 text-muted">
                      <span>${room.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1 text-muted">
                      <span>Hospitality Taxes & Service Fee (10%)</span>
                      <span>${tax}</span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 mt-2 border-top fw-bold text-dark fs-6">
                      <span>Total Due</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-hotelpro btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Confirm & Complete Reservation</span>
                      </>
                    )}
                  </button>

                  {!user && (
                    <div className="text-center text-muted small mt-2">
                      You will be asked to sign in or register to finalize this stay.
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

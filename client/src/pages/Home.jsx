import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import {
  Calendar,
  Users,
  Search,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Headphones,
  Award,
  ArrowRight,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const today = new Date().toISOString().split('T')[0];
  const nextTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(nextTwoDays);
  const [roomType, setRoomType] = useState('All');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/rooms');
        setFeaturedRooms(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.append('checkIn', checkIn);
    if (checkOut) query.append('checkOut', checkOut);
    if (roomType && roomType !== 'All') query.append('type', roomType);
    if (guests) query.append('guests', guests);

    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center position-relative">
        <div className="container py-4">
          <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur px-3 py-1 rounded-pill mb-3 border border-light border-opacity-25">
            <Sparkles size={16} className="text-warning" />
            <span className="small text-uppercase tracking-wider fw-bold">
              Complete Hotel Booking & Hospitality Suite
            </span>
          </div>

          <h1 className="display-4 fw-bold mb-3 font-serif">
            Luxury Stays, Simplified Reservations
          </h1>
          <p className="lead mx-auto text-light opacity-90 mb-4" style={{ maxWidth: 720 }}>
            Experience seamless room bookings, instant availability verification, and enterprise-grade hospitality operations with HotelPro.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/rooms" className="btn btn-gold btn-lg rounded-pill px-4 shadow">
              Browse All Rooms
            </Link>
            <a href="#search-bar" className="btn btn-outline-light btn-lg rounded-pill px-4">
              Check Availability
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Booking Search Widget */}
      <div className="container" id="search-bar">
        <div className="search-card p-4 mx-auto" style={{ maxWidth: 1040 }}>
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={15} className="text-primary" /> Check-in Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={15} className="text-primary" /> Check-out Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-2 col-md-4">
                <label className="form-label small fw-bold text-muted">Room Type</label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-4">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Users size={15} className="text-primary" /> Guests
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-4">
                <button
                  type="submit"
                  className="btn btn-hotelpro btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Trust & Performance Metrics */}
      <section className="py-5 bg-white border-bottom mt-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold text-primary mb-1">99.8%</div>
              <div className="text-muted small">Real-Time Booking Accuracy</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold text-primary mb-1">Zero</div>
              <div className="text-muted small">Double-Booking Collision</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold text-primary mb-1">4.9 / 5</div>
              <div className="text-muted small">Guest Satisfaction Score</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="h2 fw-bold text-primary mb-1">24 / 7</div>
              <div className="text-muted small">Concierge & Admin Ops</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites & Rooms */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-primary fw-bold text-uppercase small tracking-wider">
                Exquisite Accommodations
              </span>
              <h2 className="display-6 fw-bold text-dark font-serif mt-1">
                Featured Luxury Suites
              </h2>
            </div>
            <Link
              to="/rooms"
              className="text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 mt-2 mt-md-0"
            >
              Explore all accommodations <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading suites...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {featuredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose HotelPro */}
      <section className="py-5 bg-light border-top">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="text-primary fw-bold text-uppercase small tracking-wider">
              Hospitality Excellence
            </span>
            <h2 className="display-6 fw-bold font-serif mt-1">Why Travelers & Managers Rely on HotelPro</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <ShieldCheck size={28} />
                </div>
                <h5 className="fw-bold text-dark">Strict Overlap Collision Prevention</h5>
                <p className="text-muted small mb-0">
                  Our backend scheduling engine performs dynamic intersection queries, guaranteeing that rooms can never be double-booked across conflicting dates.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <CreditCard size={28} />
                </div>
                <h5 className="fw-bold text-dark">Seamless Payment & Confirmation</h5>
                <p className="text-muted small mb-0">
                  Instant booking receipts, transparent billing breakdown, and easy one-click reservation tracking with instant refund processing on cancellations.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
                  <Headphones size={28} />
                </div>
                <h5 className="fw-bold text-dark">Full-Featured Admin Management</h5>
                <p className="text-muted small mb-0">
                  Complete operational control for hotel managers: live occupancy graphs, room inventory updates, guest check-in/out transitions, and revenue metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

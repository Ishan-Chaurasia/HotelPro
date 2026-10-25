import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import { Filter, Search, RotateCcw, Calendar, SlidersHorizontal, BedDouble } from 'lucide-react';

const roomTypes = ['All', 'Standard', 'Deluxe', 'Suite', 'Executive', 'Family'];

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '600');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType && selectedType !== 'All') params.type = selectedType;
      if (searchQuery) params.search = searchQuery;
      if (maxPrice) params.maxPrice = maxPrice;
      if (guests) params.guests = guests;
      if (checkIn && checkOut) {
        params.checkIn = checkIn;
        params.checkOut = checkOut;
      }

      const res = await api.get('/rooms', { params });
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType, maxPrice, guests, checkIn, checkOut]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetFilters = () => {
    setSelectedType('All');
    setSearchQuery('');
    setMaxPrice('600');
    setGuests('');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Title Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            Luxury Suites & Rooms
          </span>
          <h1 className="display-5 fw-bold font-serif text-dark">Find Your Perfect Sanctuary</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
            Browse through our hand-picked inventory of ultra-luxury suites and comfortable standard rooms. Real-time availability verified on every search.
          </p>
        </div>

        {/* Filter Toolbar Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-center">
              {/* Keyword Search */}
              <div className="col-lg-4 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search by name, amenity, room #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div className="col-lg-2 col-md-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 small px-2">In</span>
                  <input
                    type="date"
                    className="form-control bg-light border-start-0 small"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="col-lg-2 col-md-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 small px-2">Out</span>
                  <input
                    type="date"
                    className="form-control bg-light border-start-0 small"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Slider */}
              <div className="col-lg-2 col-md-6">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Max Price:</span>
                  <span className="fw-bold text-dark">${maxPrice}/night</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="100"
                  max="600"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-lg-2 col-md-6 d-flex gap-2">
                <button type="submit" className="btn btn-hotelpro flex-grow-1">
                  Filter
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-outline-secondary"
                  title="Reset all filters"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Room Type Pill Selector */}
            <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top align-items-center">
              <span className="small fw-bold text-muted me-2 d-flex align-items-center gap-1">
                <SlidersHorizontal size={14} /> Category:
              </span>
              {roomTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                    selectedType === type
                      ? 'btn-primary shadow-sm'
                      : 'btn-outline-secondary border-0 bg-light text-dark'
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Room Grid Results */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted small">
            Showing <strong className="text-dark">{rooms.length}</strong> available accommodations
          </div>
          {checkIn && checkOut && (
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 rounded-pill small">
              ✓ Availability filtered for {checkIn} to {checkOut}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading rooms...</span>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="card text-center py-5 border-0 shadow-sm rounded-4 bg-white">
            <div className="mb-3 text-muted">
              <BedDouble size={48} className="opacity-50" />
            </div>
            <h4 className="fw-bold font-serif text-dark">No Available Rooms Found</h4>
            <p className="text-muted mx-auto small mb-4" style={{ maxWidth: 450 }}>
              No rooms matched your selected search criteria or dates. Try adjusting the price slider or resetting your filters.
            </p>
            <div>
              <button onClick={handleResetFilters} className="btn btn-hotelpro px-4 py-2 rounded-pill">
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;

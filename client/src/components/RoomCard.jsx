import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, Maximize2, Star, ArrowRight } from 'lucide-react';

const RoomCard = ({ room }) => {
  const primaryImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="hotel-card h-100 d-flex flex-column">
        {/* Room Image Container */}
        <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
          <img
            src={primaryImage}
            alt={room.title}
            className="w-100 h-100 object-fit-cover transition"
            style={{ transition: 'transform 0.5s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          />
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-dark bg-opacity-75 backdrop-blur px-3 py-2 rounded-pill fw-semibold shadow-sm">
              {room.type}
            </span>
          </div>
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-white text-dark px-2 py-1 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-1">
              <Star size={13} className="text-warning fill-warning" />
              {room.rating || 4.8}
            </span>
          </div>
          <div className="position-absolute bottom-0 start-0 m-3">
            <span className="badge bg-primary px-2 py-1 rounded-2 small">
              Room #{room.roomNumber}
            </span>
          </div>
        </div>

        {/* Room Details Body */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          <h5 className="fw-bold mb-2 text-dark font-serif" style={{ fontSize: '1.2rem', minHeight: '2.8rem' }}>
            {room.title}
          </h5>

          {/* Room Specs */}
          <div className="d-flex align-items-center justify-content-between text-muted small py-2 border-bottom border-top my-2">
            <span className="d-flex align-items-center gap-1">
              <Users size={16} className="text-primary" />
              {room.maxGuests} Guests
            </span>
            <span className="d-flex align-items-center gap-1">
              <Bed size={16} className="text-primary" />
              {room.bedType || 'King Bed'}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Maximize2 size={16} className="text-primary" />
              {room.sizeSqFt || 380} sq.ft
            </span>
          </div>

          <p className="text-secondary small mt-2 mb-3 line-clamp-2" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '38px',
          }}>
            {room.description}
          </p>

          {/* Pricing & Call to Action */}
          <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small">Starting from</div>
              <div className="fs-5 fw-bold text-dark">
                ${room.pricePerNight} <span className="fs-6 text-muted fw-normal">/ night</span>
              </div>
            </div>
            <Link
              to={`/rooms/${room._id}`}
              className="btn btn-hotelpro d-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm"
            >
              <span>View & Book</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

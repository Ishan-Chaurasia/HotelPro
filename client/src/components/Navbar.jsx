import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, LogOut, CalendarCheck, ShieldCheck, BedDouble, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark fs-4">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Hotel size={22} />
          </div>
          <span className="font-serif tracking-tight">
            Hotel<span className="text-primary">Pro</span>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarMain">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 ${isActive ? 'text-primary' : 'text-secondary'}`
                }
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `nav-link fw-semibold px-2 d-flex align-items-center gap-1 ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <BedDouble size={18} />
                Explore Rooms
              </NavLink>
            </li>
          </ul>

          {/* User Controls */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-outline-primary d-flex align-items-center gap-1 fw-semibold py-2 px-3 rounded-pill"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShieldCheck size={18} className="text-primary" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="btn btn-outline-primary d-flex align-items-center gap-1 fw-semibold py-2 px-3 rounded-pill"
                    onClick={() => setIsOpen(false)}
                  >
                    <CalendarCheck size={18} />
                    My Bookings
                  </Link>
                )}

                <div className="dropdown">
                  <button
                    className="btn btn-light d-flex align-items-center gap-2 border py-2 px-3 rounded-pill shadow-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontSize: '0.85rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold small text-truncate" style={{ maxWidth: 110 }}>
                      {user.name}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2 rounded-3">
                    <li className="px-3 py-2 small border-bottom mb-2">
                      <div className="fw-bold text-dark">{user.name}</div>
                      <div className="text-muted small">{user.email}</div>
                      <span className={`badge mt-1 ${isAdmin ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </li>
                    {isAdmin && (
                      <>
                        <li>
                          <Link className="dropdown-item py-2 rounded-2" to="/admin/dashboard">
                            Admin Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item py-2 rounded-2" to="/admin/rooms">
                            Manage Inventory
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item py-2 rounded-2" to="/admin/bookings">
                            Manage Bookings
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                      </>
                    )}
                    {!isAdmin && (
                      <li>
                        <Link className="dropdown-item py-2 rounded-2" to="/my-bookings">
                          My Reservations
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item py-2 text-danger rounded-2 d-flex align-items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-secondary px-3 py-2 fw-semibold rounded-pill"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-hotelpro px-4 py-2 rounded-pill shadow-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

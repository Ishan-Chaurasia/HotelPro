import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Hotel size={22} />
              </div>
              <span className="font-serif fs-4 fw-bold">
                Hotel<span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4">
              Your ultimate hotel booking and operations management suite. Empowering modern hospitality with seamless booking flows, real-time availability sync, and institutional security.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small">
              ★★★★★ <span className="text-secondary">(4.9/5 from 1,200+ guests)</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3 font-serif">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">All Rooms & Suites</Link></li>
              <li><Link to="/rooms?type=Suite" className="text-secondary text-decoration-none">Presidential Suites</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none">Guest Portal</Link></li>
              <li><Link to="/admin/dashboard" className="text-secondary text-decoration-none">Admin Workspace</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 font-serif">Hospitality Tech</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li>MERN Full Stack Architecture</li>
              <li>Real-time Collision Avoidance</li>
              <li>JWT Authentication & Role Control</li>
              <li>Interactive Analytics Dashboard</li>
              <li>Responsive Bootstrap 5 UI</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 font-serif">Contact Concierge</h6>
            <ul className="list-unstyled small d-flex flex-column gap-3 text-secondary">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <span>742 Evergreen Promenade, Grand Bay</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span>+1 (800) 555-HOTELPRO</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>concierge@hotelpro.io</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4 opacity-25" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} HotelPro Solution. All rights reserved. Built for SkillWallet Capstone Evaluation.
          </div>
          <div className="mt-2 mt-md-0 d-flex align-items-center gap-1">
            Engineered with <Heart size={14} className="text-danger fill-danger" /> by MERN Full-Stack Developer
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

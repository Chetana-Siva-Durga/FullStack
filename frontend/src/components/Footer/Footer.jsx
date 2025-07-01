import React from 'react';
import './Footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className='footer' id="footer">
      <div className="footer-content">

        <div className="footer-content-left">
          <h2 className="footer-logo">
            <span className="logo-f">F</span>lavour <span className="logo-f">D</span>ash
          </h2>
          <p className="footer-tagline">Delivering Happiness, One Bite at a Time</p>
          <div className="footer-social-icons">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/#home-section">Home</Link></li>
<li><Link to="/#cravings-section">Cravings</Link></li>
<li><Link to="/#hotspots-section">Hotspots</Link></li>
<li><Link to="/#about-section">About</Link></li>
<li><Link to="/#contact-section">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h3>Contact Us</h3>
          <p><i className="fas fa-map-marker-alt"></i> Hyderabad, Andhra Pradesh, India</p>
          <p><i className="fas fa-phone"></i> <a href="tel:+919393045999">+91 93930 45999</a></p>
          <p><i className="fas fa-envelope"></i> <a href="mailto:chetanasivadurga@gmail.com">chetanasivadurga@gmail.com</a></p>
        </div>

      </div>

      <hr />

      <p className="footer-bottom-text">
        &copy; 2025 Flavour Dash — Bringing Flavor to Your Doorstep.
      </p>
    </footer>
  );
};

export default Footer;

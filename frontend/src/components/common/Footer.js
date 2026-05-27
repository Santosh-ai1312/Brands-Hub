import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--yellow)' }}>BRANDS</span>
            <span>HUB</span>
          </div>
          <p>Premium men's fashion curated for the modern gentleman. Quality you can see, style you can feel.</p>
          <div className="social-links">
            <a href="#" className="social-btn"><FaInstagram /></a>
            <a href="#" className="social-btn"><FaFacebook /></a>
            <a href="#" className="social-btn"><FaWhatsapp /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop?category=SHIRTS">Shirts</Link>
          <Link to="/shop?category=T_SHIRTS">T-Shirts</Link>
          <Link to="/shop?category=JEANS">Jeans</Link>
          <Link to="/shop?category=JACKETS">Jackets</Link>
          <Link to="/shop?category=ETHNIC">Ethnic Wear</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Size Guide</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="#">📞 +91 98765 43210</a>
          <a href="#">✉️ hello@brandshub.in</a>
          <a href="#">📍 Bangalore, India</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 BRANDS HUB. All rights reserved. | Powered by Spring Boot + React</p>
      </div>
    </div>
  </footer>
);

export default Footer;

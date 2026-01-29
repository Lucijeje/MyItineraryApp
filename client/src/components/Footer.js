import React from 'react';
import Logo from './Logo';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-logo">
            <Logo />
          </div>
          <p>&copy; {currentYear} My Itinerary App. All rights reserved.</p>
          <div className="footer-decoration"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

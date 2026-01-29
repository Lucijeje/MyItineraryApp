import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="app-logo">
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        {/* Map/Book shape */}
        <rect 
          x="6" 
          y="4" 
          width="20" 
          height="24" 
          rx="2" 
          fill="url(#gradient1)" 
          stroke="url(#gradient2)" 
          strokeWidth="1.5"
        />
        {/* Map lines / Book pages */}
        <path 
          d="M10 10L22 10M10 14L18 14M10 18L20 18M10 22L16 22" 
          stroke="url(#gradient3)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        {/* Location pin */}
        <circle cx="20" cy="12" r="2.5" fill="white" opacity="0.9"/>
        <circle cx="20" cy="12" r="1.5" fill="url(#gradient3)"/>
        {/* Fold corner (book/map detail) */}
        <path 
          d="M6 4L6 8L10 4L6 4Z" 
          fill="url(#gradient2)" 
          opacity="0.6"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-text">My Itinerary App</span>
    </div>
  );
}

export default Logo;

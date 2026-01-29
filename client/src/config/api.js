// API configuration
// In production, this should point to your backend server
// For GitHub Pages, you'll need to host the backend separately or use a service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';

// Log API URL in development to help debug
if (process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

export default API_BASE_URL;

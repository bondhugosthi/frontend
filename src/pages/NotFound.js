import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <FaSearch />
        </div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

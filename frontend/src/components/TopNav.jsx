import React from 'react';
import { Link } from 'react-router-dom';
import '../components/TopNav.css';

const TopNav = () => {
  // Mock authentication status - replace with actual auth context
  const isAuthenticated = false; // Set to true to see profile section

  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <Link to="/" className="top-nav-logo">TaskMoRen</Link>
      </div>
      <div className="top-nav-actions">
        {isAuthenticated ? (
          <div className="profile-section">
            <div className="profile-info">
              <span className="profile-name">John Doe</span>
              <span className="profile-role">Admin</span>
            </div>
            <div className="profile-avatar">JD</div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav; 
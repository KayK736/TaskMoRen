import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/TopNav.css';
import { AuthContext } from '../context/AuthContext';

const TopNav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <Link to="/dashboard" className="top-nav-logo">TaskMoRen</Link>
      </div>
      <div className="top-nav-actions">
        {user ? (
          <div className="profile-section" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <div className="profile-info">
              <span className="profile-name">{user.name || 'User'}</span>
              <span className="profile-role">{user.role || 'N/A'}</span>
            </div>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            )}
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav; 
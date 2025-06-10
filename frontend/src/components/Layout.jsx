import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HouseFill, ListTask, PlusLg, CalendarCheck, BellFill, InfoCircleFill, EnvelopeFill, BoxArrowRight } from 'react-bootstrap-icons';
import '../components/Layout.css';
import TopNav from './TopNav';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <HouseFill /> },
    { path: '/tasks', label: 'Tasks', icon: <ListTask /> },
    { path: '/schedule-plan', label: 'Schedule Plan', icon: <CalendarCheck /> },
    { path: '/notifications', label: 'Notifications', icon: <BellFill /> },
    { path: '/about-us', label: 'About Us', icon: <InfoCircleFill /> },
    { path: '/contact-us', label: 'Contact Us', icon: <EnvelopeFill /> },
  ];

  return (
    <div className="layout">
      <TopNav />
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>TaskMoRen</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="nav-item logout-button">
            <span className="nav-icon"><BoxArrowRight /></span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <p>© 2024 TaskMoRen</p>
          <p>Version 1.0.0</p>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 
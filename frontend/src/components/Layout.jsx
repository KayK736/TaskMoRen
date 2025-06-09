import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/tasks/new', label: 'New Task', icon: '➕' },
    { path: '/schedule', label: 'Schedule Plan', icon: '📅' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/about', label: 'About Us', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact Us', icon: '📧' },
  ];

  return (
    <div className="layout">
      {/* Sidebar Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1>TaskMoRen</h1>
          <p>Task Management System</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 TaskMoRen</p>
          <p>Version 1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, isAdminRoute = false, redirectPath = '/login' }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAdminRoute) {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return <Navigate to={redirectPath} replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 
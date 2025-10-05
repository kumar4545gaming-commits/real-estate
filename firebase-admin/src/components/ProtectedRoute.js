import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, adminData } = useAuth();

  if (!currentUser || !adminData) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

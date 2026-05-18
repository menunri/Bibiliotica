import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user?.admin_id) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
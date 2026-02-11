import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

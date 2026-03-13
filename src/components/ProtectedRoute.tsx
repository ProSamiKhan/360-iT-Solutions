import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfile, UserRole } from '../types';

interface ProtectedRouteProps {
  user: UserProfile | null;
  requiredRole?: UserRole;
  children: React.ReactNode;
}

export default function ProtectedRoute({ user, requiredRole, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

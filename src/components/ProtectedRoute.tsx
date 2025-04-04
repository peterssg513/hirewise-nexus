
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, profile, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check role if provided
  if (allowedRoles.length > 0 && profile?.role && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  // All checks passed, render the child components
  return <>{children}</>;
};

export default ProtectedRoute;

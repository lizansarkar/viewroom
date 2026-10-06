import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - Safeguards authenticated platform routes
 * Redirects unauthenticated visitors to /sign-in while preserving return location
 */
export default function ProtectedRoute({ children, allowGuest = false, requiredRoles = [] }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // If route strictly requires authentication and user is not logged in
  if (!isLoggedIn && !allowGuest) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If specific role permission is needed
  if (requiredRoles.length > 0 && user?.role) {
    const hasRole = requiredRoles.includes(user.role.toUpperCase());
    if (!hasRole) {
      return <Navigate to="/explore" replace />;
    }
  }

  return children;
}

import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth, Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireOnboardingCompleted?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireOnboardingCompleted = false
}) => {
  const { isAuthenticated, user, isLoading, onboardingStep } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e40af]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOnboardingCompleted && onboardingStep !== 'COMPLETED') {
    if (onboardingStep === 'PENDING_EMAIL') {
      return <Navigate to="/onboarding/email" replace />;
    }
    if (onboardingStep === 'PENDING_PROFILE') {
      return <Navigate to="/onboarding/profile" replace />;
    }
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

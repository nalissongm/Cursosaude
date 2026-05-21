import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { isAuthenticated, onboardingStep, isLoading } = useAuth();
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

  // Handle standard restriction
  if (requireOnboarding && onboardingStep !== 'COMPLETED') {
    if (onboardingStep === 'PENDING_EMAIL') return <Navigate to="/onboarding/email" replace />;
    if (onboardingStep === 'PENDING_PROFILE') return <Navigate to="/onboarding/profile" replace />;
  }

  // Strictly enforce onboarding sequence to prevent step-bypassing via URL
  if (!requireOnboarding && location.pathname.startsWith('/onboarding')) {
    if (onboardingStep === 'COMPLETED') return <Navigate to="/dashboard" replace />;
    
    // Allow both /email and /verify during PENDING_EMAIL to prevent routing loops after submission
    if (onboardingStep === 'PENDING_EMAIL' && !['/onboarding/email', '/onboarding/verify'].includes(location.pathname)) {
      return <Navigate to="/onboarding/email" replace />;
    }
    
    // Lock the user to profile completion step
    if (onboardingStep === 'PENDING_PROFILE' && location.pathname !== '/onboarding/profile') {
      return <Navigate to="/onboarding/profile" replace />;
    }
  }

  return <>{children}</>;
};

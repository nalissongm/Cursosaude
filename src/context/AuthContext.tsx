import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance, { setAccessToken } from '../lib/axios';

export type Role = 'ADMINISTRATIVE' | 'TEACHER' | 'STUDENT';
export type OnboardingStep = 'PENDING_EMAIL' | 'PENDING_PROFILE' | 'COMPLETED';

interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingStep: OnboardingStep | null;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateOnboardingStep: (step: OnboardingStep) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleOnboardingNavigation = useCallback((step: OnboardingStep) => {
    switch (step) {
      case 'PENDING_EMAIL':
        navigate('/onboarding/email');
        break;
      case 'PENDING_PROFILE':
        navigate('/onboarding/profile');
        break;
      case 'COMPLETED':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    try {
      console.log('[Auth] Checking session...');
      const response = await axiosInstance.get('/auth/me');
      console.log('[Auth] Session valid:', response.data.email);
      setUser(response.data.user || response.data);
      const step = response.data.onboarding_step || response.data.onboardingStep || 'COMPLETED';
      setOnboardingStep(step);
      localStorage.setItem('hasSession', 'true');
      localStorage.setItem('onboardingStep', step);
      return response.data;
    } catch (error: any) {
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      console.warn('[Auth] CheckAuth failed:', error.response?.status || error.message);

      if (isAuthError) {
        setUser(null);
        setOnboardingStep(null);
        setAccessToken(null);
        localStorage.removeItem('hasSession');
        localStorage.removeItem('onboardingStep');
      }
      throw error;
    }
  }, []);

  const login = async (credentials: { identifier: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    const data = response.data;

    const token = data.access_token || data.token || data.accessToken;
    const userData = data.user;
    const step = data.onboarding_step || data.onboardingStep || 'COMPLETED';

    if (token) setAccessToken(token);
    if (userData) {
      setUser(userData);
      setOnboardingStep(step);
      localStorage.setItem('hasSession', 'true');
      localStorage.setItem('onboardingStep', step);
      handleOnboardingNavigation(step);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      setOnboardingStep(null);
      localStorage.removeItem('hasSession');
      localStorage.removeItem('onboardingStep');
      navigate('/login');
    }
  };

  const updateOnboardingStep = (step: OnboardingStep) => {
    setOnboardingStep(step);
    localStorage.setItem('onboardingStep', step);
  };

  useEffect(() => {
    const initAuth = async () => {
      const hasSession = localStorage.getItem('hasSession') === 'true';
      const storedStep = localStorage.getItem('onboardingStep') as OnboardingStep | null;
      
      if (storedStep) setOnboardingStep(storedStep);
      console.log('[Auth] Initializing... Has previous session:', hasSession);

      if (!hasSession) {
        setIsLoading(false);
        return;
      }

      try {
        await checkAuth();
      } catch (error) {
        // Error already handled in checkAuth
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        onboardingStep,
        login,
        logout,
        checkAuth,
        updateOnboardingStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

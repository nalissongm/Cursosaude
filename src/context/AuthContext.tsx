import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import api from '../lib/axios';

export type OnboardingStep = 'PENDING_EMAIL' | 'PENDING_PROFILE' | 'COMPLETED';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  onboardingStep: OnboardingStep | null;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
  updateOnboardingStep: (step: OnboardingStep) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = useCallback((step: OnboardingStep) => {
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
    }
  }, [navigate]);

  const login = async (credentials: { identifier: string; password: string }) => {
    const { data } = await api.post('/auth/login', credentials);
    const { access_token, refresh_token, user: userData, onboarding_step } = data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('onboarding_step', onboarding_step);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setOnboardingStep(onboarding_step);
    handleNavigation(onboarding_step);
  };

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setOnboardingStep(null);
    navigate('/login');
  }, [navigate]);

  const updateOnboardingStep = (step: OnboardingStep) => {
    setOnboardingStep(step);
    localStorage.setItem('onboarding_step', step);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      const storedStep = localStorage.getItem('onboarding_step') as OnboardingStep;

      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          
          if (storedStep) {
            setOnboardingStep(storedStep);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, onboardingStep, isLoading, login, logout, updateOnboardingStep }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

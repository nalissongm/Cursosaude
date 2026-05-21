import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import api from '../lib/axios';

export type OnboardingStep = 'PENDING_EMAIL' | 'PENDING_PROFILE' | 'COMPLETED';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setOnboardingStep(null);
    navigate('/login');
  };

  const updateOnboardingStep = (step: OnboardingStep) => {
    setOnboardingStep(step);
    localStorage.setItem('onboarding_step', step);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedStep = localStorage.getItem('onboarding_step') as OnboardingStep;
    const token = localStorage.getItem('access_token');

    if (token && storedUser && storedStep) {
      setUser(JSON.parse(storedUser));
      setOnboardingStep(storedStep);
    }
    setIsLoading(false);
  }, []);

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

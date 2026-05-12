import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, { setAccessToken } from '../lib/axios';

export type Role = 'ADMINISTRATIVE' | 'TEACHER' | 'STUDENT';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      console.log('[Auth] Checking session...');
      const response = await axiosInstance.get('/auth/me');
      console.log('[Auth] Session valid:', response.data.email);
      setUser(response.data);
      localStorage.setItem('hasSession', 'true');
      return response.data;
    } catch (error: any) {
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      console.warn('[Auth] CheckAuth failed:', error.response?.status || error.message);

      if (isAuthError) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('hasSession');
      }
      throw error;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const data = response.data;

    const token = data.access_token || data.token || data.accessToken;
    const userData = data.user || (data.email ? data : null);

    if (token) setAccessToken(token);
    if (userData) {
      setUser(userData);
      localStorage.setItem('hasSession', 'true');
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('hasSession');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const hasSession = localStorage.getItem('hasSession') === 'true';
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
        login,
        logout,
        checkAuth,
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

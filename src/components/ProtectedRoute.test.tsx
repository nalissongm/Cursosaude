import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router';
import React, { useEffect } from 'react';
import axiosInstance from '../lib/axios';

vi.mock('../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  setAccessToken: vi.fn(),
}));

const MockDashboard = () => <div data-testid="dashboard">Dashboard Content</div>;
const MockLogin = () => <div data-testid="login">Login Page</div>;

const AuthSetter = ({ user }: { user: any }) => {
  const { login } = useAuth();
  useEffect(() => {
    if (user) {
      // Simulate login side effects
      (axiosInstance.post as any).mockResolvedValueOnce({
        data: { access_token: 'token', user }
      });
      login(user.email, 'password');
    }
  }, [user, login]);
  return null;
};

describe('ProtectedRoute Navigation', () => {
  it('should allow access to dashboard when user is authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'tamiresveras206@gmail.com',
      role: 'STUDENT',
      name: 'Tamires'
    };

    (axiosInstance.post as any).mockResolvedValue({
        data: { access_token: 'token', user: mockUser }
    });
    (axiosInstance.get as any).mockResolvedValue({ data: mockUser });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<MockLogin />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MockDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Initial state is loading or redirecting to login because checkAuth hasn't finished
    // But since we mock the initial refresh in AuthProvider, it should eventually show dashboard
    const dashboard = await screen.findByTestId('dashboard');
    expect(dashboard).toBeTruthy();
  });
});

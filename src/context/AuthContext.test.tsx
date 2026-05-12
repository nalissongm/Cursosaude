import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import axiosInstance from '../lib/axios';
import React from 'react';

const mockPost = vi.fn();
const mockGet = vi.fn();

vi.mock('../lib/axios', () => {
  return {
    default: {
      post: (...args: any[]) => mockPost(...args),
      get: (...args: any[]) => mockGet(...args),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
      create: vi.fn().mockReturnThis(),
    },
    setAccessToken: vi.fn(),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockReset();
    mockGet.mockReset();
    
    // Default mock for the initial silent refresh call in useEffect
    mockPost.mockImplementation((url: string) => {
      if (url === '/auth/refresh') {
        return Promise.reject(new Error('No session'));
      }
      return Promise.resolve({ data: {} });
    });
  });

  it('should login successfully with provided credentials and set user state', async () => {
    const mockUser = {
      id: '1',
      email: 'tamiresveras206@gmail.com',
      name: 'Tamires Veras',
      role: 'STUDENT',
    };

    const mockLoginResponse = {
      data: {
        access_token: 'fake-access-token',
        user: mockUser,
      },
    };

    // Specifically mock the login call
    mockPost.mockImplementation(async (url: string, data: any) => {
      if (url === '/auth/login' && data.email === 'tamiresveras206@gmail.com') {
        return mockLoginResponse;
      }
      if (url === '/auth/refresh') {
        return Promise.reject(new Error('No session'));
      }
      return { data: {} };
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for the initial loading to finish (from useEffect failing)
    await act(async () => {
      // Small delay or wait for state update if necessary
    });

    await act(async () => {
      await result.current.login('tamiresveras206@gmail.com', 'tamys123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});

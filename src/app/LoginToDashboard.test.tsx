import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppContent } from './App';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock axios
vi.mock('../lib/axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    },
    setAccessToken: vi.fn(),
  };
});

describe('Login to Dashboard Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login with specific credentials and show the dashboard with the user name', async () => {
    const mockUser = {
      id: '123',
      email: 'tamiresveras206@gmail.com',
      name: 'Tamires Veras',
      role: 'STUDENT',
    };

    // Mock initial refresh failure (not logged in yet)
    (axiosInstance.post as any).mockImplementation((url: string) => {
      if (url === '/auth/refresh') {
        return Promise.reject({ response: { status: 401 } });
      }
      if (url === '/auth/login') {
        return Promise.resolve({
          data: {
            access_token: 'fake-token',
            user: mockUser,
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    // Mock checkAuth /me call
    (axiosInstance.get as any).mockImplementation((url: string) => {
      if (url === '/auth/me') {
        return Promise.resolve({ data: mockUser });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for login page to load
    const emailInput = await screen.findByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    // Fill login form
    fireEvent.change(emailInput, { target: { value: 'tamiresveras206@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'tamys123' } });
    fireEvent.click(submitButton);

    // Verify successful login behavior
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'tamiresveras206@gmail.com',
        password: 'tamys123',
      });
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
    });

    // Verify dashboard content
    expect(await screen.findByText(/Bem-vindo de volta, Tamires Veras!/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Meus Cursos/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Urgência e Emergência/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router';
import * as authContext from '../../context/AuthContext';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router's hooks
const mockNavigate = vi.fn();
const mockLocation = { state: null };
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  };
});

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.state = null;
  });

  const setupMockAuth = (isAuthenticated = false) => {
    return vi.spyOn(authContext, 'useAuth').mockReturnValue({
      login: mockLogin,
      user: isAuthenticated ? { id: '1', name: 'Test User' } as any : null,
      isAuthenticated,
      isLoading: false,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
  };

  it('renders login form correctly', () => {
    setupMockAuth();
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    setupMockAuth();
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/E-mail inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/A senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('calls login and navigates to dashboard by default on success', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const authSpy = setupMockAuth(false);

    const { rerender } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
    });

    // Simulate authentication state change which triggers useEffect
    authSpy.mockReturnValue({
      login: mockLogin,
      user: { id: '1', name: 'Test User' } as any,
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    rerender(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('navigates to "from" location if provided in state', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    (mockLocation as any).state = { from: { pathname: '/courses' } };
    const authSpy = setupMockAuth(false);

    const { rerender } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    authSpy.mockReturnValue({
      login: mockLogin,
      user: { id: '1', name: 'Test User' } as any,
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    rerender(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/courses', { replace: true });
    });
  });

  it('shows error toast on login failure', async () => {
    setupMockAuth();
    const errorMessage = 'Credenciais inválidas. Tente novamente.';
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'wrongpassword' } });
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});

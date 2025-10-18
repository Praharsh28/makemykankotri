/**
 * LoginForm Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { supabase } from '@/core/template-system/supabase';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('@/core/template-system/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    } as any);
  });

  it('renders login form', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('has link to signup page', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/auth/signup');
  });

  it('handles form submission with valid credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } as any, session: {} as any },
      error: null,
    });

    const mockOnSuccess = vi.fn();

    render(
      <AuthProvider>
        <LoginForm onSuccess={mockOnSuccess} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on failed login', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials', name: 'AuthError', status: 400 } as any,
    });

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('disables form during submission', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('shows loading state during submission', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});

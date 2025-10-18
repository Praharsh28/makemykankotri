/**
 * SignupForm Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '@/components/auth/SignupForm';
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

describe('SignupForm', () => {
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

  it('renders signup form', () => {
    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  it('validates password match', async () => {
    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 6 characters')
      ).toBeInTheDocument();
    });

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('calls signup with correct data', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } as any, session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User' },
        },
      });
    });
  });

  it('displays error on signup failure', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already exists', name: 'AuthError', status: 400 } as any,
    });

    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows password requirements', () => {
    render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );

    expect(screen.getByText('At least 6 characters')).toBeInTheDocument();
  });
});

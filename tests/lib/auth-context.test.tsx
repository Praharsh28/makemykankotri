/**
 * AuthContext Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/core/template-system/supabase';

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

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock: no session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    // Mock auth state change listener
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    } as any);
  });

  it('provides auth context to children', async () => {
    function TestComponent() {
      const auth = useAuth();
      return <div>Authenticated: {String(auth.isAuthenticated)}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    function TestComponent() {
      const { loading } = useAuth();
      return <div>Loading: {String(loading)}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading: true')).toBeInTheDocument();
  });

  it('updates loading state after session check', async () => {
    function TestComponent() {
      const { loading } = useAuth();
      return <div>Loading: {String(loading)}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument();
    });
  });

  it('throws error when useAuth used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    function TestComponent() {
      useAuth();
      return <div>Test</div>;
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    console.error = originalError;
  });

  it('sets user when session exists', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'token',
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    function TestComponent() {
      const { user } = useAuth();
      return <div>Email: {user?.email || 'none'}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
    });
  });

  it('handles sign in', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const { error } = await result.current.signIn('test@example.com', 'password');

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(error).toBeNull();
  });

  it('handles sign up', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const { error } = await result.current.signUp('test@example.com', 'password', {
      full_name: 'Test User',
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        data: { full_name: 'Test User' },
      },
    });
    expect(error).toBeNull();
  });

  it('handles sign out', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const { error } = await result.current.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(error).toBeNull();
  });
});

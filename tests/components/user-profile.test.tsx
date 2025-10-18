/**
 * UserProfile Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from '@/components/auth/UserProfile';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { supabase } from '@/core/template-system/supabase';

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    } as any);
  });

  it('shows loading state', () => {
    vi.mocked(supabase.auth.getSession).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders user profile when authenticated', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01T00:00:00.000Z',
      user_metadata: {
        full_name: 'Test User',
      },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('displays default name when full_name not provided', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01T00:00:00.000Z',
      user_metadata: {},
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  it('shows member since date', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-15T00:00:00.000Z',
      user_metadata: {},
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/member since/i)).toBeInTheDocument();
    });
  });

  it('displays stats section', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01T00:00:00.000Z',
      user_metadata: {},
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Templates')).toBeInTheDocument();
      expect(screen.getByText('Invitations')).toBeInTheDocument();
      expect(screen.getByText('Shares')).toBeInTheDocument();
    });
  });

  it('handles sign out', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01T00:00:00.000Z',
      user_metadata: {},
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders nothing when no user', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { container } = render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});

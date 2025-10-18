/**
 * ProtectedRoute Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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

describe('ProtectedRoute', () => {
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

  it('shows loading spinner while checking auth', () => {
    vi.mocked(supabase.auth.getSession).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('renders children when authenticated', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      created_at: '2025-01-01',
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
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('uses custom redirect path', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <ProtectedRoute redirectTo="/custom-login">
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/custom-login');
    });
  });
});

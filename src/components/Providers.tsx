/**
 * Providers Component
 * Wraps app with all necessary providers (Auth, etc.)
 * Client-side only to prevent SSR issues
 */

'use client';

import { AuthProvider } from '@/lib/auth/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

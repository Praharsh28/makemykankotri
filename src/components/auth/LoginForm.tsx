/**
 * LoginForm Component
 * User login with email/password
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Alert } from '@/components/ui/Alert';
import Link from 'next/link';

export interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const { signIn } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="
                w-full px-4 py-2 rounded-lg border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="
                w-full px-4 py-2 rounded-lg border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full px-6 py-3 rounded-lg font-medium
              bg-primary-500 text-white
              hover:bg-primary-600
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-md hover:shadow-lg
            "
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

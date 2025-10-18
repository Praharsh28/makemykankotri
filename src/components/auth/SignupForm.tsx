/**
 * SignupForm Component
 * User registration with email/password
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Alert } from '@/components/ui/Alert';
import Link from 'next/link';

export interface SignupFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function SignupForm({ onSuccess, redirectTo = '/dashboard' }: SignupFormProps) {
  const { signUp } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password, {
        full_name: fullName,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Wait 2 seconds before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }, 2000);
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
              Account Created!
            </h2>
            <p className="text-neutral-600">
              Check your email to verify your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">
            Create Account
          </h1>
          <p className="text-neutral-600">
            Sign up to start creating beautiful invitations
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
          {/* Full Name Input */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              className="
                w-full px-4 py-2 rounded-lg border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="John Doe"
            />
          </div>

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
              minLength={6}
              className="
                w-full px-4 py-2 rounded-lg border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              placeholder="••••••••"
            />
            <p className="text-xs text-neutral-500">At least 6 characters</p>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

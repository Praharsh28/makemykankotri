/**
 * Signup Page
 * User registration page
 * Route: /auth/signup
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <span className="text-4xl">💍</span>
            <span className="font-heading font-bold text-2xl text-neutral-900">
              MakeMyKankotri
            </span>
          </Link>
          <h1 className="font-heading font-bold text-3xl text-neutral-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-neutral-600">
            Join thousands creating beautiful invitations
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
          <SignupForm />

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

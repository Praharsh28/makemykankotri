'use client';

import React, { useState } from 'react';
import { supabase } from '@/core/template-system/supabase';

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setMessage('Failed to send reset email.');
    } else {
      setMessage('Password reset email sent. Check your inbox.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="font-heading font-bold text-2xl text-neutral-900 mb-2">Forgot Password</h1>
        <p className="text-neutral-600 mb-6">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="text-sm text-neutral-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}

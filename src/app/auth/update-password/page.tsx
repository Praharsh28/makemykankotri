'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/template-system/supabase';

export const dynamic = 'force-dynamic';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If already logged in (via recovery link), we can proceed to update
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Give time for session detection via URL, then redirect if missing
        setTimeout(async () => {
          const { data: { session: s } } = await supabase.auth.getSession();
          if (!s) router.replace('/auth/login');
        }, 2000);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage('Failed to update password. Try again.');
    } else {
      setMessage('Password updated. Redirecting to login...');
      setTimeout(() => router.replace('/auth/login'), 1500);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="font-heading font-bold text-2xl text-neutral-900 mb-2">Update Password</h1>
        <p className="text-neutral-600 mb-6">Enter a new password for your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {message && <p className="text-sm text-neutral-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/core/template-system/supabase';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage('Failed to update password.');
    } else {
      setMessage('Password updated successfully.');
      setPassword('');
    }
    setSaving(false);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-6">Settings</h1>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-8">
            <div>
              <h2 className="font-semibold text-neutral-900 mb-2">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={saving || password.length < 6}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update Password'}
                </button>
              </form>
              {message && <p className="text-sm text-neutral-600 mt-2">{message}</p>}
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

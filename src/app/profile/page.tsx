'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/core/template-system/supabase';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setAvatarUrl(profile?.avatar_url || '');
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq('id', profile?.id || '')
      .select();

    if (error) {
      setMessage('Failed to update profile.');
    } else {
      setMessage('Profile updated successfully.');
    }
    setSaving(false);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-6">Your Profile</h1>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              {message && <p className="text-sm text-neutral-600">{message}</p>}
            </form>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

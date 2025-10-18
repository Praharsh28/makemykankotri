/**
 * UserProfile Component
 * Display and manage user profile
 */

'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

export function UserProfile() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-neutral-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-32"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <div>
            <h2 className="font-heading text-xl font-bold text-neutral-900">
              {user.user_metadata?.full_name || 'User'}
            </h2>
            <p className="text-sm text-neutral-600">{user.email}</p>
            <p className="text-xs text-neutral-500 mt-1">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="
            px-4 py-2 rounded-lg font-medium text-sm
            border border-neutral-300 text-neutral-700
            hover:border-neutral-400 hover:bg-neutral-50
            transition-all duration-200
          "
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">0</p>
            <p className="text-sm text-neutral-600">Templates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">0</p>
            <p className="text-sm text-neutral-600">Invitations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">0</p>
            <p className="text-sm text-neutral-600">Shares</p>
          </div>
        </div>
      </div>
    </div>
  );
}

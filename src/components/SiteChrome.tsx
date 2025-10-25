/**
 * SiteChrome - Global site navigation and footer
 * Hides on auth/admin/dashboard routes
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, profile, signOut } = useAuth();

  // Hide chrome on these route prefixes
  const hideChrome =
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/create') ||
    pathname?.startsWith('/invitation');

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && (
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">💍</span>
                <span className="font-heading font-bold text-xl text-neutral-900">
                  MakeMyKankotri
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/templates" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                  Templates
                </Link>
                <Link href="/features" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                  Features
                </Link>
                <Link href="/how-it-works" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                  How It Works
                </Link>
                <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                  Contact
                </Link>

                {!isAuthenticated ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
                    <Link href="/auth/login" className="text-sm text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                      Login
                    </Link>
                    <Link href="/auth/signup" className="text-sm bg-primary-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-primary-600 transition">
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
                    <span className="text-sm text-neutral-600">
                      {profile?.full_name || 'User'}
                    </span>
                    <Link href="/dashboard" className="text-sm text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="text-sm text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                      Profile
                    </Link>
                    <Link href="/settings" className="text-sm text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="text-sm text-neutral-700 hover:text-red-600 transition-colors font-medium">
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!hideChrome && (
        <footer className="bg-neutral-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">💍</span>
                  <span className="font-heading font-bold text-xl">MakeMyKankotri</span>
                </div>
                <p className="text-neutral-400 max-w-md">
                  Create beautiful, animated wedding invitations with AI.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/templates" className="text-neutral-400 hover:text-white transition-colors">Templates</Link></li>
                  <li><Link href="/features" className="text-neutral-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">How It Works</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
              <p>© 2025 MakeMyKankotri. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

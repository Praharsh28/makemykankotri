/**
 * User Dashboard
 * View and manage user's created invitations
 * Route: /dashboard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { MyTemplatesList } from '@/components/dashboard/MyTemplatesList';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
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
              <Link href="/dashboard" className="text-primary-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/templates" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                Create New
              </Link>
              <Link href="/auth/login" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-2">
            My Invitations
          </h1>
          <p className="text-lg text-neutral-600">
            View and manage all your wedding invitations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Created</p>
                <p className="font-heading font-bold text-3xl text-neutral-900">0</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-secondary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Views</p>
                <p className="font-heading font-bold text-3xl text-neutral-900">0</p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Shared</p>
                <p className="font-heading font-bold text-3xl text-neutral-900">0</p>
              </div>
              <div className="text-4xl">🔗</div>
            </div>
          </div>
        </div>

        {/* Create New CTA */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="font-heading font-semibold text-2xl text-neutral-900">
            Your Invitations
          </h2>
          <Link
            href="/templates"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md flex items-center gap-2"
          >
            <span>+</span> Create New Invitation
          </Link>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <MyTemplatesList />
        </div>
      </main>

      {/* Footer */}
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
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
            <p>© 2025 MakeMyKankotri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

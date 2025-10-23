/**
 * Templates Gallery Page - Enhanced
 * Browse beautiful wedding invitation templates
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useTemplates } from '@/core/template-system';

export default function TemplatesPage() {
  const { templates, loading, error } = useTemplates({
    published: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg">Loading beautiful templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="font-heading text-2xl font-semibold text-neutral-900 mb-2">
            Failed to Load Templates
          </h2>
          <p className="text-neutral-600 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                MakeMyKankotri
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/templates" className="text-primary-600 font-semibold">
                Templates
              </Link>
              <Link href="/features" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/how-it-works" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                How It Works
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all shadow-md">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-neutral-900 mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Browse our collection of beautiful, professionally designed wedding invitation templates
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {templates.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-300 text-8xl mb-6">📋</div>
            <h3 className="font-heading text-2xl font-semibold text-neutral-900 mb-3">
              No Templates Available Yet
            </h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Our beautiful templates are coming soon. Check back shortly!
            </p>
            <Link
              href="/"
              className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md"
            >
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200"
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <span className="text-6xl">💌</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <Link
                      href={`/create/${template.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 shadow-lg transform scale-90 group-hover:scale-100"
                    >
                      Use This Template →
                    </Link>
                  </div>

                  {/* Category Badge */}
                  {template.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-medium rounded-full">
                      {template.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-xl mb-2 text-neutral-900">
                    {template.name}
                  </h3>
                  
                  {template.description && (
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span>👁️</span> {template.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>✨</span> {template.uses || 0} uses
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/create/${template.id}`}
                    className="block w-full text-center bg-primary-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Create My Invitation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
                <li><Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/auth/signup" className="text-neutral-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
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

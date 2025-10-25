/**
 * Admin Dashboard
 * Central control panel for template management
 * Route: /admin
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useTemplates } from '@/core/template-system';
import { AdminRoute } from '@/components/auth/AdminRoute';

export default function AdminDashboardPage() {
  const { templates } = useTemplates({});

  const publishedCount = templates.filter(t => t.published).length;
  const draftCount = templates.filter(t => !t.published).length;
  // const totalViews = templates.reduce((sum, t) => sum + (t.views || 0), 0); // TODO: Display in stats
  const totalUses = templates.reduce((sum, t) => sum + (t.uses || 0), 0);

  return (
    <AdminRoute>
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💍</span>
              <span className="font-heading font-bold text-xl text-neutral-900">
                Admin Dashboard
              </span>
            </div>
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-2">
            Template Management
          </h1>
          <p className="text-lg text-neutral-600">
            Create and manage wedding invitation templates
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
            <div className="text-sm text-neutral-600 mb-1">Total Templates</div>
            <div className="font-heading font-bold text-4xl text-neutral-900">{templates.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
            <div className="text-sm text-neutral-600 mb-1">Published</div>
            <div className="font-heading font-bold text-4xl text-neutral-900">{publishedCount}</div>
          </div>
          <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-secondary-100">
            <div className="text-sm text-neutral-600 mb-1">Drafts</div>
            <div className="font-heading font-bold text-4xl text-neutral-900">{draftCount}</div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
            <div className="text-sm text-neutral-600 mb-1">Total Uses</div>
            <div className="font-heading font-bold text-4xl text-neutral-900">{totalUses}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="font-heading font-semibold text-2xl text-neutral-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/admin/generate"
              className="group bg-gradient-to-br from-primary-500 to-primary-600 text-white p-8 rounded-2xl hover:shadow-2xl transition-all"
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="font-heading font-semibold text-2xl mb-2">
                Generate with AI
              </h3>
              <p className="text-primary-100 mb-4">
                Describe your vision and let AI create a custom template
              </p>
              <span className="text-sm font-semibold group-hover:underline">
                Start Generating →
              </span>
            </Link>

            <Link
              href="/admin/editor/new"
              className="group bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-8 rounded-2xl hover:shadow-2xl transition-all"
            >
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="font-heading font-semibold text-2xl mb-2">
                Create from Scratch
              </h3>
              <p className="text-secondary-100 mb-4">
                Use visual editor to design a template manually
              </p>
              <span className="text-sm font-semibold group-hover:underline">
                Open Editor →
              </span>
            </Link>

            <Link
              href="/templates"
              className="group bg-gradient-to-br from-neutral-700 to-neutral-800 text-white p-8 rounded-2xl hover:shadow-2xl transition-all"
            >
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-heading font-semibold text-2xl mb-2">
                View All Templates
              </h3>
              <p className="text-neutral-300 mb-4">
                Browse and manage existing templates
              </p>
              <span className="text-sm font-semibold group-hover:underline">
                View Gallery →
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Templates */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading font-semibold text-2xl text-neutral-900">
              Recent Templates
            </h2>
            <Link href="/templates" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          {templates.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
              <div className="text-neutral-300 text-6xl mb-4">📋</div>
              <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                No Templates Yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Create your first template using AI or the visual editor
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {templates.slice(0, 10).map((template) => (
                    <tr key={template.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{template.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {template.published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded text-sm">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{template.views || 0}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/editor/${template.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
    </AdminRoute>
  );
}

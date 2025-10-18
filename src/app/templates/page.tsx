/**
 * Templates Gallery Page
 * Browse all templates from Supabase
 * Route: /templates
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Templates
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Template Gallery
              </h1>
              <p className="mt-1 text-gray-600">
                Browse and manage wedding invitation templates
              </p>
            </div>
            <Link
              href="/editor"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              + Create New Template
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Templates Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first template
            </p>
            <Link
              href="/editor"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Create Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 relative">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}
                  {template.published && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                      Published
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span>👁️ {template.views}</span>
                    <span>✨ {template.uses} uses</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {template.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/editor?templateId=${template.id}`}
                      className="flex-1 px-3 py-2 text-sm text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/preview/${template.slug}`}
                      className="flex-1 px-3 py-2 text-sm text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

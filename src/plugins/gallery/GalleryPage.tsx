/**
 * GalleryPage Component
 * Complete gallery with filters and templates
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { GalleryFilters, FilterState } from './GalleryFilters';
import { TemplateCard } from './TemplateCard';
import { SkeletonCard } from '@/components/Skeleton';
import { Template } from '@/core/types';
import { templateStorage } from '@/core/template-system/TemplateStorage';
import { featureFlags } from '@/core/feature-flags';

export interface GalleryPageProps {
  onSelectTemplate?: (template: Template) => void;
  selectedTemplateId?: string;
}

export function GalleryPage({
  onSelectTemplate,
  selectedTemplateId,
}: GalleryPageProps) {
  if (!featureFlags.isEnabled('gallery')) {
    return null;
  }

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    sortBy: 'popular',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    setError(null);

    try {
      const allTemplates = await templateStorage.list({
        published: true,
      });

      setTemplates(allTemplates);
    } catch (err) {
      setError('Failed to load templates');
      console.error('[GalleryPage] Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      templates.map((t) => t.category).filter(Boolean)
    );
    return Array.from(uniqueCategories).sort();
  }, [templates]);

  // Apply filters and sorting
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'recent':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [templates, filters]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadTemplates}
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl font-bold text-neutral-900 mb-2">
            Template Gallery
          </h1>
          <p className="text-lg text-neutral-600">
            Choose from {templates.length} beautiful wedding invitation templates
          </p>
        </div>

        {/* Filters */}
        <GalleryFilters
          onFilterChange={setFilters}
          categories={categories}
          initialFilters={filters}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-neutral-600">
            {filteredTemplates.length === templates.length ? (
              <>
                Showing all <span className="font-semibold">{templates.length}</span>{' '}
                templates
              </>
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold">{filteredTemplates.length}</span> of{' '}
                <span className="font-semibold">{templates.length}</span> templates
              </>
            )}
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-8 bg-neutral-50 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
                No Templates Found
              </h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() =>
                  setFilters({ search: '', category: '', sortBy: 'popular' })
                }
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={template.id === selectedTemplateId}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TemplateGallery Component
 * Enhanced gallery with responsive grid
 */

'use client';

import { useState, useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { SkeletonCard } from '@/components/Skeleton';
import { Template } from '@/core/types';
import { templateStorage } from '@/core/template-system/TemplateStorage';
import { featureFlags } from '@/core/feature-flags';

export interface TemplateGalleryProps {
  onSelectTemplate?: (template: Template) => void;
  selectedTemplateId?: string;
  category?: string;
}

export function TemplateGallery({
  onSelectTemplate,
  selectedTemplateId,
  category,
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check feature flag
  const isEnabled = featureFlags.isEnabled('gallery');

  useEffect(() => {
    loadTemplates();
  }, [category]);

  async function loadTemplates() {
    setLoading(true);
    setError(null);
    
    try {
      const allTemplates = await templateStorage.list({
        published: true,
        category: category,
      });
      
      setTemplates(allTemplates);
    } catch (err) {
      setError('Failed to load templates');
      console.error('[TemplateGallery] Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isEnabled) {
    return null;
  }

  if (error) {
    return (
      <div className="text-center py-12">
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
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-8 bg-neutral-50 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
            No Templates Found
          </h3>
          <p className="text-neutral-600">
            {category 
              ? `No templates in "${category}" category`
              : 'Start by creating your first template'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900">
            {category ? `${category} Templates` : 'All Templates'}
          </h2>
          <p className="text-neutral-600">
            {templates.length} {templates.length === 1 ? 'template' : 'templates'} available
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={template.id === selectedTemplateId}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
}

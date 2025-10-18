/**
 * MyTemplatesList Component
 * Display user's templates with actions
 */

'use client';

import { useState, useEffect } from 'react';
import { Template } from '@/core/types';
import { templateStorage } from '@/core/template-system/TemplateStorage';
import { useAuth } from '@/lib/auth/AuthContext';
import { Alert } from '@/components/ui/Alert';
import { MyTemplateCard } from './MyTemplateCard';
import { SkeletonCard } from '@/components/Skeleton';

export interface MyTemplatesListProps {
  onTemplateDeleted?: (template: Template) => void;
  onTemplateDuplicated?: (template: Template) => void;
}

export function MyTemplatesList({
  onTemplateDeleted,
  onTemplateDuplicated,
}: MyTemplatesListProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  async function loadTemplates() {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userTemplates = await templateStorage.getUserTemplates(user.id);
      setTemplates(userTemplates);
    } catch (err) {
      setError('Failed to load templates');
      console.error('[MyTemplatesList] Error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(template: Template) {
    try {
      await templateStorage.delete(template.id);
      setTemplates((prev) => prev.filter((t) => t.id !== template.id));
      
      if (onTemplateDeleted) {
        onTemplateDeleted(template);
      }
    } catch (err) {
      console.error('[MyTemplatesList] Delete error:', err);
      alert('Failed to delete template');
    }
  }

  async function handleDuplicate(template: Template) {
    try {
      const newTemplate: Template = {
        ...template,
        id: crypto.randomUUID(),
        name: `${template.name} (Copy)`,
        slug: `${template.slug}-copy-${Date.now()}`,
        published: false,
        views: 0,
        uses: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await templateStorage.save(newTemplate);
      setTemplates((prev) => [newTemplate, ...prev]);

      if (onTemplateDuplicated) {
        onTemplateDuplicated(newTemplate);
      }
    } catch (err) {
      console.error('[MyTemplatesList] Duplicate error:', err);
      alert('Failed to duplicate template');
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Please log in to view your templates</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-block max-w-md">
          <Alert
            type="error"
            title="Failed to Load Templates"
            message={error}
          />
          <button
            onClick={loadTemplates}
            className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-8 bg-neutral-50 rounded-xl">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
            No Templates Yet
          </h3>
          <p className="text-neutral-600 mb-4">
            Create your first wedding invitation template to get started
          </p>
          <button
            onClick={() => (window.location.href = '/editor')}
            className="
              px-6 py-3 rounded-lg font-medium
              bg-primary-500 text-white
              hover:bg-primary-600
              transition-colors
              shadow-md hover:shadow-lg
            "
          >
            Create Template
          </button>
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
            My Templates
          </h2>
          <p className="text-neutral-600">
            {templates.length} {templates.length === 1 ? 'template' : 'templates'}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = '/editor')}
          className="
            px-4 py-2 rounded-lg font-medium
            bg-primary-500 text-white
            hover:bg-primary-600
            transition-colors
            shadow-md hover:shadow-lg
          "
        >
          + New Template
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <MyTemplateCard
            key={template.id}
            template={template}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>
    </div>
  );
}

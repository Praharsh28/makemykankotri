/**
 * Editor Page - Complete editor with Supabase integration
 * Handles save, load, publish, auto-save
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/core/editor-state';
import { templateStorage } from '@/core/template-system';
import { EditorLayout } from './components/EditorLayout';
import { useAutoSave } from './hooks/useAutoSave';

export interface EditorPageProps {
  templateId?: string;
}

export function EditorPage({ templateId }: EditorPageProps) {
  const { template, loadTemplate } = useEditorStore();
  const [loading, setLoading] = useState(!!templateId);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load template on mount
  useEffect(() => {
    if (templateId) {
      loadTemplateFromDb(templateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const loadTemplateFromDb = async (templateId: string) => {
    if (!templateId) return;

    try {
      setLoading(true);
      setError(null);
      const loaded = await templateStorage.load(templateId);
      loadTemplate(loaded);
    } catch (err) {
      setError((err as Error).message);
      console.error('Failed to load template:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save
  useAutoSave(template, {
    enabled: true,
    delay: 2000,
    onSave: (saved) => {
      setLastSaved(new Date());
      console.log('✓ Auto-saved:', saved.name);
    },
    onError: (err) => {
      console.error('Auto-save failed:', err);
      setError(`Auto-save failed: ${err.message}`);
    },
  });

  // Manual save
  const handleSave = async () => {
    if (!template) return;

    try {
      setSaving(true);
      setError(null);
      const saved = await templateStorage.save(template);
      setLastSaved(new Date());
      console.log('✓ Saved:', saved.name);
    } catch (err) {
      setError((err as Error).message);
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!template) return;

    try {
      setSaving(true);
      setError(null);

      // Save first
      await templateStorage.save(template);

      // Then publish
      await templateStorage.publish(template.id);

      setLastSaved(new Date());
      console.log('✓ Published:', template.name);
      alert('Template published successfully! ✅');
    } catch (err) {
      setError((err as Error).message);
      console.error('Publish failed:', err);
      alert(`Publish failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Template
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTemplateFromDb}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Status Bar */}
      {error && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-2 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {lastSaved && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-1 text-green-700 text-xs flex items-center justify-between">
          <span>✓ Last saved: {lastSaved.toLocaleTimeString()}</span>
          {saving && <span className="animate-pulse">Saving...</span>}
        </div>
      )}

      {/* Editor */}
      <EditorLayout onSave={handleSave} onPublish={handlePublish} />
    </div>
  );
}

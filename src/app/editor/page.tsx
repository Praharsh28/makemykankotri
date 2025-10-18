/**
 * Editor Page - Test the visual editor with Supabase
 * Route: /editor
 * Query params: ?templateId=xxx (optional - load existing template)
 */

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditorPage } from '@/plugins/visual-editor/EditorPage';
import { useEditorStore } from '@/core/editor-state';
import { createElement } from '@/core/element-system';

function EditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const { template, loadTemplate } = useEditorStore();

  // Create new template if none exists
  React.useEffect(() => {
    if (!templateId && !template) {
      // Create a sample template for testing
      const newTemplate = {
        id: crypto.randomUUID(),
        name: 'New Template',
        slug: `template-${Date.now()}`,
        elements: [
          createElement('text', {
            content: 'Welcome to WebKankotri',
            position: { x: 100, y: 50, z: 1 },
            size: { width: 600, height: 'auto' },
            style: {
              font: 'Cinzel',
              fontSize: 48,
              color: '#2c3e50',
            },
          }),
          createElement('text', {
            content: 'Click Save to store in Supabase',
            position: { x: 100, y: 150, z: 2 },
            size: { width: 600, height: 'auto' },
            style: {
              font: 'Inter',
              fontSize: 24,
              color: '#7f8c8d',
            },
          }),
        ],
        editableFields: [],
        layout: {
          width: 800,
          height: 600,
          background: '#ffffff',
          orientation: 'portrait' as const,
        },
        globalAnimations: [],
        thumbnail: '',
        category: 'test',
        tags: [],
        description: 'Test template for Supabase integration',
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        published: false,
        views: 0,
        uses: 0,
      };

      loadTemplate(newTemplate);
    }
  }, [templateId, template, loadTemplate]);

  return <EditorPage templateId={templateId || undefined} />;
}

export default function EditorRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}

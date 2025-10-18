/**
 * Visual Editor - Main Component
 * Custom drag-and-drop visual template editor with dnd-kit
 */

'use client';

import React from 'react';
import { Template } from '@/core/types';
import { featureFlags, FEATURE_FLAGS } from '@/core/feature-flags';
import { eventBus, EVENT_NAMES } from '@/core/event-bus';
import { EditorLayout } from './components/EditorLayout';

export interface VisualEditorProps {
  template?: Template;
  onSave?: (template: Template) => void;
  onPublish?: (template: Template) => void;
}

export function VisualEditor({
  template,
  onSave,
  onPublish,
}: VisualEditorProps) {
  // Feature flag check
  if (!featureFlags.isEnabled(FEATURE_FLAGS.VISUAL_EDITOR)) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Visual Editor is disabled</p>
      </div>
    );
  }

  // Handle save with event emission
  const handleSave = (savedTemplate: Template) => {
    eventBus.emit(EVENT_NAMES.EDITOR_TEMPLATE_SAVED, {
      templateId: savedTemplate.id,
      template: savedTemplate,
    });

    if (onSave) {
      onSave(savedTemplate);
    }
  };

  // Handle publish with event emission
  const handlePublish = (publishedTemplate: Template) => {
    eventBus.emit(EVENT_NAMES.TEMPLATE_PUBLISHED, {
      templateId: publishedTemplate.id,
    });

    if (onPublish) {
      onPublish(publishedTemplate);
    }
  };

  return (
    <EditorLayout
      template={template}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}

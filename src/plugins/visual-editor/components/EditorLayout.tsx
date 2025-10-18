/**
 * Editor Layout - Complete visual editor layout
 * Combines toolbar, layers, canvas, and properties
 */

'use client';

import React, { useEffect } from 'react';
import { Template } from '@/core/types';
import { useEditorStore } from '@/core/editor-state';
import { registerBuiltInElements } from '@/core/element-system';
import { EditorToolbar } from './EditorToolbar';
import { LayersPanel } from './LayersPanel';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';

export interface EditorLayoutProps {
  template?: Template;
  onSave?: (template: Template) => void;
  onPublish?: (template: Template) => void;
}

export function EditorLayout({
  template: initialTemplate,
  onSave,
  onPublish,
}: EditorLayoutProps) {
  const { template, loadTemplate, getTemplate } = useEditorStore();

  // Register built-in element types on mount
  useEffect(() => {
    registerBuiltInElements();
  }, []);

  // Load initial template
  useEffect(() => {
    if (initialTemplate && !template) {
      loadTemplate(initialTemplate);
    }
  }, [initialTemplate, template, loadTemplate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { undo, redo, copy, paste, selectedElement, deleteElement } =
        useEditorStore.getState();

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        e.preventDefault();
        copy(selectedElement);
      }

      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        paste();
      }

      // Delete: Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        e.preventDefault();
        deleteElement(selectedElement.id);
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        useEditorStore.getState().setSelectedElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = () => {
    const currentTemplate = getTemplate();
    if (currentTemplate && onSave) {
      onSave(currentTemplate);
    }
  };

  const handlePublish = () => {
    const currentTemplate = getTemplate();
    if (currentTemplate && onPublish) {
      onPublish({
        ...currentTemplate,
        published: true,
      });
    }
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">No template loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Toolbar */}
      <EditorToolbar onSave={handleSave} onPublish={handlePublish} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layers Panel */}
        <LayersPanel width={250} />

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <EditorCanvas
            width={template.layout.width}
            height={template.layout.height}
            background={template.layout.background}
            gridEnabled={true}
            gridSize={10}
          />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel width={300} />
      </div>
    </div>
  );
}

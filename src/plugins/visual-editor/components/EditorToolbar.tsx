/**
 * Editor Toolbar - Top toolbar with actions
 * Add elements, save, undo/redo, etc.
 */

'use client';

import React from 'react';
import { useEditorStore } from '@/core/editor-state';
import { createElement } from '@/core/element-system';

export interface EditorToolbarProps {
  onSave?: () => void;
  onPublish?: () => void;
}

export function EditorToolbar({ onSave, onPublish }: EditorToolbarProps) {
  const { template, addElement, undo, redo, canUndo, canRedo } = useEditorStore();

  const handleAddElement = (type: 'text' | 'image' | 'gallery' | 'container') => {
    const newElement = createElement(type, {
      position: { x: 100, y: 100, z: template?.elements.length || 0 },
      size: { width: 200, height: 100 },
    });
    addElement(newElement);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      {/* Left: Template name */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {template?.name || 'Untitled Template'}
        </h2>
      </div>

      {/* Center: Add elements */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAddElement('text')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        >
          <span>📝</span>
          <span>Text</span>
        </button>

        <button
          onClick={() => handleAddElement('image')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        >
          <span>🖼️</span>
          <span>Image</span>
        </button>

        <button
          onClick={() => handleAddElement('gallery')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        >
          <span>🎨</span>
          <span>Gallery</span>
        </button>

        <button
          onClick={() => handleAddElement('container')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        >
          <span>📦</span>
          <span>Container</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2" />

        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        <button
          onClick={redo}
          disabled={!canRedo()}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {onSave && (
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        )}

        {onPublish && (
          <button
            onClick={onPublish}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
}

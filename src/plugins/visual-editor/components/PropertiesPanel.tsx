/**
 * Properties Panel - Edit selected element properties
 * Shows different editors based on element type
 */

'use client';

import React from 'react';
import { Element as TemplateElement } from '@/core/types';
import { useEditorStore } from '@/core/editor-state';

export interface PropertiesPanelProps {
  width?: number;
}

export function PropertiesPanel({ width = 300 }: PropertiesPanelProps) {
  const { selectedElement, updateElement } = useEditorStore();

  if (!selectedElement) {
    return (
      <div
        style={{ width: `${width}px` }}
        className="border-l border-gray-200 p-4 overflow-y-auto"
      >
        <p className="text-gray-400 text-sm">Select an element to edit</p>
      </div>
    );
  }

  const handleChange = (field: string, value: unknown) => {
    updateElement(selectedElement.id, { [field]: value });
  };

  const handleStyleChange = (styleKey: string, value: unknown) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [styleKey]: value,
      },
    });
  };

  return (
    <div
      style={{ width: `${width}px` }}
      className="border-l border-gray-200 p-4 overflow-y-auto bg-white"
    >
      <h3 className="text-lg font-semibold mb-4">Properties</h3>

      {/* Element Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <input
          type="text"
          value={selectedElement.type}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500"
        />
      </div>

      {/* Text Content (for text elements) */}
      {selectedElement.type === 'text' && (
        <TextProperties
          element={selectedElement}
          onChange={handleChange}
          onStyleChange={handleStyleChange}
        />
      )}

      {/* Image Properties */}
      {selectedElement.type === 'image' && (
        <ImageProperties
          element={selectedElement}
          onChange={handleChange}
          onStyleChange={handleStyleChange}
        />
      )}

      {/* Position & Size */}
      <PositionProperties
        element={selectedElement}
        onChange={handleChange}
      />

      {/* Editable Toggle */}
      <EditableToggle
        element={selectedElement}
        onChange={handleChange}
      />
    </div>
  );
}

// Text Properties Component
function TextProperties({
  element,
  onChange,
  onStyleChange,
}: {
  element: TemplateElement;
  onChange: (field: string, value: unknown) => void;
  onStyleChange: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={element.content as string}
          onChange={(e) => onChange('content', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font
        </label>
        <input
          type="text"
          value={(element.style.font as string) || 'Inter'}
          onChange={(e) => onStyleChange('font', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <input
          type="number"
          value={(element.style.fontSize as number) || 16}
          onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="color"
          value={(element.style.color as string) || '#000000'}
          onChange={(e) => onStyleChange('color', e.target.value)}
          className="w-full h-10 px-1 py-1 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Align
        </label>
        <div className="flex gap-2">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => onStyleChange('textAlign', align)}
              className={`px-3 py-2 border rounded ${
                element.style.textAlign === align
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Image Properties Component
function ImageProperties({
  element,
  onChange,
  onStyleChange,
}: {
  element: TemplateElement;
  onChange: (field: string, value: unknown) => void;
  onStyleChange: (key: string, value: unknown) => void;
}) {
  const content = element.content as { url: string; alt: string };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="text"
          value={content.url}
          onChange={(e) =>
            onChange('content', { ...content, url: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alt Text
        </label>
        <input
          type="text"
          value={content.alt}
          onChange={(e) =>
            onChange('content', { ...content, alt: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Object Fit
        </label>
        <select
          value={(element.style.objectFit as string) || 'contain'}
          onChange={(e) => onStyleChange('objectFit', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </>
  );
}

// Position Properties Component
function PositionProperties({
  element,
  onChange,
}: {
  element: TemplateElement;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="mb-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold mb-3">Position & Size</h4>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">X</label>
          <input
            type="number"
            value={element.position.x}
            onChange={(e) =>
              onChange('position', {
                ...element.position,
                x: parseInt(e.target.value),
              })
            }
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Y</label>
          <input
            type="number"
            value={element.position.y}
            onChange={(e) =>
              onChange('position', {
                ...element.position,
                y: parseInt(e.target.value),
              })
            }
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Width</label>
          <input
            type="number"
            value={element.size.width === 'auto' ? '' : element.size.width}
            onChange={(e) =>
              onChange('size', {
                ...element.size,
                width: e.target.value ? parseInt(e.target.value) : 'auto',
              })
            }
            placeholder="auto"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Height</label>
          <input
            type="number"
            value={element.size.height === 'auto' ? '' : element.size.height}
            onChange={(e) =>
              onChange('size', {
                ...element.size,
                height: e.target.value ? parseInt(e.target.value) : 'auto',
              })
            }
            placeholder="auto"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}

// Editable Toggle Component
function EditableToggle({
  element,
  onChange,
}: {
  element: TemplateElement;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="mb-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold mb-3">User Editing</h4>

      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={element.editable}
          onChange={(e) => onChange('editable', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-700">Allow users to edit</span>
      </label>

      {element.editable && (
        <>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={element.required || false}
              onChange={(e) => onChange('required', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Required field</span>
          </label>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={element.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g., Bride Name"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </>
      )}
    </div>
  );
}

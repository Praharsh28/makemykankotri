/**
 * Layers Panel - Element list with visibility/lock controls
 * Shows all elements in the template
 */

'use client';

import React from 'react';
import { Element as TemplateElement } from '@/core/types';
import { useEditorStore } from '@/core/editor-state';

export interface LayersPanelProps {
  width?: number;
}

export function LayersPanel({ width = 250 }: LayersPanelProps) {
  const {
    template,
    selectedElement,
    setSelectedElement,
    updateElement,
    deleteElement,
  } = useEditorStore();

  if (!template) {
    return (
      <div
        style={{ width: `${width}px` }}
        className="border-r border-gray-200 p-4 overflow-y-auto"
      >
        <p className="text-gray-400 text-sm">No template loaded</p>
      </div>
    );
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📝';
      case 'image':
        return '🖼️';
      case 'gallery':
        return '🎨';
      case 'container':
        return '📦';
      default:
        return '⚪';
    }
  };

  return (
    <div
      style={{ width: `${width}px` }}
      className="border-r border-gray-200 p-4 overflow-y-auto bg-white"
    >
      <h3 className="text-lg font-semibold mb-4">Layers</h3>

      <div className="space-y-1">
        {template.elements.length === 0 ? (
          <p className="text-gray-400 text-sm">No elements yet</p>
        ) : (
          template.elements.map((element) => (
            <LayerItem
              key={element.id}
              element={element}
              selected={selectedElement?.id === element.id}
              onSelect={() => setSelectedElement(element)}
              onToggleVisibility={() =>
                updateElement(element.id, {
                  hidden: !element.hidden,
                })
              }
              onToggleLock={() =>
                updateElement(element.id, {
                  locked: !element.locked,
                })
              }
              onDelete={() => deleteElement(element.id)}
              getIcon={getElementIcon}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Layer Item Component
interface LayerItemProps {
  element: TemplateElement;
  selected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  getIcon: (type: string) => string;
}

function LayerItem({
  element,
  selected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  getIcon,
}: LayerItemProps) {
  const handleClick = () => {
    if (!element.locked) {
      onSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-2 py-2 rounded cursor-pointer
        hover:bg-gray-100 transition-colors
        ${selected ? 'bg-blue-50 border border-blue-300' : 'border border-transparent'}
        ${element.locked ? 'opacity-50' : ''}
      `}
    >
      {/* Icon */}
      <span className="text-lg">{getIcon(element.type)}</span>

      {/* Name */}
      <span className="flex-1 text-sm truncate">
        {element.name || `${element.type}-${element.id.slice(0, 4)}`}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 hover:bg-gray-200 rounded text-xs"
          title={element.hidden ? 'Show' : 'Hide'}
        >
          {element.hidden ? '👁️' : '👁️‍🗨️'}
        </button>

        {/* Lock Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className="p-1 hover:bg-gray-200 rounded text-xs"
          title={element.locked ? 'Unlock' : 'Lock'}
        >
          {element.locked ? '🔒' : '🔓'}
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete this element?')) {
              onDelete();
            }
          }}
          className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

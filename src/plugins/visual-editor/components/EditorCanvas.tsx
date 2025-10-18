/**
 * Editor Canvas - Main canvas with drag & drop
 * Contains all template elements
 */

'use client';

import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Element as TemplateElement } from '@/core/types';
import { DraggableElement } from './DraggableElement';
import { useEditorStore } from '@/core/editor-state';

export interface EditorCanvasProps {
  width?: number;
  height?: number;
  background?: string;
  gridEnabled?: boolean;
  gridSize?: number;
}

export function EditorCanvas({
  width = 800,
  height = 600,
  background = '#ffffff',
  gridEnabled = true,
  gridSize = 10,
}: EditorCanvasProps) {
  const {
    template,
    selectedElement,
    setSelectedElement,
    updateElement,
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const element = active.data.current?.element as Element;

    if (!element) return;

    let newX = element.position.x + delta.x;
    let newY = element.position.y + delta.y;

    // Snap to grid if enabled
    if (gridEnabled && gridSize > 0) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, width - 50));
    newY = Math.max(0, Math.min(newY, height - 50));

    updateElement(element.id, {
      position: {
        ...element.position,
        x: newX,
        y: newY,
      },
    });
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const canvasStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    background,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: gridEnabled
      ? `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `
      : undefined,
    backgroundSize: gridEnabled ? `${gridSize}px ${gridSize}px` : undefined,
  };

  if (!template) {
    return (
      <div
        style={canvasStyle}
        className="flex items-center justify-center text-gray-400"
      >
        <p>No template loaded</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        style={canvasStyle}
        onClick={handleCanvasClick}
        className="border border-gray-300 shadow-sm"
      >
        {template.elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            selected={selectedElement?.id === element.id}
            onSelect={setSelectedElement}
          >
            <div style={{ ...(element.style as React.CSSProperties), padding: '8px' }}>
              {typeof element.content === 'string'
                ? element.content
                : JSON.stringify(element.content)}
            </div>
          </DraggableElement>
        ))}
      </div>
      <DragOverlay>
        {selectedElement && (
          <div
            style={{
              ...(selectedElement.style as React.CSSProperties),
              opacity: 0.8,
              padding: '8px',
            }}
          >
            {typeof selectedElement.content === 'string'
              ? selectedElement.content
              : JSON.stringify(selectedElement.content)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

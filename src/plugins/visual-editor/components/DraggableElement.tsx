/**
 * Draggable Element - dnd-kit integration
 * Makes elements draggable in the editor
 */

'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Element as TemplateElement } from '@/core/types';

export interface DraggableElementProps {
  element: TemplateElement;
  children: React.ReactNode;
  onSelect?: (element: TemplateElement) => void;
  selected?: boolean;
}

export function DraggableElement({
  element,
  children,
  onSelect,
  selected = false,
}: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: element.id,
      data: { element },
    });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    zIndex: element.position.z,
    width: element.size.width === 'auto' ? 'auto' : element.size.width,
    height: element.size.height === 'auto' ? 'auto' : element.size.height,
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
    outline: selected ? '2px solid #3b82f6' : 'none',
    outlineOffset: '2px',
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(element);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className="draggable-element hover:outline hover:outline-blue-300"
    >
      {children}
    </div>
  );
}

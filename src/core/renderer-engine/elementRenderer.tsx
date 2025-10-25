/**
 * Element Rendering Utilities
 * Reusable element renderers for different element types
 */

import React from 'react';
import type { Element } from '../types';
import { injectData } from './dataInjector';
import { convertStyle, convertPositionStyle, mergeStyles } from './styleConverter';

export interface RenderElementProps {
  element: Element;
  data?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * Render a text element
 */
export function renderTextElement({ element, data = {} }: RenderElementProps): React.ReactNode {
  const content = injectData(element.content, data);
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style)
  );

  return (
    <div data-element-id={element.id} style={style}>
      {content as string}
    </div>
  );
}

/**
 * Render an image element
 */
export function renderImageElement({ element }: RenderElementProps): React.ReactNode {
  const imageContent = element.content as { url: string; alt: string };
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style)
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-element-id={element.id}
      src={imageContent.url}
      alt={imageContent.alt}
      style={style}
    />
  );
}

/**
 * Render a gallery element
 */
export function renderGalleryElement({ element }: RenderElementProps): React.ReactNode {
  const images = element.content as unknown as Array<{ url: string; alt: string }>;
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style),
    { display: 'flex', gap: '8px' }
  );

  return (
    <div data-element-id={element.id} style={style}>
      {images.map((img, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          src={img.url}
          alt={img.alt}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      ))}
    </div>
  );
}

/**
 * Render a container element
 */
export function renderContainerElement({ element, children }: RenderElementProps): React.ReactNode {
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style)
  );

  return (
    <div data-element-id={element.id} style={style}>
      {children}
    </div>
  );
}

/**
 * Get appropriate renderer for element type
 */
export function getElementRenderer(type: string): ((props: RenderElementProps) => React.ReactNode) | null {
  const renderers: Record<string, (props: RenderElementProps) => React.ReactNode> = {
    text: renderTextElement,
    image: renderImageElement,
    gallery: renderGalleryElement,
    container: renderContainerElement,
  };

  return renderers[type] || null;
}

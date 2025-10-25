/**
 * Template Renderer Component
 * Renders templates with injected data
 */

import React from 'react';
import { featureFlags } from '@/core/feature-flags';
import type { Template, Element as TemplateElement } from '@/core/types';
import {
  injectData,
  convertStyle,
  convertPositionStyle,
  convertLayoutStyle,
  mergeStyles,
} from '@/core/renderer-engine';

export interface TemplateRendererProps {
  template: Template;
  data: Record<string, unknown>;
  mode?: 'preview' | 'export';
}

export function TemplateRenderer({
  template,
  data,
  mode = 'preview',
}: TemplateRendererProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('template-renderer')) {
    return null;
  }

  return (
    <div
      data-testid="template-container"
      data-mode={mode}
      style={convertLayoutStyle(template.layout)}
    >
      {template.elements.map((element) => (
        <RenderedElement
          key={element.id}
          element={element}
          data={data}
        />
      ))}
    </div>
  );
}

interface RenderedElementProps {
  element: TemplateElement;
  data: Record<string, unknown>;
}

function RenderedElement({ element, data }: RenderedElementProps) {
  const content = injectData(element.content, data);
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style)
  );

  if (element.type === 'text') {
    return (
      <div data-element-id={element.id} style={style}>
        {content as string}
      </div>
    );
  }

  if (element.type === 'image') {
    const imageContent = element.content as { url: string; alt: string };
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

  if (element.type === 'gallery') {
    const images = element.content as unknown as Array<{ url: string; alt: string }>;
    return (
      <div data-element-id={element.id} style={mergeStyles(style, { display: 'flex', gap: '8px' })}>
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

  if (element.type === 'container') {
    const children = element.content as unknown as TemplateElement[];
    return (
      <div data-element-id={element.id} style={style}>
        {children.map((child) => (
          <RenderedElement key={child.id} element={child} data={data} />
        ))}
      </div>
    );
  }

  return null;
}

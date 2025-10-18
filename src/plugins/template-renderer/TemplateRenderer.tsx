/**
 * Template Renderer Component
 * Renders templates with injected data
 */

import React from 'react';
import { featureFlags } from '@/core/feature-flags';
import type { Template, Element } from '@/core/types';

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
      style={{
        position: 'relative',
        width: `${template.layout.width}px`,
        height: `${template.layout.height}px`,
        backgroundColor: template.layout.background,
        overflow: 'hidden',
      }}
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
  element: Element;
  data: Record<string, unknown>;
}

function RenderedElement({ element, data }: RenderedElementProps) {
  const content = injectData(element.content, data);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    zIndex: element.position.z,
    width: typeof element.size.width === 'number' ? `${element.size.width}px` : element.size.width,
    height: typeof element.size.height === 'number' ? `${element.size.height}px` : element.size.height,
    ...convertStyle(element.style),
  };

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
      <img
        data-element-id={element.id}
        src={imageContent.url}
        alt={imageContent.alt}
        style={style}
      />
    );
  }

  if (element.type === 'gallery') {
    const images = element.content as Array<{ url: string; alt: string }>;
    return (
      <div data-element-id={element.id} style={{ ...style, display: 'flex', gap: '8px' }}>
        {images.map((img, idx) => (
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
    const children = element.content as Element[];
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

/**
 * Inject data into content placeholders
 */
function injectData(content: unknown, data: Record<string, unknown>): unknown {
  if (typeof content !== 'string') {
    return content;
  }

  let result = content;

  // Replace {{key}} placeholders
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  result = result.replace(placeholderRegex, (match, key) => {
    const value = getNestedValue(data, key.trim());
    return value !== undefined ? String(value) : match;
  });

  return result;
}

/**
 * Get nested object value by dot notation key
 */
function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = obj;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Convert element style to React CSS Properties
 */
function convertStyle(style: Element['style']): React.CSSProperties {
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    color: style.color,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    backgroundColor: style.backgroundColor,
    padding: style.padding ? `${style.padding}px` : undefined,
    margin: style.margin ? `${style.margin}px` : undefined,
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
  };
}

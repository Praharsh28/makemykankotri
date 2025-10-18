/**
 * Puck Configuration
 * Defines components for Puck visual editor
 */

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { Element as TemplateElement } from '@/core/types';

export interface PuckComponentProps {
  element: TemplateElement;
  [key: string]: unknown;
}

// Text Component Config
export const TextComponent: ComponentConfig<{
  content: string;
  font: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  editable: boolean;
  required: boolean;
}> = {
  fields: {
    content: {
      type: 'textarea',
    },
    font: {
      type: 'text',
    },
    fontSize: {
      type: 'number',
    },
    fontWeight: {
      type: 'select',
      options: [
        { label: 'Regular (400)', value: 400 },
        { label: 'Medium (500)', value: 500 },
        { label: 'Semibold (600)', value: 600 },
        { label: 'Bold (700)', value: 700 },
      ],
    },
    color: {
      type: 'text',
    },
    textAlign: {
      type: 'radio',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    editable: {
      type: 'radio',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    required: {
      type: 'radio',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
  },
  defaultProps: {
    content: 'Enter text',
    font: 'Inter',
    fontSize: 16,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left',
    editable: false,
    required: false,
  },
  render: ({ content, font, fontSize, fontWeight, color, textAlign }) => (
    <div
      style={{
        fontFamily: font,
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        textAlign,
      }}
    >
      {content}
    </div>
  ),
};

// Image Component Config
export const ImageComponent: ComponentConfig<{
  src: string;
  alt: string;
  width: number | 'auto';
  height: number | 'auto';
  objectFit: 'contain' | 'cover' | 'fill';
  editable: boolean;
}> = {
  fields: {
    src: {
      type: 'text',
    },
    alt: {
      type: 'text',
    },
    width: {
      type: 'number',
    },
    height: {
      type: 'number',
    },
    objectFit: {
      type: 'radio',
      options: [
        { label: 'Contain', value: 'contain' },
        { label: 'Cover', value: 'cover' },
        { label: 'Fill', value: 'fill' },
      ],
    },
    editable: {
      type: 'radio',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
  },
  defaultProps: {
    src: '',
    alt: 'Image',
    width: 200,
    height: 200,
    objectFit: 'contain',
    editable: false,
  },
  render: ({ src, alt, width, height, objectFit }) => (
    <img
      src={src}
      alt={alt}
      style={{
        width: width === 'auto' ? 'auto' : `${width}px`,
        height: height === 'auto' ? 'auto' : `${height}px`,
        objectFit,
      }}
    />
  ),
};

// Container Component Config
export const ContainerComponent: ComponentConfig<{
  background: string;
  padding: number;
  gap: number;
  flexDirection: 'row' | 'column';
}> = {
  fields: {
    background: {
      type: 'text',
    },
    padding: {
      type: 'number',
    },
    gap: {
      type: 'number',
    },
    flexDirection: {
      type: 'radio',
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Column', value: 'column' },
      ],
    },
  },
  defaultProps: {
    background: 'transparent',
    padding: 20,
    gap: 10,
    flexDirection: 'column',
  },
  render: ({ background, padding, gap, flexDirection, puck }) => (
    <div
      style={{
        background,
        padding: `${padding}px`,
        gap: `${gap}px`,
        display: 'flex',
        flexDirection,
      }}
    >
      {puck.renderDropZone({ zone: 'container-content' }) as React.ReactNode}
    </div>
  ),
};

// Complete Puck Config
export const puckConfig = {
  components: {
    Text: TextComponent,
    Image: ImageComponent,
    Container: ContainerComponent,
  },
};

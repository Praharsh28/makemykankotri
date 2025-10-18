/**
 * Image Element Type
 * Image/SVG element for templates
 */

import { Element, Asset } from '../../types';
import { elementRegistry } from '../ElementRegistry';

export interface ImageElementContent extends Element {
  type: 'image';
  content: Asset;
}

// Default image style
const DEFAULT_IMAGE_STYLE = {
  objectFit: 'contain',
  opacity: 1,
};

// Default image content
const DEFAULT_IMAGE_CONTENT: Asset = {
  url: '',
  alt: 'Image',
};

// Register image element type
export function registerImageElement(): void {
  elementRegistry.register('image', {
    name: 'Image',
    icon: '🖼️',
    defaultContent: DEFAULT_IMAGE_CONTENT,
    defaultStyle: DEFAULT_IMAGE_STYLE,
    renderer: (element: Element) => {
      const asset = element.content as Asset;
      return asset.url || 'No image';
    },
    validator: (element: Element) => {
      const content = element.content as Asset;
      return (
        typeof content === 'object' &&
        content !== null &&
        typeof content.url === 'string'
      );
    },
  });
}

/**
 * Gallery Element Type
 * Image gallery element for templates
 */

import { Element, Asset } from '../../types';
import { elementRegistry } from '../ElementRegistry';

export interface GalleryElementContent {
  type: 'gallery';
  content: Asset[];
}

export interface GalleryConfig {
  layout: 'grid' | 'masonry' | 'carousel';
  columns?: number;
  gap?: number;
  maxImages?: number;
}

// Default gallery style
const DEFAULT_GALLERY_STYLE = {
  display: 'grid',
  gap: 10,
};

// Default gallery content
const DEFAULT_GALLERY_CONTENT: Asset[] = [];

// Register gallery element type
export function registerGalleryElement(): void {
  elementRegistry.register('gallery', {
    name: 'Gallery',
    icon: '🖼️',
    defaultContent: DEFAULT_GALLERY_CONTENT,
    defaultStyle: DEFAULT_GALLERY_STYLE,
    renderer: (element: Element) => {
      const assets = Array.isArray(element.content) ? (element.content as unknown as Asset[]) : [];
      return `Gallery (${assets.length} images)`;
    },
    validator: (element: Element) => {
      const content = element.content;
      return Array.isArray(content);
    },
  });
}

/**
 * Built-in Element Types
 * Register all default element types
 */

import { registerTextElement } from './TextElement';
import { registerImageElement } from './ImageElement';
import { registerGalleryElement } from './GalleryElement';
import { registerContainerElement } from './ContainerElement';

/**
 * Register all built-in element types
 * Call this during app initialization
 */
export function registerBuiltInElements(): void {
  registerTextElement();
  registerImageElement();
  registerGalleryElement();
  registerContainerElement();
  
  console.log('✓ Built-in element types registered');
}

// Re-export element type interfaces
export type { TextElementContent } from './TextElement';
export type { ImageElementContent } from './ImageElement';
export type { GalleryElementContent, GalleryConfig } from './GalleryElement';
export type { ContainerElementContent } from './ContainerElement';

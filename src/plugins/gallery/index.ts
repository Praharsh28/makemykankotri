/**
 * Gallery Plugin
 * Browse templates
 */

import type { Plugin } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';

export const galleryPlugin: Plugin = {
  name: 'gallery',
  version: '1.0.0',
  install() {
    featureFlags.enable('gallery');
    console.log('[gallery] Plugin installed');
  },
  uninstall() {
    featureFlags.disable('gallery');
    console.log('[gallery] Plugin uninstalled');
  },
};

// Export components
export { TemplateGallery } from './TemplateGallery';
export { TemplateCard } from './TemplateCard';
export { GalleryFilters } from './GalleryFilters';
export { GalleryPage } from './GalleryPage';

// Export types
export type { TemplateGalleryProps } from './TemplateGallery';
export type { FilterState, GalleryFiltersProps } from './GalleryFilters';
export type { GalleryPageProps } from './GalleryPage';

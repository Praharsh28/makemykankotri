/**
 * Template Renderer Plugin
 * Renders templates with injected form data
 */

import { Plugin } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';

export const templateRendererPlugin: Plugin = {
  name: 'template-renderer',
  version: '1.0.0',
  description: 'Render templates with injected data and generate static HTML',
  
  install: () => {
    featureFlags.enable('template-renderer');
    console.log('[template-renderer] Plugin installed');
  },
  
  uninstall: () => {
    featureFlags.disable('template-renderer');
    console.log('[template-renderer] Plugin uninstalled');
  },
};

// Export components
export { TemplateRenderer } from './TemplateRenderer';
export { ShareButton } from './ShareButton';

// Export utilities
export { generateSlug, generateInvitationUrl, saveInvitation } from './urlGenerator';

// Export types
export type { TemplateRendererProps } from './TemplateRenderer';
export type { ShareButtonProps } from './ShareButton';
export type { SaveInvitationResult } from './urlGenerator';

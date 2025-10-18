/**
 * Animation Engine Plugin
 * Konva + GSAP animations for templates
 */

import { Plugin } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';

export const animationEnginePlugin: Plugin = {
  name: 'animation-engine',
  version: '1.0.0',
  description: 'Konva + GSAP animation system for templates',
  
  install: () => {
    featureFlags.enable('animation-engine');
    console.log('[animation-engine] Plugin installed');
  },
  
  uninstall: () => {
    featureFlags.disable('animation-engine');
    console.log('[animation-engine] Plugin uninstalled');
  },
};

// Export components
export { ParticleLayer } from './ParticleLayer';
export { TimelineAnimation } from './TimelineAnimation';
export { CinematicReveal } from './CinematicReveal';
export { AnimationLibrary } from './AnimationLibrary';
export { AnimationPreview } from './AnimationPreview';

// Export types
export type { ParticleLayerProps } from './ParticleLayer';
export type { TimelineAnimationProps } from './TimelineAnimation';
export type { CinematicRevealProps } from './CinematicReveal';
export type { AnimationLibraryProps, AnimationType } from './AnimationLibrary';
export type { AnimationPreviewProps } from './AnimationPreview';

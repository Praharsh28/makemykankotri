/**
 * Renderer Engine - Core rendering utilities
 * Shared utilities for template rendering across plugins
 */

// Data injection
export {
  injectData,
  getNestedValue,
  hasPlaceholders,
  extractPlaceholderKeys,
} from './dataInjector';

// Style conversion
export {
  convertStyle,
  convertPositionStyle,
  mergeStyles,
  convertLayoutStyle,
} from './styleConverter';

// Element renderers
export {
  renderTextElement,
  renderImageElement,
  renderGalleryElement,
  renderContainerElement,
  getElementRenderer,
  type RenderElementProps,
} from './elementRenderer';

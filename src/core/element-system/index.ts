/**
 * Element System - Central Exports
 * Import all element system functionality through this file
 */

// Registry
export { elementRegistry, createDefaultElement } from './ElementRegistry';
export type { ElementTypeConfig } from './ElementRegistry';

// Factory
export {
  createElement,
  updateElement,
  updateElementStyle,
  updateElementPosition,
  updateElementSize,
  duplicateElement,
  deleteElement,
  validateElement,
  validateElementField,
} from './ElementFactory';

// Built-in element types
export { registerBuiltInElements } from './element-types';
export type {
  TextElementContent,
  ImageElementContent,
  GalleryElementContent,
  GalleryConfig,
  ContainerElementContent,
} from './element-types';

/**
 * Element Registry - Register and manage element types
 * Enables extensible element system
 */

import { Element, ElementType, Asset } from '../types';
import { eventBus } from '../event-bus';

export interface ElementTypeConfig {
  name: string;
  icon?: string;
  defaultContent: unknown;
  defaultStyle?: Record<string, unknown>;
  renderer: (element: Element) => React.ReactNode;
  editor?: (element: Element) => React.ReactNode;
  validator?: (element: Element) => boolean;
}

class ElementRegistryImpl {
  private elementTypes = new Map<string, ElementTypeConfig>();

  /**
   * Register a new element type
   */
  register(type: string, config: ElementTypeConfig): void {
    if (this.elementTypes.has(type)) {
      throw new Error(`Element type "${type}" is already registered`);
    }

    // Validate config
    this.validateConfig(type, config);

    // Register
    this.elementTypes.set(type, config);
    eventBus.emit('element-type:registered', { type, config });
    console.log(`✓ Element type "${type}" registered`);
  }

  /**
   * Unregister an element type
   */
  unregister(type: string): void {
    if (!this.elementTypes.has(type)) {
      throw new Error(`Element type "${type}" is not registered`);
    }

    this.elementTypes.delete(type);
    eventBus.emit('element-type:unregistered', { type });
    console.log(`✓ Element type "${type}" unregistered`);
  }

  /**
   * Get element type configuration
   */
  get(type: string): ElementTypeConfig | null {
    return this.elementTypes.get(type) || null;
  }

  /**
   * Check if element type exists
   */
  has(type: string): boolean {
    return this.elementTypes.has(type);
  }

  /**
   * Get all registered element types
   */
  getAll(): Map<string, ElementTypeConfig> {
    return new Map(this.elementTypes);
  }

  /**
   * Get element type names
   */
  getTypeNames(): string[] {
    return Array.from(this.elementTypes.keys());
  }

  /**
   * Validate element type configuration
   */
  private validateConfig(type: string, config: ElementTypeConfig): void {
    if (!config.name || typeof config.name !== 'string') {
      throw new Error(`Element type "${type}" must have a valid name`);
    }

    if (config.defaultContent === undefined) {
      throw new Error(`Element type "${type}" must have defaultContent`);
    }

    if (typeof config.renderer !== 'function') {
      throw new Error(`Element type "${type}" must have a renderer function`);
    }
  }

  /**
   * Clear all element types (for testing)
   */
  clear(): void {
    this.elementTypes.clear();
  }
}

// Singleton instance
export const elementRegistry = new ElementRegistryImpl();

/**
 * Helper to create default element of a type
 */
export function createDefaultElement(
  type: string,
  overrides?: Partial<Element>
): Partial<Element> {
  const config = elementRegistry.get(type);
  if (!config) {
    throw new Error(`Unknown element type: ${type}`);
  }

  return {
    type: type as ElementType,
    content: config.defaultContent as string | Asset | Element[],
    style: config.defaultStyle || {},
    position: { x: 0, y: 0, z: 0 },
    size: { width: 'auto', height: 'auto' },
    editable: false,
    animations: [],
    ...overrides,
  };
}

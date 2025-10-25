/**
 * Element Factory - Create and manipulate elements
 * CRUD operations for elements
 */

import { v4 as uuid } from 'uuid';
import { Element, ElementType, Asset } from '../types';
import { elementRegistry } from './ElementRegistry';
import { eventBus, EVENT_NAMES } from '../event-bus';

/**
 * Create a new element
 */
export function createElement(
  type: ElementType,
  config?: Partial<Element>
): Element {
  const typeConfig = elementRegistry.get(type);
  if (!typeConfig) {
    throw new Error(`Unknown element type: ${type}`);
  }

  const now = new Date();
  const element: Element = {
    id: uuid(),
    type,
    content: typeConfig.defaultContent as string | Asset | Element[],
    position: { x: 0, y: 0, z: 0 },
    size: { width: 'auto', height: 'auto' },
    style: typeConfig.defaultStyle || {},
    editable: false,
    animations: [],
    createdAt: now,
    updatedAt: now,
    ...config,
  };

  eventBus.emit(EVENT_NAMES.ELEMENT_CREATED, { element });
  return element;
}

/**
 * Update an element
 */
export function updateElement(
  element: Element,
  changes: Partial<Element>
): Element {
  const updated = {
    ...element,
    ...changes,
    updatedAt: new Date(),
  };

  eventBus.emit(EVENT_NAMES.ELEMENT_UPDATED, {
    elementId: element.id,
    changes,
    element: updated,
  });

  return updated;
}

/**
 * Update element style
 */
export function updateElementStyle(
  element: Element,
  styleChanges: Record<string, unknown>
): Element {
  return updateElement(element, {
    style: {
      ...element.style,
      ...styleChanges,
    },
  });
}

/**
 * Update element position
 */
export function updateElementPosition(
  element: Element,
  x: number,
  y: number,
  z?: number
): Element {
  return updateElement(element, {
    position: {
      x,
      y,
      z: z ?? element.position.z,
    },
  });
}

/**
 * Update element size
 */
export function updateElementSize(
  element: Element,
  width: number | 'auto',
  height: number | 'auto'
): Element {
  return updateElement(element, {
    size: { width, height },
  });
}

/**
 * Duplicate an element
 */
export function duplicateElement(element: Element): Element {
  const duplicate: Element = {
    ...element,
    id: uuid(),
    position: {
      ...element.position,
      x: element.position.x + 20,
      y: element.position.y + 20,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  eventBus.emit(EVENT_NAMES.ELEMENT_DUPLICATED, {
    originalId: element.id,
    duplicate,
  });

  return duplicate;
}

/**
 * Delete element event (actual deletion handled by store)
 */
export function deleteElement(elementId: string): void {
  eventBus.emit(EVENT_NAMES.ELEMENT_DELETED, { elementId });
}

/**
 * Validate element
 */
export function validateElement(element: Element): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!element.id) errors.push('Element must have an id');
  if (!element.type) errors.push('Element must have a type');
  if (element.content === undefined) errors.push('Element must have content');

  // Check if type is registered
  if (!elementRegistry.has(element.type)) {
    errors.push(`Unknown element type: ${element.type}`);
  }

  // Run custom validator if exists
  const typeConfig = elementRegistry.get(element.type);
  if (typeConfig?.validator) {
    if (!typeConfig.validator(element)) {
      errors.push(`Element failed custom validation`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate element field value
 */
export function validateElementField(
  element: Element,
  value: unknown
): { valid: boolean; error?: string } {
  const rules = element.validation;
  if (!rules) return { valid: true };

  // Required
  if (rules.required && !value) {
    return {
      valid: false,
      error: `${element.name || 'This field'} is required`,
    };
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return {
        valid: false,
        error: `Minimum ${rules.minLength} characters required`,
      };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        valid: false,
        error: `Maximum ${rules.maxLength} characters allowed`,
      };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return {
        valid: false,
        error: rules.message || 'Invalid format',
      };
    }
  }

  // Custom validator
  if (rules.validator) {
    if (!rules.validator(value)) {
      return {
        valid: false,
        error: rules.message || 'Validation failed',
      };
    }
  }

  return { valid: true };
}

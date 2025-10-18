/**
 * Event Bus - Plugin Communication System
 * Enables plugins to communicate without direct imports
 */

import { EventBus, EventCallback } from './types';

class EventBusImpl implements EventBus {
  private events: Map<string, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback as EventCallback);
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback as EventCallback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<T = unknown>(event: string, data?: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   */
  once<T = unknown>(event: string, callback: EventCallback<T>): void {
    const onceWrapper: EventCallback<T> = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }

  /**
   * Clear all event listeners (useful for testing)
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * Get count of listeners for an event (useful for debugging)
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Get all registered events (useful for debugging)
   */
  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

// Singleton instance
export const eventBus = new EventBusImpl();

// Event names constants (prevents typos)
export const EVENT_NAMES = {
  // Editor events
  EDITOR_ELEMENT_SELECTED: 'editor:element:selected',
  EDITOR_ELEMENT_UPDATED: 'editor:element:updated',
  EDITOR_ELEMENT_DELETED: 'editor:element:deleted',
  EDITOR_TEMPLATE_SAVED: 'editor:template:saved',
  EDITOR_TEMPLATE_LOADED: 'editor:template:loaded',
  
  // Template events
  TEMPLATE_CREATED: 'template:created',
  TEMPLATE_UPDATED: 'template:updated',
  TEMPLATE_PUBLISHED: 'template:published',
  TEMPLATE_DELETED: 'template:deleted',
  
  // User events
  USER_FORM_SUBMITTED: 'user:form:submitted',
  USER_KANKOTRI_GENERATED: 'user:kankotri:generated',
  USER_KANKOTRI_SHARED: 'user:kankotri:shared',
  
  // Animation events
  ANIMATION_APPLIED: 'animation:applied',
  ANIMATION_PREVIEW: 'animation:preview',
  ANIMATION_REMOVED: 'animation:removed',
  
  // Storage events
  STORAGE_SAVE_SUCCESS: 'storage:save:success',
  STORAGE_SAVE_ERROR: 'storage:save:error',
  STORAGE_LOAD_SUCCESS: 'storage:load:success',
  STORAGE_LOAD_ERROR: 'storage:load:error',
} as const;

// Type-safe event data interfaces
export interface EditorElementSelectedEvent {
  elementId: string;
  element: unknown;
}

export interface EditorElementUpdatedEvent {
  elementId: string;
  changes: Record<string, unknown>;
}

export interface EditorElementDeletedEvent {
  elementId: string;
}

export interface TemplateCreatedEvent {
  templateId: string;
  template: unknown;
}

export interface UserFormSubmittedEvent {
  templateId: string;
  userData: Record<string, unknown>;
}

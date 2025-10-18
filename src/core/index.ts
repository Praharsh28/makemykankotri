/**
 * Core System - Central Exports
 * Import everything from core/* through this file
 */

// Types
export * from './types';

// Event Bus
export { eventBus, EVENT_NAMES } from './event-bus';
export type {
  EditorElementSelectedEvent,
  EditorElementUpdatedEvent,
  EditorElementDeletedEvent,
  TemplateCreatedEvent,
  UserFormSubmittedEvent,
} from './event-bus';

// Plugin System
export { pluginRegistry, createPlugin } from './plugin-system';

// Feature Flags
export { featureFlags, FEATURE_FLAGS, useFeatureFlag } from './feature-flags';

// Element System
export * from './element-system';

// Editor State
export { useEditorStore } from './editor-state';

// Template System
export * from './template-system';

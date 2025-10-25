/**
 * Visual Editor Plugin
 * dnd-kit-based visual template editor
 */

import { Plugin } from '@/core/types';
import { pluginRegistry } from '@/core/plugin-system';
import { eventBus, EVENT_NAMES } from '@/core/event-bus';

export const visualEditorPlugin: Plugin = {
  name: 'visual-editor',
  version: '1.0.0',
  description: 'dnd-kit-based visual template editor',
  author: 'WebKankotri',
  
  install: async () => {
    // Register event listeners
    eventBus.on(EVENT_NAMES.TEMPLATE_LOAD, (data) => {
      console.log('Template loaded in visual editor:', data);
    });

    eventBus.on(EVENT_NAMES.ELEMENT_CREATED, (data) => {
      console.log('Element created:', data);
    });

    console.log('✓ Visual Editor plugin installed');
  },

  uninstall: async () => {
    // Cleanup if needed
    console.log('✓ Visual Editor plugin uninstalled');
  },
};

// Auto-register plugin
if (typeof window !== 'undefined') {
  pluginRegistry.register(visualEditorPlugin);
}

// Export components
export { VisualEditor } from './VisualEditor';
export type { VisualEditorProps } from './VisualEditor';
export { EditorPage } from './EditorPage';
export type { EditorPageProps } from './EditorPage';
export * from './components';

// Export hooks
export { useAutoSave } from './hooks/useAutoSave';
export type { UseAutoSaveOptions } from './hooks/useAutoSave';

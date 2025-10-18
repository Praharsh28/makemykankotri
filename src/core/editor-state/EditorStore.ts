/**
 * Editor State Store - Zustand
 * Manages visual editor state (selection, template, history)
 */

import { create } from 'zustand';
import type { Element, Template, EditorStore } from '../types';
import { eventBus, EVENT_NAMES } from '../event-bus';

export const useEditorStore = create<EditorStore>((set, get) => ({
  // State
  selectedElement: null,
  template: null,
  history: [],
  historyIndex: -1,
  clipboard: null,

  // Selection
  setSelectedElement: (element: Element | null) => {
    set({ selectedElement: element });
    if (element) {
      eventBus.emit(EVENT_NAMES.EDITOR_ELEMENT_SELECTED, {
        elementId: element.id,
        element,
      });
    }
  },

  // Template
  loadTemplate: (template: Template) => {
    const history = [template];
    set({
      template,
      history,
      historyIndex: 0,
      selectedElement: null,
    });
    eventBus.emit(EVENT_NAMES.EDITOR_TEMPLATE_LOADED, { template });
  },

  getTemplate: () => {
    return get().template;
  },

  updateTemplate: (updates: Partial<Template>) => {
    const current = get().template;
    if (!current) return;

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date(),
    };

    // Add to history
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);

    set({
      template: updated,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });

    eventBus.emit(EVENT_NAMES.EDITOR_TEMPLATE_SAVED, {
      templateId: updated.id,
      template: updated,
    });
  },

  // Elements
  addElement: (element: Element) => {
    const template = get().template;
    if (!template) return;

    get().updateTemplate({
      elements: [...template.elements, element],
    });

    eventBus.emit('element:created', { element });
  },

  updateElement: (elementId: string, updates: Partial<Element>) => {
    const template = get().template;
    if (!template) return;

    const elements = template.elements.map((el) =>
      el.id === elementId
        ? { ...el, ...updates, updatedAt: new Date() }
        : el
    );

    get().updateTemplate({ elements });

    eventBus.emit(EVENT_NAMES.EDITOR_ELEMENT_UPDATED, {
      elementId,
      changes: updates,
    });
  },

  deleteElement: (elementId: string) => {
    const template = get().template;
    if (!template) return;

    const elements = template.elements.filter((el) => el.id !== elementId);
    get().updateTemplate({ elements });

    // Deselect if selected
    if (get().selectedElement?.id === elementId) {
      get().setSelectedElement(null);
    }

    eventBus.emit(EVENT_NAMES.EDITOR_ELEMENT_DELETED, { elementId });
  },

  // History
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        template: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        template: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // Clipboard
  copy: (element: Element) => {
    set({ clipboard: element });
  },

  paste: () => {
    const { clipboard, template } = get();
    if (!clipboard || !template) return;

    // Create duplicate with new ID and offset position
    const duplicate: Element = {
      ...clipboard,
      id: `${clipboard.id}-copy-${Date.now()}`,
      position: {
        ...clipboard.position,
        x: clipboard.position.x + 20,
        y: clipboard.position.y + 20,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    get().addElement(duplicate);
    get().setSelectedElement(duplicate);
  },

  // Editable fields
  markEditable: (elementIds: string[]) => {
    const template = get().template;
    if (!template) return;

    get().updateTemplate({
      editableFields: elementIds,
    });
  },
}));

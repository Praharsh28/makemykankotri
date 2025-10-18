import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/core/editor-state';
import { Template, Element } from '@/core/types';

describe('Editor Store', () => {
  const mockTemplate: Template = {
    id: 'test-template',
    name: 'Test Template',
    slug: 'test-template',
    elements: [],
    editableFields: [],
    layout: {
      width: 800,
      height: 600,
      background: '#ffffff',
      orientation: 'portrait',
    },
    globalAnimations: [],
    thumbnail: '',
    category: 'test',
    tags: [],
    description: 'Test template',
    createdBy: 'test-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    published: false,
    views: 0,
    uses: 0,
  };

  const mockElement: Element = {
    id: 'element-1',
    type: 'text',
    content: 'Test content',
    position: { x: 100, y: 100, z: 1 },
    size: { width: 200, height: 100 },
    style: {},
    editable: false,
    animations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Reset store
    useEditorStore.setState({
      selectedElement: null,
      template: null,
      history: [],
      historyIndex: -1,
      clipboard: null,
    });
  });

  describe('Template Management', () => {
    it('loads template', () => {
      const { loadTemplate, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      
      const loaded = getTemplate();
      expect(loaded).toEqual(mockTemplate);
    });

    it('updates template', () => {
      const { loadTemplate, updateTemplate, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      updateTemplate({ name: 'Updated Template' });
      
      const updated = getTemplate();
      expect(updated?.name).toBe('Updated Template');
    });

    it('initializes history on load', () => {
      const { loadTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      
      const state = useEditorStore.getState();
      expect(state.history).toHaveLength(1);
      expect(state.historyIndex).toBe(0);
    });
  });

  describe('Element Management', () => {
    it('adds element', () => {
      const { loadTemplate, addElement, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      addElement(mockElement);
      
      const template = getTemplate();
      expect(template?.elements).toHaveLength(1);
      expect(template?.elements[0]).toEqual(mockElement);
    });

    it('updates element', () => {
      const { loadTemplate, addElement, updateElement, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      addElement(mockElement);
      updateElement('element-1', { content: 'Updated content' });
      
      const template = getTemplate();
      expect(template?.elements[0].content).toBe('Updated content');
    });

    it('deletes element', () => {
      const { loadTemplate, addElement, deleteElement, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      addElement(mockElement);
      deleteElement('element-1');
      
      const template = getTemplate();
      expect(template?.elements).toHaveLength(0);
    });

    it('deselects element when deleted', () => {
      const { loadTemplate, addElement, setSelectedElement, deleteElement } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      addElement(mockElement);
      setSelectedElement(mockElement);
      deleteElement('element-1');
      
      const state = useEditorStore.getState();
      expect(state.selectedElement).toBeNull();
    });
  });

  describe('Selection', () => {
    it('sets selected element', () => {
      const { setSelectedElement } = useEditorStore.getState();
      
      setSelectedElement(mockElement);
      
      const state = useEditorStore.getState();
      expect(state.selectedElement).toEqual(mockElement);
    });

    it('clears selection', () => {
      const { setSelectedElement } = useEditorStore.getState();
      
      setSelectedElement(mockElement);
      setSelectedElement(null);
      
      const state = useEditorStore.getState();
      expect(state.selectedElement).toBeNull();
    });
  });

  describe('History (Undo/Redo)', () => {
    it('tracks changes in history', () => {
      const { loadTemplate, updateTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      updateTemplate({ name: 'Update 1' });
      updateTemplate({ name: 'Update 2' });
      
      const state = useEditorStore.getState();
      expect(state.history).toHaveLength(3);
      expect(state.historyIndex).toBe(2);
    });

    it('undoes changes', () => {
      const { loadTemplate, updateTemplate, undo, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      updateTemplate({ name: 'Update 1' });
      updateTemplate({ name: 'Update 2' });
      
      undo();
      
      const template = getTemplate();
      expect(template?.name).toBe('Update 1');
    });

    it('redoes changes', () => {
      const { loadTemplate, updateTemplate, undo, redo, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      updateTemplate({ name: 'Update 1' });
      updateTemplate({ name: 'Update 2' });
      
      undo();
      redo();
      
      const template = getTemplate();
      expect(template?.name).toBe('Update 2');
    });

    it('checks canUndo', () => {
      const { loadTemplate, updateTemplate, canUndo } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      expect(canUndo()).toBe(false);
      
      updateTemplate({ name: 'Update 1' });
      expect(canUndo()).toBe(true);
    });

    it('checks canRedo', () => {
      const { loadTemplate, updateTemplate, undo, canRedo } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      updateTemplate({ name: 'Update 1' });
      
      expect(canRedo()).toBe(false);
      
      undo();
      expect(canRedo()).toBe(true);
    });
  });

  describe('Clipboard', () => {
    it('copies element', () => {
      const { copy } = useEditorStore.getState();
      
      copy(mockElement);
      
      const state = useEditorStore.getState();
      expect(state.clipboard).toEqual(mockElement);
    });

    it('pastes element', () => {
      const { loadTemplate, copy, paste, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      copy(mockElement);
      paste();
      
      const template = getTemplate();
      expect(template?.elements).toHaveLength(1);
      expect(template?.elements[0].id).not.toBe(mockElement.id);
      expect(template?.elements[0].content).toBe(mockElement.content);
    });

    it('offsets pasted element position', () => {
      const { loadTemplate, copy, paste, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      copy(mockElement);
      paste();
      
      const template = getTemplate();
      const pasted = template?.elements[0];
      expect(pasted?.position.x).toBe(mockElement.position.x + 20);
      expect(pasted?.position.y).toBe(mockElement.position.y + 20);
    });
  });

  describe('Editable Fields', () => {
    it('marks fields as editable', () => {
      const { loadTemplate, markEditable, getTemplate } = useEditorStore.getState();
      
      loadTemplate(mockTemplate);
      markEditable(['element-1', 'element-2']);
      
      const template = getTemplate();
      expect(template?.editableFields).toEqual(['element-1', 'element-2']);
    });
  });
});

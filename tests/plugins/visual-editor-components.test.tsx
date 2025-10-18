import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useEditorStore } from '@/core/editor-state';
import { Template, Element } from '@/core/types';
import { registerBuiltInElements } from '@/core/element-system';
import { PropertiesPanel } from '@/plugins/visual-editor/components/PropertiesPanel';
import { LayersPanel } from '@/plugins/visual-editor/components/LayersPanel';
import { EditorToolbar } from '@/plugins/visual-editor/components/EditorToolbar';

// Register built-in elements before tests
registerBuiltInElements();

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
  style: {
    font: 'Inter',
    fontSize: 16,
    color: '#000000',
  },
  editable: false,
  animations: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Visual Editor Components', () => {
  beforeEach(() => {
    useEditorStore.setState({
      selectedElement: null,
      template: null,
      history: [],
      historyIndex: -1,
      clipboard: null,
    });
  });

  describe('PropertiesPanel', () => {
    it('shows message when no element selected', () => {
      render(<PropertiesPanel />);
      expect(screen.getByText('Select an element to edit')).toBeInTheDocument();
    });

    it('shows element properties when selected', () => {
      useEditorStore.setState({
        selectedElement: mockElement,
        template: mockTemplate,
      });

      render(<PropertiesPanel />);
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    });

    it('updates element on content change', () => {
      const updateElement = vi.fn();
      useEditorStore.setState({
        selectedElement: mockElement,
        template: mockTemplate,
        updateElement,
      });

      render(<PropertiesPanel />);
      
      const textarea = screen.getByDisplayValue('Test content');
      fireEvent.change(textarea, { target: { value: 'Updated content' } });
      
      expect(updateElement).toHaveBeenCalledWith('element-1', {
        content: 'Updated content',
      });
    });

    it('shows editable toggle', () => {
      useEditorStore.setState({
        selectedElement: mockElement,
        template: mockTemplate,
      });

      render(<PropertiesPanel />);
      expect(screen.getByText('Allow users to edit')).toBeInTheDocument();
    });
  });

  describe('LayersPanel', () => {
    it('shows message when no template loaded', () => {
      render(<LayersPanel />);
      expect(screen.getByText('No template loaded')).toBeInTheDocument();
    });

    it('shows message when no elements', () => {
      useEditorStore.setState({ template: mockTemplate });

      render(<LayersPanel />);
      expect(screen.getByText('No elements yet')).toBeInTheDocument();
    });

    it('displays elements list', () => {
      const templateWithElements = {
        ...mockTemplate,
        elements: [mockElement],
      };
      useEditorStore.setState({ template: templateWithElements });

      render(<LayersPanel />);
      expect(screen.getByText('Layers')).toBeInTheDocument();
      expect(screen.getByText(/text-/)).toBeInTheDocument();
    });

    it('selects element on click', () => {
      const setSelectedElement = vi.fn();
      const templateWithElements = {
        ...mockTemplate,
        elements: [mockElement],
      };
      useEditorStore.setState({
        template: templateWithElements,
        setSelectedElement,
      });

      render(<LayersPanel />);
      
      const layerItem = screen.getByText(/text-/);
      fireEvent.click(layerItem);
      
      expect(setSelectedElement).toHaveBeenCalled();
    });
  });

  describe('EditorToolbar', () => {
    beforeEach(() => {
      useEditorStore.setState({ template: mockTemplate });
    });

    it('displays template name', () => {
      render(<EditorToolbar />);
      expect(screen.getByText('Test Template')).toBeInTheDocument();
    });

    it('shows add element buttons', () => {
      render(<EditorToolbar />);
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
      expect(screen.getByText('Gallery')).toBeInTheDocument();
      expect(screen.getByText('Container')).toBeInTheDocument();
    });

    it('shows undo/redo buttons', () => {
      render(<EditorToolbar />);
      expect(screen.getByText(/Undo/)).toBeInTheDocument();
      expect(screen.getByText(/Redo/)).toBeInTheDocument();
    });

    it('calls onSave when save clicked', () => {
      const onSave = vi.fn();
      render(<EditorToolbar onSave={onSave} />);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      expect(onSave).toHaveBeenCalled();
    });

    it('calls onPublish when publish clicked', () => {
      const onPublish = vi.fn();
      render(<EditorToolbar onPublish={onPublish} />);
      
      const publishButton = screen.getByText('Publish');
      fireEvent.click(publishButton);
      
      expect(onPublish).toHaveBeenCalled();
    });

    it('adds element when button clicked', () => {
      const addElement = vi.fn();
      useEditorStore.setState({
        template: mockTemplate,
        addElement,
      });

      render(<EditorToolbar />);
      
      const textButton = screen.getByText('Text');
      fireEvent.click(textButton);
      
      expect(addElement).toHaveBeenCalled();
    });
  });
});

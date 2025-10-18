import { describe, it, expect, beforeEach } from 'vitest';
import { elementRegistry, createElement, updateElement, duplicateElement, validateElement, registerBuiltInElements } from '@/core/element-system';
import { Element } from '@/core/types';

describe('Element System', () => {
  beforeEach(() => {
    elementRegistry.clear();
  });

  describe('Element Registry', () => {
    it('registers element types', () => {
      elementRegistry.register('test', {
        name: 'Test Element',
        defaultContent: 'test',
        renderer: (element) => element.content,
      });

      expect(elementRegistry.has('test')).toBe(true);
      expect(elementRegistry.get('test')?.name).toBe('Test Element');
    });

    it('prevents duplicate registration', () => {
      elementRegistry.register('test', {
        name: 'Test',
        defaultContent: 'test',
        renderer: () => null,
      });

      expect(() => {
        elementRegistry.register('test', {
          name: 'Test 2',
          defaultContent: 'test2',
          renderer: () => null,
        });
      }).toThrow('already registered');
    });

    it('unregisters element types', () => {
      elementRegistry.register('test', {
        name: 'Test',
        defaultContent: 'test',
        renderer: () => null,
      });

      expect(elementRegistry.has('test')).toBe(true);
      elementRegistry.unregister('test');
      expect(elementRegistry.has('test')).toBe(false);
    });

    it('gets all element types', () => {
      elementRegistry.register('test1', {
        name: 'Test 1',
        defaultContent: 'test1',
        renderer: () => null,
      });
      elementRegistry.register('test2', {
        name: 'Test 2',
        defaultContent: 'test2',
        renderer: () => null,
      });

      const all = elementRegistry.getAll();
      expect(all.size).toBe(2);
      expect(all.has('test1')).toBe(true);
      expect(all.has('test2')).toBe(true);
    });

    it('validates element type config', () => {
      expect(() => {
        elementRegistry.register('invalid', {
          name: '',
          defaultContent: 'test',
          renderer: () => null,
        });
      }).toThrow('valid name');

      expect(() => {
        elementRegistry.register('invalid', {
          name: 'Test',
          defaultContent: undefined,
          renderer: () => null,
        } as never);
      }).toThrow('defaultContent');
    });
  });

  describe('Element Factory', () => {
    beforeEach(() => {
      elementRegistry.register('text', {
        name: 'Text',
        defaultContent: 'Default text',
        defaultStyle: { fontSize: 16 },
        renderer: (element) => element.content,
      });
    });

    it('creates elements', () => {
      const element = createElement('text');

      expect(element.id).toBeDefined();
      expect(element.type).toBe('text');
      expect(element.content).toBe('Default text');
      expect(element.style.fontSize).toBe(16);
      expect(element.createdAt).toBeInstanceOf(Date);
      expect(element.updatedAt).toBeInstanceOf(Date);
    });

    it('creates elements with overrides', () => {
      const element = createElement('text', {
        content: 'Custom text',
        position: { x: 100, y: 200, z: 10 },
        editable: true,
      });

      expect(element.content).toBe('Custom text');
      expect(element.position.x).toBe(100);
      expect(element.position.y).toBe(200);
      expect(element.editable).toBe(true);
    });

    it('updates elements', () => {
      const element = createElement('text');
      const updated = updateElement(element, {
        content: 'Updated text',
      });

      expect(updated.content).toBe('Updated text');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(element.updatedAt.getTime());
    });

    it('duplicates elements', () => {
      const element = createElement('text', {
        content: 'Original',
        position: { x: 100, y: 100, z: 1 },
      });

      const duplicate = duplicateElement(element);

      expect(duplicate.id).not.toBe(element.id);
      expect(duplicate.content).toBe('Original');
      expect(duplicate.position.x).toBe(120); // Offset by 20
      expect(duplicate.position.y).toBe(120); // Offset by 20
    });

    it('validates elements', () => {
      const element = createElement('text');
      const result = validateElement(element);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('validates invalid elements', () => {
      const invalidElement = {
        id: '',
        type: 'unknown',
        content: undefined,
      } as Element;

      const result = validateElement(invalidElement);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Built-in Element Types', () => {
    beforeEach(() => {
      registerBuiltInElements();
    });

    it('registers text element', () => {
      expect(elementRegistry.has('text')).toBe(true);
      
      const textElement = createElement('text');
      expect(textElement.type).toBe('text');
      expect(typeof textElement.content).toBe('string');
    });

    it('registers image element', () => {
      expect(elementRegistry.has('image')).toBe(true);
      
      const imageElement = createElement('image');
      expect(imageElement.type).toBe('image');
      expect(typeof imageElement.content).toBe('object');
    });

    it('registers gallery element', () => {
      expect(elementRegistry.has('gallery')).toBe(true);
      
      const galleryElement = createElement('gallery');
      expect(galleryElement.type).toBe('gallery');
      expect(Array.isArray(galleryElement.content)).toBe(true);
    });

    it('registers container element', () => {
      expect(elementRegistry.has('container')).toBe(true);
      
      const containerElement = createElement('container');
      expect(containerElement.type).toBe('container');
      expect(Array.isArray(containerElement.content)).toBe(true);
    });

    it('creates text element with default style', () => {
      const textElement = createElement('text');
      
      expect(textElement.style.font).toBe('Inter');
      expect(textElement.style.fontSize).toBe(16);
      expect(textElement.style.color).toBe('#000000');
    });

    it('creates image element with default content', () => {
      const imageElement = createElement('image');
      const content = imageElement.content as { url: string; alt: string };
      
      expect(content.url).toBe('');
      expect(content.alt).toBe('Image');
    });
  });
});

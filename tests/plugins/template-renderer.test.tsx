/**
 * Template Renderer Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TemplateRenderer } from '@/plugins/template-renderer/TemplateRenderer';
import { featureFlags } from '@/core/feature-flags';
import type { Template, Element } from '@/core/types';

const mockTemplate: Template = {
  id: 'test-template',
  name: 'Test Template',
  slug: 'test-template',
  elements: [
    {
      id: 'elem-1',
      type: 'text',
      content: 'Hello {{name}}',
      position: { x: 0, y: 0, z: 0 },
      size: { width: 'auto', height: 'auto' },
      style: { fontFamily: 'Inter', fontSize: 24, color: '#000' },
      editable: true,
      required: true,
      name: 'name',
      placeholder: 'Enter name',
      animations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'elem-2',
      type: 'text',
      content: 'Date: {{weddingDate}}',
      position: { x: 0, y: 100, z: 1 },
      size: { width: 'auto', height: 'auto' },
      style: { fontFamily: 'Inter', fontSize: 18, color: '#333' },
      editable: true,
      required: false,
      animations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  editableFields: ['elem-1', 'elem-2'],
  layout: {
    width: 800,
    height: 1200,
    background: '#FFFFFF',
    orientation: 'portrait',
  },
  globalAnimations: [],
  thumbnail: '',
  category: 'wedding',
  tags: ['test'],
  description: 'Test template',
  createdBy: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  published: true,
  views: 0,
  uses: 0,
};

describe('Template Renderer', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('template-renderer');
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('template-renderer');
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders template elements', () => {
      render(<TemplateRenderer template={mockTemplate} data={{ name: 'John' }} />);
      expect(screen.getByText('Hello John')).toBeInTheDocument();
    });

    it('applies layout dimensions', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      const wrapper = container.querySelector('[data-testid="template-container"]');
      expect(wrapper).toHaveStyle({ width: '800px', height: '1200px' });
    });

    it('applies background color', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      const wrapper = container.querySelector('[data-testid="template-container"]');
      expect(wrapper).toHaveStyle({ backgroundColor: '#FFFFFF' });
    });
  });

  describe('Data Injection', () => {
    it('replaces placeholders with data', () => {
      render(
        <TemplateRenderer
          template={mockTemplate}
          data={{ name: 'Jane Doe', weddingDate: '2025-12-25' }}
        />
      );
      expect(screen.getByText('Hello Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Date: 2025-12-25')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<TemplateRenderer template={mockTemplate} data={{}} />);
      expect(screen.getByText('Hello {{name}}')).toBeInTheDocument();
    });

    it('handles nested object data', () => {
      const templateWithNested: Template = {
        ...mockTemplate,
        elements: [
          {
            ...mockTemplate.elements[0],
            content: 'Hello {{bride.name}} and {{groom.name}}',
          },
        ],
      };

      render(
        <TemplateRenderer
          template={templateWithNested}
          data={{ bride: { name: 'Alice' }, groom: { name: 'Bob' } }}
        />
      );
      expect(screen.getByText('Hello Alice and Bob')).toBeInTheDocument();
    });

    it('supports multiple placeholders in one element', () => {
      const template: Template = {
        ...mockTemplate,
        elements: [
          {
            ...mockTemplate.elements[0],
            content: '{{greeting}} {{name}}, welcome to {{event}}!',
          },
        ],
      };

      render(
        <TemplateRenderer
          template={template}
          data={{ greeting: 'Hello', name: 'John', event: 'Our Wedding' }}
        />
      );
      expect(screen.getByText('Hello John, welcome to Our Wedding!')).toBeInTheDocument();
    });
  });

  describe('Element Positioning', () => {
    it('positions elements using absolute positioning', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      const element = container.querySelector('[data-element-id="elem-1"]');
      expect(element).toHaveStyle({ position: 'absolute', left: '0px', top: '0px' });
    });

    it('respects z-index ordering', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      const elem1 = container.querySelector('[data-element-id="elem-1"]');
      const elem2 = container.querySelector('[data-element-id="elem-2"]');
      expect(elem1).toHaveStyle({ zIndex: '0' });
      expect(elem2).toHaveStyle({ zIndex: '1' });
    });
  });

  describe('Element Styling', () => {
    it('applies font styles', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      const element = container.querySelector('[data-element-id="elem-1"]');
      expect(element).toHaveStyle({
        fontFamily: 'Inter',
        fontSize: '24px',
        color: '#000',
      });
    });

    it('handles image elements', () => {
      const templateWithImage: Template = {
        ...mockTemplate,
        elements: [
          {
            id: 'img-1',
            type: 'image',
            content: { url: 'https://example.com/image.jpg', alt: 'Test Image' },
            position: { x: 0, y: 0, z: 0 },
            size: { width: 200, height: 200 },
            style: {},
            editable: false,
            required: false,
            animations: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      render(<TemplateRenderer template={templateWithImage} data={{}} />);
      const img = screen.getByAltText('Test Image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Export Modes', () => {
    it('renders in preview mode by default', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} />
      );
      expect(container.querySelector('[data-mode="preview"]')).toBeInTheDocument();
    });

    it('renders in export mode', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} mode="export" />
      );
      expect(container.querySelector('[data-mode="export"]')).toBeInTheDocument();
    });

    it('excludes interactive elements in export mode', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{}} mode="export" />
      );
      expect(container.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('Static HTML Generation', () => {
    it('generates valid HTML structure', () => {
      const { container } = render(
        <TemplateRenderer template={mockTemplate} data={{ name: 'Test' }} />
      );
      expect(container.querySelector('[data-testid="template-container"]')).toBeInTheDocument();
    });

    it('includes all template data in export', () => {
      const { container } = render(
        <TemplateRenderer
          template={mockTemplate}
          data={{ name: 'John', weddingDate: '2025-12-25' }}
          mode="export"
        />
      );
      const html = container.innerHTML;
      expect(html).toContain('John');
      expect(html).toContain('2025-12-25');
    });
  });
});

/**
 * Form Builder Plugin Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormGenerator } from '@/plugins/form-builder/FormGenerator';
import { extractFormFields, createFormSchema } from '@/plugins/form-builder/validation';
import { useFormData } from '@/plugins/form-builder/useFormData';
import { renderHook, act } from '@testing-library/react';
import { Template, Element } from '@/core/types';
import { formBuilderPlugin } from '@/plugins/form-builder';
import { pluginRegistry } from '@/core/plugin-system';
import { featureFlags } from '@/core/feature-flags';

describe('Form Builder Plugin', () => {
  beforeEach(() => {
    // Reset feature flags
    featureFlags.disable('form-builder');
  });

  describe('Plugin Registration', () => {
    it('registers the form-builder plugin', () => {
      pluginRegistry.register(formBuilderPlugin);
      expect(pluginRegistry.hasPlugin('form-builder')).toBe(true);
    });

    it('enables feature flag on install', () => {
      formBuilderPlugin.install(pluginRegistry);
      expect(featureFlags.isEnabled('form-builder')).toBe(true);
    });

    it('disables feature flag on uninstall', () => {
      formBuilderPlugin.install(pluginRegistry);
      formBuilderPlugin.uninstall?.();
      expect(featureFlags.isEnabled('form-builder')).toBe(false);
    });
  });

  describe('Extract Form Fields', () => {
    it('extracts editable fields from template', () => {
      const elements: Element[] = [
        {
          id: 'elem1',
          type: 'text',
          content: 'John Doe',
          position: { x: 0, y: 0, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: true,
          required: true,
          name: 'Full Name',
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'elem2',
          type: 'text',
          content: 'email@example.com',
          position: { x: 0, y: 50, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: true,
          validation: { type: 'email', required: true },
          name: 'Email',
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'elem3',
          type: 'text',
          content: 'Fixed Text',
          position: { x: 0, y: 100, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: false, // Not editable
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const fields = extractFormFields(elements, ['elem1', 'elem2']);

      expect(fields).toHaveLength(2);
      expect(fields[0].elementId).toBe('elem1');
      expect(fields[0].label).toBe('Full Name');
      expect(fields[0].required).toBe(true);
      expect(fields[1].elementId).toBe('elem2');
      expect(fields[1].type).toBe('email');
    });

    it('skips non-editable elements', () => {
      const elements: Element[] = [
        {
          id: 'elem1',
          type: 'text',
          content: 'Text',
          position: { x: 0, y: 0, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: false,
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const fields = extractFormFields(elements, ['elem1']);
      expect(fields).toHaveLength(0);
    });
  });

  describe('Form Schema Generation', () => {
    it('creates Zod schema from form fields', () => {
      const fields = [
        {
          elementId: 'name',
          name: 'name',
          label: 'Name',
          type: 'text' as const,
          required: true,
        },
        {
          elementId: 'email',
          name: 'email',
          label: 'Email',
          type: 'email' as const,
          required: true,
        },
      ];

      const schema = createFormSchema(fields);
      
      // Valid data should pass
      const validData = { name: 'John', email: 'john@example.com' };
      expect(() => schema.parse(validData)).not.toThrow();

      // Invalid email should fail
      const invalidData = { name: 'John', email: 'invalid-email' };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('handles optional fields', () => {
      const fields = [
        {
          elementId: 'optional',
          name: 'optional',
          label: 'Optional Field',
          type: 'text' as const,
          required: false,
        },
      ];

      const schema = createFormSchema(fields);
      
      // Should pass with empty value
      expect(() => schema.parse({})).not.toThrow();
      expect(() => schema.parse({ optional: 'value' })).not.toThrow();
    });
  });

  describe('useFormData Hook', () => {
    it('initializes with template ID', () => {
      const { result } = renderHook(() => useFormData('template-123'));
      
      expect(result.current.formData.templateId).toBe('template-123');
      expect(result.current.formData.fields).toEqual({});
    });

    it('updates single field', () => {
      const { result } = renderHook(() => useFormData('template-123'));
      
      act(() => {
        result.current.updateField('name', 'John Doe');
      });

      expect(result.current.formData.fields.name).toBe('John Doe');
    });

    it('updates multiple fields', () => {
      const { result } = renderHook(() => useFormData('template-123'));
      
      act(() => {
        result.current.updateFields({
          name: 'John',
          email: 'john@example.com',
        });
      });

      expect(result.current.formData.fields.name).toBe('John');
      expect(result.current.formData.fields.email).toBe('john@example.com');
    });

    it('resets form data', () => {
      const { result } = renderHook(() => useFormData('template-123'));
      
      act(() => {
        result.current.updateField('name', 'John');
      });

      expect(result.current.formData.fields.name).toBe('John');

      act(() => {
        result.current.reset();
      });

      expect(result.current.formData.fields).toEqual({});
    });

    it('submits form data', async () => {
      const { result } = renderHook(() => useFormData('template-123'));
      
      act(() => {
        result.current.updateField('name', 'John');
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submit();
      });

      expect(submitResult).toBeDefined();
      expect(submitResult!.success).toBe(true);
      expect(submitResult!.data?.fields.name).toBe('John');
      expect(submitResult!.generatedUrl).toContain('/preview/template-123');
    });
  });

  describe('FormGenerator Component', () => {
    const createMockTemplate = (): Template => ({
      id: 'template-123',
      name: 'Test Template',
      slug: 'test-template',
      description: 'A test template',
      elements: [
        {
          id: 'elem1',
          type: 'text',
          content: '',
          position: { x: 0, y: 0, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: true,
          required: true,
          name: 'Full Name',
          placeholder: 'Enter your name',
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'elem2',
          type: 'text',
          content: '',
          position: { x: 0, y: 50, z: 0 },
          size: { width: 200, height: 50 },
          style: {},
          editable: true,
          required: true,
          name: 'Email',
          validation: { type: 'email', required: true },
          animations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      editableFields: ['elem1', 'elem2'],
      layout: {
        width: 800,
        height: 600,
        background: '#ffffff',
        orientation: 'portrait',
      },
      globalAnimations: [],
      thumbnail: '',
      category: 'wedding',
      tags: [],
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      published: true,
      views: 0,
      uses: 0,
    });

    it('renders form when feature flag is enabled', () => {
      featureFlags.enable('form-builder');
      const template = createMockTemplate();
      
      render(<FormGenerator template={template} />);
      
      expect(screen.getByText('Test Template')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it('shows disabled message when feature flag is off', () => {
      const template = createMockTemplate();
      
      render(<FormGenerator template={template} />);
      
      expect(screen.getByText(/Form builder feature is disabled/i)).toBeInTheDocument();
    });

    it('displays required field indicators', () => {
      featureFlags.enable('form-builder');
      const template = createMockTemplate();
      
      render(<FormGenerator template={template} />);
      
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });

    it('shows validation errors for invalid input', async () => {
      featureFlags.enable('form-builder');
      const template = createMockTemplate();
      
      render(<FormGenerator template={template} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      });
    });

    it('calls onSubmit when form is valid', async () => {
      featureFlags.enable('form-builder');
      const template = createMockTemplate();
      const onSubmit = vi.fn();
      
      render(<FormGenerator template={template} onSubmit={onSubmit} />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      
      // Wait for validation to complete
      await waitFor(() => {
        const submitButton = screen.getByText('Submit');
        expect(submitButton).not.toBeDisabled();
      });
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          elem1: 'John Doe',
          elem2: 'john@example.com',
        });
      }, { timeout: 2000 });
    });

    it('shows no fields message when no editable fields', () => {
      featureFlags.enable('form-builder');
      const template = createMockTemplate();
      template.editableFields = [];
      
      render(<FormGenerator template={template} />);
      
      expect(screen.getByText(/No editable fields found/i)).toBeInTheDocument();
    });
  });
});

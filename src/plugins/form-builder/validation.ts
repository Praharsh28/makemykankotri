/**
 * Form Validation with Zod
 * Generates schemas from template editable fields
 */

import { z } from 'zod';
import { Element, ValidationRule } from '@/core/types';
import { FormField } from './types';

/**
 * Convert ValidationRule to Zod schema
 */
export function createFieldSchema(field: FormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base schema by type
  switch (field.type) {
    case 'email':
      schema = z.string().email({ message: field.validation?.message || 'Invalid email address' });
      break;
    case 'url':
      schema = z.string().url({ message: field.validation?.message || 'Invalid URL' });
      break;
    case 'number':
      schema = z.string().regex(/^\d+$/, { message: field.validation?.message || 'Must be a number' });
      break;
    case 'date':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: field.validation?.message || 'Invalid date format (YYYY-MM-DD)' });
      break;
    case 'text':
    default:
      schema = z.string();
      break;
  }

  // Apply validation rules
  if (field.validation) {
    const rule = field.validation;

    if (rule.minLength) {
      schema = (schema as z.ZodString).min(rule.minLength, {
        message: rule.message || `Minimum ${rule.minLength} characters required`,
      });
    }

    if (rule.maxLength) {
      schema = (schema as z.ZodString).max(rule.maxLength, {
        message: rule.message || `Maximum ${rule.maxLength} characters allowed`,
      });
    }

    if (rule.pattern) {
      schema = (schema as z.ZodString).regex(rule.pattern, {
        message: rule.message || 'Invalid format',
      });
    }
  }

  // Make optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Generate Zod schema from form fields
 */
export function createFormSchema(fields: FormField[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    schemaFields[field.elementId] = createFieldSchema(field);
  });

  return z.object(schemaFields);
}

/**
 * Extract form fields from template elements
 */
export function extractFormFields(elements: Element[], editableFieldIds: string[]): FormField[] {
  const fields: FormField[] = [];

  elements.forEach((element) => {
    if (!editableFieldIds.includes(element.id)) {
      return;
    }

    if (!element.editable) {
      return;
    }

    // Determine field type from element type and validation
    let fieldType: FormField['type'] = 'text';
    if (element.validation?.type === 'email') {
      fieldType = 'email';
    } else if (element.validation?.type === 'url') {
      fieldType = 'url';
    } else if (element.validation?.type === 'number') {
      fieldType = 'number';
    } else if (element.validation?.type === 'date') {
      fieldType = 'date';
    }

    fields.push({
      elementId: element.id,
      name: element.name || `field_${element.id.slice(0, 8)}`,
      label: element.name || `Field ${fields.length + 1}`,
      type: fieldType,
      placeholder: element.placeholder,
      required: element.required || false,
      validation: element.validation,
      defaultValue: typeof element.content === 'string' ? element.content : undefined,
    });
  });

  return fields;
}

/**
 * Form Builder Plugin Types
 */

import { ValidationRule } from '@/core/types';

export interface FormField {
  elementId: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'url';
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule;
  defaultValue?: string;
}

export interface FormData {
  templateId: string;
  fields: Record<string, unknown>;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormSubmissionResult {
  success: boolean;
  data?: FormData;
  error?: string;
  generatedUrl?: string;
}

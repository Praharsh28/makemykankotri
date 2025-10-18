/**
 * Form Builder Plugin
 * Generates forms from template editable fields
 */

import { Plugin } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';

export const formBuilderPlugin: Plugin = {
  name: 'form-builder',
  version: '1.0.0',
  description: 'Generate dynamic forms from template editable fields',
  author: 'WebKankotri Team',

  install: () => {
    // Enable feature flag
    featureFlags.enable('form-builder');
    console.log('✓ Plugin "form-builder" v1.0.0 installed');
  },

  uninstall: () => {
    featureFlags.disable('form-builder');
    console.log('✓ Plugin "form-builder" uninstalled');
  },
};

// Export components and hooks
export { FormGenerator } from './FormGenerator';
export { FormPreview } from './FormPreview';
export { FileUpload } from './FileUpload';
export { FormStepper } from './FormStepper';
export { useFormData, EVENT_NAMES as FORM_EVENT_NAMES } from './useFormData';
export { useDraftSave } from './useDraftSave';
export { extractFormFields, createFormSchema, createFieldSchema } from './validation';
export type { FormField, FormData, FormErrors, FormSubmissionResult } from './types';
export type { FormPreviewProps } from './FormPreview';
export type { FileUploadProps } from './FileUpload';
export type { FormStep, FormStepperProps } from './FormStepper';
export type { UseDraftSaveOptions, UseDraftSaveReturn } from './useDraftSave';

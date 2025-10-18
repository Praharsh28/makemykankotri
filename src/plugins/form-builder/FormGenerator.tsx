/**
 * FormGenerator Component
 * Generates dynamic form from template editable fields
 */

'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Template } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';
import { extractFormFields, createFormSchema } from './validation';
import { useFormData } from './useFormData';
import { FormField } from './types';

export interface FormGeneratorProps {
  template: Template;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  className?: string;
}

export function FormGenerator({
  template,
  onSubmit,
  onCancel,
  className = '',
}: FormGeneratorProps) {
  // Extract form fields from template (must be before any conditional returns)
  const formFields = useMemo(
    () => extractFormFields(template.elements, template.editableFields),
    [template.elements, template.editableFields]
  );

  // Create Zod schema
  const formSchema = useMemo(() => createFormSchema(formFields), [formFields]);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  // Setup form data hook
  const {
    updateField,
    submit: submitFormData,
    isSubmitting,
    submitResult,
  } = useFormData(template.id);

  // Check feature flag (after all hooks)
  if (!featureFlags.isEnabled('form-builder')) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">Form builder feature is disabled</p>
      </div>
    );
  }

  /**
   * Handle form submission
   */
  const onFormSubmit = async (data: Record<string, unknown>) => {
    // Update all fields
    Object.entries(data).forEach(([fieldId, value]) => {
      updateField(fieldId, value);
    });

    // Submit form
    const result = await submitFormData();

    if (result.success && onSubmit) {
      onSubmit(data);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const error = errors[field.elementId];
    const errorMessage = error?.message as string | undefined;

    return (
      <div key={field.elementId} className="mb-4">
        <label htmlFor={field.elementId} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          id={field.elementId}
          type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
          placeholder={field.placeholder}
          {...register(field.elementId)}
          className={`
            w-full px-3 py-2 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />

        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
        {template.description && (
          <p className="mt-2 text-gray-600">{template.description}</p>
        )}
      </div>

      {formFields.length === 0 ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">
            No editable fields found. Admin needs to mark fields as editable in the template.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {formFields.map((field) => renderField(field))}

          {submitResult && (
            <div
              className={`p-4 rounded ${
                submitResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {submitResult.success ? (
                <>
                  <p className="text-green-800 font-medium">Form submitted successfully!</p>
                  {submitResult.generatedUrl && (
                    <a
                      href={submitResult.generatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-600 hover:text-blue-800 underline"
                    >
                      View your generated page →
                    </a>
                  )}
                </>
              ) : (
                <p className="text-red-800">{submitResult.error}</p>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`
                px-6 py-2 rounded-md font-medium
                ${
                  !isValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * useFormData Hook
 * Manages form state and submission
 */

import { useState } from 'react';
import { FormData, FormSubmissionResult } from './types';
import { eventBus } from '@/core/event-bus';

export const EVENT_NAMES = {
  FORM_SUBMITTED: 'form:submitted',
  FORM_ERROR: 'form:error',
  FORM_DATA_CHANGED: 'form:dataChanged',
} as const;

export function useFormData(templateId: string) {
  const [formData, setFormData] = useState<FormData>({
    templateId,
    fields: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<FormSubmissionResult | null>(null);

  /**
   * Update a single field
   */
  const updateField = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldId]: value,
      },
    }));

    eventBus.emit(EVENT_NAMES.FORM_DATA_CHANGED, { fieldId, value });
  };

  /**
   * Update multiple fields
   */
  const updateFields = (fields: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        ...fields,
      },
    }));

    eventBus.emit(EVENT_NAMES.FORM_DATA_CHANGED, { fields });
  };

  /**
   * Reset form data
   */
  const reset = () => {
    setFormData({
      templateId,
      fields: {},
    });
    setSubmitResult(null);
  };

  /**
   * Submit form data
   */
  const submit = async (): Promise<FormSubmissionResult> => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Emit submit event
      eventBus.emit(EVENT_NAMES.FORM_SUBMITTED, formData);

      // TODO: In production, this would call an API to:
      // 1. Generate the webpage with user data
      // 2. Store in database
      // 3. Return unique URL

      // For now, simulate success
      const result: FormSubmissionResult = {
        success: true,
        data: formData,
        generatedUrl: `/preview/${templateId}?data=${btoa(JSON.stringify(formData.fields))}`,
      };

      setSubmitResult(result);
      return result;
    } catch (error) {
      const result: FormSubmissionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };

      setSubmitResult(result);
      eventBus.emit(EVENT_NAMES.FORM_ERROR, { error });
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    updateFields,
    reset,
    submit,
    isSubmitting,
    submitResult,
  };
}

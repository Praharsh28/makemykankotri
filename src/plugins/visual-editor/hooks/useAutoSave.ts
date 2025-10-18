/**
 * Auto-Save Hook
 * Automatically saves template after changes
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Template } from '@/core/types';
import { templateStorage } from '@/core/template-system';

export interface UseAutoSaveOptions {
  enabled?: boolean;
  delay?: number;
  onSave?: (template: Template) => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(
  template: Template | null,
  options: UseAutoSaveOptions = {}
) {
  const {
    enabled = true,
    delay = 2000,
    onSave,
    onError,
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedRef = useRef<string>('');

  const save = useCallback(
    async (templateToSave: Template) => {
      try {
        const saved = await templateStorage.save(templateToSave);
        lastSavedRef.current = JSON.stringify(saved);
        if (onSave) {
          onSave(saved);
        }
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    },
    [onSave, onError]
  );

  useEffect(() => {
    if (!enabled || !template) {
      return;
    }

    // Skip if template hasn't changed
    const currentState = JSON.stringify(template);
    if (currentState === lastSavedRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule save
    timeoutRef.current = setTimeout(() => {
      save(template);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [template, enabled, delay, save]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (template) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return save(template);
    }
  }, [template, save]);

  return { saveNow };
}

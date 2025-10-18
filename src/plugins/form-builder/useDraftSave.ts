/**
 * useDraftSave Hook
 * Auto-save form drafts to localStorage
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface UseDraftSaveOptions {
  autoSaveDelay?: number; // milliseconds
}

export interface UseDraftSaveReturn<T> {
  draft: T | null;
  saveDraft: (data: T) => void;
  updateDraft: (data: Partial<T>) => void;
  clearDraft: () => void;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
}

export function useDraftSave<T extends Record<string, unknown>>(
  key: string,
  options: UseDraftSaveOptions = {}
): UseDraftSaveReturn<T> {
  const { autoSaveDelay = 2000 } = options;
  
  const [draft, setDraft] = useState<T | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!featureFlags.isEnabled('form-builder')) {
      return;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        setDraft(parsed);
      }
    } catch (error) {
      console.error('[useDraftSave] Failed to load draft:', error);
      // Clear invalid data
      localStorage.removeItem(key);
    }
  }, [key]);

  // Save to localStorage
  const saveToStorage = useCallback((data: T) => {
    if (!featureFlags.isEnabled('form-builder')) {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(data));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('[useDraftSave] Failed to save draft:', error);
    }
  }, [key]);

  // Save draft immediately
  const saveDraft = useCallback((data: T) => {
    setDraft(data);
    saveToStorage(data);
  }, [saveToStorage]);

  // Update draft with auto-save
  const updateDraft = useCallback((data: Partial<T>) => {
    setDraft(prev => {
      const updated = { ...(prev || {}), ...data } as T;
      
      // Set unsaved changes flag
      setHasUnsavedChanges(true);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Schedule auto-save
      timeoutRef.current = setTimeout(() => {
        saveToStorage(updated);
      }, autoSaveDelay);
      
      return updated;
    });
  }, [autoSaveDelay, saveToStorage]);

  // Clear draft
  const clearDraft = useCallback(() => {
    setDraft(null);
    setHasUnsavedChanges(false);
    setLastSaved(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[useDraftSave] Failed to clear draft:', error);
    }
  }, [key]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    draft,
    saveDraft,
    updateDraft,
    clearDraft,
    hasUnsavedChanges,
    lastSaved,
  };
}

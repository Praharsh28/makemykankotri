/**
 * useTemplate Hook - React hook for template operations
 * Simplifies template CRUD in React components
 */

'use client';

import { useState, useEffect } from 'react';
import { Template } from '../types';
import { templateStorage } from './TemplateStorage';

export function useTemplate(templateId?: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load template on mount
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await templateStorage.load(id);
      setTemplate(loaded);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (templateData: Template) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await templateStorage.save(templateData);
      setTemplate(saved);
      return saved;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const published = await templateStorage.publish(id);
      setTemplate(published);
      return published;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await templateStorage.delete(id);
      setTemplate(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    template,
    loading,
    error,
    loadTemplate,
    saveTemplate,
    publishTemplate,
    deleteTemplate,
  };
}

export function useTemplates(options?: {
  published?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.published, options?.category, options?.limit, options?.offset]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Add timeout to prevent infinite loading
      // Resolve with empty array instead of rejecting to avoid console errors
      const timeoutPromise = new Promise<Template[]>((resolve) => 
        setTimeout(() => resolve([]), 5000)
      );
      
      const loaded = await Promise.race([
        templateStorage.list(options),
        timeoutPromise
      ]);
      setTemplates(loaded);
    } catch (err) {
      // Handle actual errors (not timeout)
      console.warn('Templates not available:', (err as Error).message);
      setError(err as Error);
      setTemplates([]); // Set empty array on error so page can render
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadTemplates();
  };

  return {
    templates,
    loading,
    error,
    refresh,
  };
}

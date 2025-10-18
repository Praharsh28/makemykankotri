/**
 * useDraftSave Hook Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDraftSave } from '@/plugins/form-builder/useDraftSave';
import { featureFlags } from '@/core/feature-flags';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useDraftSave Hook', () => {
  const draftKey = 'test-draft';

  beforeEach(() => {
    localStorage.clear();
    featureFlags.clear();
    featureFlags.enable('form-builder');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('returns null when no draft exists', () => {
      const { result } = renderHook(() => useDraftSave(draftKey));
      expect(result.current.draft).toBeNull();
    });

    it('loads existing draft from localStorage', () => {
      const existingDraft = { name: 'John Doe' };
      localStorage.setItem(draftKey, JSON.stringify(existingDraft));

      const { result } = renderHook(() => useDraftSave(draftKey));
      expect(result.current.draft).toEqual(existingDraft);
    });

    it('handles invalid JSON gracefully', () => {
      localStorage.setItem(draftKey, 'invalid-json');

      const { result } = renderHook(() => useDraftSave(draftKey));
      expect(result.current.draft).toBeNull();
    });
  });

  describe('Saving Drafts', () => {
    it('saves draft immediately', () => {
      const { result } = renderHook(() => useDraftSave(draftKey));

      act(() => {
        result.current.saveDraft({ name: 'Jane' });
      });

      expect(result.current.draft).toEqual({ name: 'Jane' });
      expect(localStorage.getItem(draftKey)).toBe(JSON.stringify({ name: 'Jane' }));
    });

    it('auto-saves after delay', () => {
      const { result } = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      act(() => {
        result.current.updateDraft({ name: 'John' });
      });

      // Draft updated immediately in state
      expect(result.current.draft).toEqual({ name: 'John' });

      // But not yet saved to localStorage
      expect(localStorage.getItem(draftKey)).toBeNull();

      // Fast-forward time
      act(() => {
        vi.runAllTimers();
      });

      // Should be saved now
      expect(localStorage.getItem(draftKey)).toBe(JSON.stringify({ name: 'John' }));
    });

    it('debounces rapid updates', () => {
      const { result } = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      // Rapid updates
      act(() => {
        result.current.updateDraft({ name: 'A' });
        vi.advanceTimersByTime(500);
        result.current.updateDraft({ name: 'B' });
        vi.advanceTimersByTime(500);
        result.current.updateDraft({ name: 'C' });
      });

      // Only the last update should be saved
      act(() => {
        vi.runAllTimers();
      });

      expect(localStorage.getItem(draftKey)).toBe(JSON.stringify({ name: 'C' }));
    });

    it('merges partial updates', () => {
      const { result } = renderHook(() => useDraftSave(draftKey));

      act(() => {
        result.current.saveDraft({ name: 'John', email: 'john@example.com' });
      });

      act(() => {
        result.current.updateDraft({ name: 'Jane' });
      });

      expect(result.current.draft).toEqual({
        name: 'Jane',
        email: 'john@example.com',
      });
    });
  });

  describe('Clearing Drafts', () => {
    it('clears draft from state and localStorage', () => {
      localStorage.setItem(draftKey, JSON.stringify({ name: 'John' }));
      const { result } = renderHook(() => useDraftSave(draftKey));

      expect(result.current.draft).toEqual({ name: 'John' });

      act(() => {
        result.current.clearDraft();
      });

      expect(result.current.draft).toBeNull();
      expect(localStorage.getItem(draftKey)).toBeNull();
    });
  });

  describe('Has Unsaved Changes', () => {
    it('tracks unsaved changes', () => {
      const { result } = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);

      act(() => {
        result.current.updateDraft({ name: 'John' });
      });

      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('resets after manual save', () => {
      const { result } = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      act(() => {
        result.current.updateDraft({ name: 'John' });
      });

      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        result.current.saveDraft({ name: 'John' });
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });
  });

  describe('Last Saved Time', () => {
    it('tracks last saved time', () => {
      const { result } = renderHook(() => useDraftSave(draftKey));

      expect(result.current.lastSaved).toBeNull();

      const beforeSave = Date.now();
      act(() => {
        result.current.saveDraft({ name: 'John' });
      });

      expect(result.current.lastSaved).toBeInstanceOf(Date);
      expect(result.current.lastSaved!.getTime()).toBeGreaterThanOrEqual(beforeSave);
    });

    it('updates last saved time on auto-save', () => {
      const { result} = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      act(() => {
        result.current.updateDraft({ name: 'John' });
      });

      expect(result.current.lastSaved).toBeNull();

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.lastSaved).toBeInstanceOf(Date);
    });
  });

  describe('Feature Flag', () => {
    it('does not save when feature flag disabled', () => {
      featureFlags.disable('form-builder');

      const { result } = renderHook(() => useDraftSave(draftKey));

      act(() => {
        result.current.saveDraft({ name: 'John' });
      });

      expect(localStorage.getItem(draftKey)).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('clears timeout on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useDraftSave(draftKey, { autoSaveDelay: 1000 })
      );

      act(() => {
        result.current.updateDraft({ name: 'John' });
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should not save after unmount
      expect(localStorage.getItem(draftKey)).toBeNull();
    });
  });
});

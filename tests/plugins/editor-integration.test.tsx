import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '@/plugins/visual-editor/hooks/useAutoSave';
import { Template } from '@/core/types';
import { templateStorage } from '@/core/template-system';

// Mock template storage
vi.mock('@/core/template-system', () => ({
  templateStorage: {
    save: vi.fn(),
    load: vi.fn(),
    publish: vi.fn(),
  },
}));

const mockTemplate: Template = {
  id: 'test-template-id',
  name: 'Test Template',
  slug: 'test-template',
  elements: [],
  editableFields: [],
  layout: {
    width: 800,
    height: 600,
    background: '#ffffff',
    orientation: 'portrait',
  },
  globalAnimations: [],
  thumbnail: '',
  category: 'test',
  tags: [],
  description: 'Test template',
  createdBy: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  published: false,
  views: 0,
  uses: 0,
};

describe('Editor Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (templateStorage.save as any).mockResolvedValue(mockTemplate);
  });

  describe('useAutoSave', () => {
    it('does not save when disabled', async () => {
      renderHook(() =>
        useAutoSave(mockTemplate, {
          enabled: false,
        })
      );

      await waitFor(() => {
        expect(templateStorage.save).not.toHaveBeenCalled();
      });
    });

    it('saves after delay', async () => {
      renderHook(() =>
        useAutoSave(mockTemplate, {
          enabled: true,
          delay: 100,
        })
      );

      await waitFor(
        () => {
          expect(templateStorage.save).toHaveBeenCalledWith(mockTemplate);
        },
        { timeout: 200 }
      );
    });

    it('calls onSave callback', async () => {
      const onSave = vi.fn();

      renderHook(() =>
        useAutoSave(mockTemplate, {
          enabled: true,
          delay: 100,
          onSave,
        })
      );

      await waitFor(
        () => {
          expect(onSave).toHaveBeenCalledWith(mockTemplate);
        },
        { timeout: 200 }
      );
    });

    it('calls onError on failure', async () => {
      const onError = vi.fn();
      const error = new Error('Save failed');
      (templateStorage.save as any).mockRejectedValue(error);

      renderHook(() =>
        useAutoSave(mockTemplate, {
          enabled: true,
          delay: 100,
          onError,
        })
      );

      await waitFor(
        () => {
          expect(onError).toHaveBeenCalledWith(error);
        },
        { timeout: 200 }
      );
    });

    it('provides manual saveNow function', async () => {
      const { result } = renderHook(() =>
        useAutoSave(mockTemplate, {
          enabled: false,
        })
      );

      await act(async () => {
        await result.current.saveNow();
      });

      expect(templateStorage.save).toHaveBeenCalledWith(mockTemplate);
    });

    it('debounces multiple changes', async () => {
      const { rerender } = renderHook(
        ({ template }) =>
          useAutoSave(template, {
            enabled: true,
            delay: 100,
          }),
        {
          initialProps: { template: mockTemplate },
        }
      );

      // Change template multiple times
      rerender({ template: { ...mockTemplate, name: 'Updated 1' } });
      rerender({ template: { ...mockTemplate, name: 'Updated 2' } });
      rerender({ template: { ...mockTemplate, name: 'Updated 3' } });

      await waitFor(
        () => {
          // Should only save once after debounce
          expect(templateStorage.save).toHaveBeenCalledTimes(1);
        },
        { timeout: 200 }
      );
    });
  });
});

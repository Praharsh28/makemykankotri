import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateStorage } from '@/core/template-system/TemplateStorage';
import { Template } from '@/core/types';

// Mock template data - must be defined before mock
const mockTemplateRow = {
  id: 'test-template-id',
  name: 'Test Template',
  slug: 'test-template',
  elements: [],
  editable_fields: [],
  layout: {
    width: 800,
    height: 600,
    background: '#ffffff',
    orientation: 'portrait',
  },
  global_animations: [],
  thumbnail: '',
  category: 'test',
  tags: [],
  description: 'Test template',
  created_by: 'user-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  published: false,
  views: 0,
  uses: 0,
};

// Mock Supabase client
const createChainableMock = () => {
  const chainable = {
    eq: vi.fn(() => chainable),
    limit: vi.fn(() => chainable),
    range: vi.fn(() => chainable),
    order: vi.fn(() => chainable),
    single: vi.fn(() => ({
      data: mockTemplateRow,
      error: null,
    })),
    select: vi.fn(() => chainable),
    data: [mockTemplateRow],
    error: null,
  };
  return chainable;
};

vi.mock('@/core/template-system/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: mockTemplateRow,
            error: null,
          })),
        })),
      })),
      select: vi.fn(() => createChainableMock()),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockTemplateRow,
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    })),
    rpc: vi.fn(() => ({
      error: null,
    })),
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

describe('Template Storage', () => {
  let storage: TemplateStorage;

  beforeEach(() => {
    storage = new TemplateStorage();
    vi.clearAllMocks();
  });

  describe('save', () => {
    it('saves a template', async () => {
      const result = await storage.save(mockTemplate);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-template-id');
      expect(result.name).toBe('Test Template');
    });

    it('maps database fields correctly', async () => {
      const result = await storage.save(mockTemplate);

      expect(result.editableFields).toEqual([]);
      expect(result.globalAnimations).toEqual([]);
      expect(result.layout).toEqual(mockTemplate.layout);
    });
  });

  describe('load', () => {
    it('loads a template by ID', async () => {
      const result = await storage.load('test-template-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-template-id');
      expect(result.name).toBe('Test Template');
    });

    it('maps dates correctly', async () => {
      const result = await storage.load('test-template-id');

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('loadBySlug', () => {
    it('loads a template by slug', async () => {
      const result = await storage.loadBySlug('test-template');

      expect(result).toBeDefined();
      expect(result.slug).toBe('test-template');
    });
  });

  describe('list', () => {
    it('lists templates', async () => {
      const result = await storage.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters by published status', async () => {
      const result = await storage.list({ published: true });

      expect(Array.isArray(result)).toBe(true);
    });

    it('filters by category', async () => {
      const result = await storage.list({ category: 'wedding' });

      expect(Array.isArray(result)).toBe(true);
    });

    it('applies pagination', async () => {
      const result = await storage.list({ limit: 10, offset: 0 });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('delete', () => {
    it('deletes a template', async () => {
      await expect(storage.delete('test-template-id')).resolves.not.toThrow();
    });
  });

  describe('publish', () => {
    it('publishes a template', async () => {
      const result = await storage.publish('test-template-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-template-id');
    });
  });

  describe('unpublish', () => {
    it('unpublishes a template', async () => {
      const result = await storage.unpublish('test-template-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-template-id');
    });
  });

  describe('incrementViews', () => {
    it('increments template views', async () => {
      await expect(storage.incrementViews('test-template-id')).resolves.not.toThrow();
    });
  });

  describe('incrementUses', () => {
    it('increments template uses', async () => {
      await expect(storage.incrementUses('test-template-id')).resolves.not.toThrow();
    });
  });
});

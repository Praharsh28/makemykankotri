/**
 * URL Generator Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateSlug, generateInvitationUrl, saveInvitation } from '@/plugins/template-renderer/urlGenerator';
import { featureFlags } from '@/core/feature-flags';

describe('URL Generator', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('template-renderer');
  });

  describe('generateSlug', () => {
    it('generates slug from template name', () => {
      const slug = generateSlug('Wedding Invitation');
      expect(slug).toMatch(/^wedding-invitation-[a-z0-9]{8}$/);
    });

    it('handles special characters', () => {
      const slug = generateSlug('Alice & Bob\'s Wedding!');
      expect(slug).toMatch(/^alice-bobs-wedding-[a-z0-9]{8}$/);
    });

    it('converts to lowercase', () => {
      const slug = generateSlug('UPPERCASE TEMPLATE');
      expect(slug).toMatch(/^uppercase-template-[a-z0-9]{8}$/);
    });

    it('removes consecutive dashes', () => {
      const slug = generateSlug('Multiple   Spaces');
      expect(slug).toMatch(/^multiple-spaces-[a-z0-9]{8}$/);
    });

    it('generates unique slugs for same name', () => {
      const slug1 = generateSlug('Same Name');
      const slug2 = generateSlug('Same Name');
      expect(slug1).not.toBe(slug2);
    });

    it('limits slug length', () => {
      const longName = 'A'.repeat(100);
      const slug = generateSlug(longName);
      expect(slug.length).toBeLessThan(70);
    });
  });

  describe('generateInvitationUrl', () => {
    it('generates full URL with slug', () => {
      const url = generateInvitationUrl('test-slug-abc123');
      expect(url).toContain('/preview/test-slug-abc123');
    });

    it('uses base URL when provided', () => {
      const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';

      const url = generateInvitationUrl('test-slug');
      expect(url).toBe('https://example.com/preview/test-slug');

      if (originalBaseUrl) {
        process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.NEXT_PUBLIC_BASE_URL;
      }
    });

    it('uses localhost as fallback', () => {
      const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      delete process.env.NEXT_PUBLIC_BASE_URL;

      const url = generateInvitationUrl('test-slug');
      expect(url).toContain('localhost');

      if (originalBaseUrl) {
        process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
      }
    });
  });

  describe('saveInvitation', () => {
    it('returns slug and URL on success', async () => {
      const mockTemplate = { id: 'test-template', name: 'Test' };
      const mockData = { name: 'John' };

      const result = await saveInvitation(mockTemplate as any, mockData);

      expect(result.success).toBe(true);
      expect(result.slug).toBeDefined();
      expect(result.url).toBeDefined();
      expect(result.url).toContain(result.slug);
    });

    it('validates template before saving', async () => {
      const invalidTemplate = null;
      const mockData = {};

      const result = await saveInvitation(invalidTemplate as any, mockData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('validates data before saving', async () => {
      const mockTemplate = { id: 'test', name: 'Test' };
      const invalidData = null;

      const result = await saveInvitation(mockTemplate as any, invalidData as any);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('includes timestamp in result', async () => {
      const mockTemplate = { id: 'test', name: 'Test' };
      const mockData = { name: 'John' };

      const beforeSave = Date.now();
      const result = await saveInvitation(mockTemplate as any, mockData);
      const afterSave = Date.now();

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeSave);
      expect(result.timestamp).toBeLessThanOrEqual(afterSave);
    });
  });
});

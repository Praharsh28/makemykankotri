/**
 * Data Injector Smoke Tests
 * Verify placeholder injection works correctly
 */

import { describe, it, expect } from 'vitest';
import {
  injectData,
  getNestedValue,
  hasPlaceholders,
  extractPlaceholderKeys,
} from '../dataInjector';

describe('DataInjector', () => {
  describe('injectData', () => {
    it('should replace simple placeholders', () => {
      const result = injectData('Hello {{name}}', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should replace nested placeholders', () => {
      const result = injectData('Hello {{user.name}}', { user: { name: 'John' } });
      expect(result).toBe('Hello John');
    });

    it('should replace multiple placeholders', () => {
      const result = injectData('{{greeting}} {{user.name}}!', {
        greeting: 'Hello',
        user: { name: 'John' },
      });
      expect(result).toBe('Hello John!');
    });

    it('should keep placeholder if key not found', () => {
      const result = injectData('Hello {{missing}}', { name: 'John' });
      expect(result).toBe('Hello {{missing}}');
    });

    it('should return non-string content as-is', () => {
      expect(injectData(123, { name: 'John' })).toBe(123);
      expect(injectData(null, { name: 'John' })).toBe(null);
      expect(injectData({ foo: 'bar' }, { name: 'John' })).toEqual({ foo: 'bar' });
    });
  });

  describe('getNestedValue', () => {
    it('should get top-level value', () => {
      expect(getNestedValue({ name: 'John' }, 'name')).toBe('John');
    });

    it('should get nested value', () => {
      expect(getNestedValue({ user: { name: 'John' } }, 'user.name')).toBe('John');
    });

    it('should get deeply nested value', () => {
      const data = { user: { profile: { name: 'John' } } };
      expect(getNestedValue(data, 'user.profile.name')).toBe('John');
    });

    it('should return undefined for missing keys', () => {
      expect(getNestedValue({ name: 'John' }, 'age')).toBeUndefined();
      expect(getNestedValue({ user: {} }, 'user.name')).toBeUndefined();
    });
  });

  describe('hasPlaceholders', () => {
    it('should return true for content with placeholders', () => {
      expect(hasPlaceholders('Hello {{name}}')).toBe(true);
      expect(hasPlaceholders('{{greeting}} {{name}}')).toBe(true);
    });

    it('should return false for content without placeholders', () => {
      expect(hasPlaceholders('Hello world')).toBe(false);
      expect(hasPlaceholders('')).toBe(false);
    });

    it('should return false for non-string content', () => {
      expect(hasPlaceholders(123)).toBe(false);
      expect(hasPlaceholders(null)).toBe(false);
    });
  });

  describe('extractPlaceholderKeys', () => {
    it('should extract single key', () => {
      expect(extractPlaceholderKeys('Hello {{name}}')).toEqual(['name']);
    });

    it('should extract multiple keys', () => {
      const keys = extractPlaceholderKeys('{{greeting}} {{user.name}}');
      expect(keys).toEqual(['greeting', 'user.name']);
    });

    it('should handle no placeholders', () => {
      expect(extractPlaceholderKeys('Hello world')).toEqual([]);
    });

    it('should trim whitespace in keys', () => {
      const keys = extractPlaceholderKeys('{{ name }} {{ user.age }}');
      expect(keys).toEqual(['name', 'user.age']);
    });
  });
});

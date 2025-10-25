/**
 * Feature Flags Smoke Tests
 * Verify basic functionality of feature flag system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { featureFlags } from '../feature-flags';

describe('FeatureFlags', () => {
  // Store original localStorage
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    // Reset to defaults before each test
    featureFlags.resetToDefaults();
    
    // Mock localStorage
    const localStorageMock: Storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };
    
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('should have default flags', () => {
    // These are enabled by default per initializeDefaults()
    expect(featureFlags.isEnabled('template-renderer')).toBe(true);
    expect(featureFlags.isEnabled('visual-editor')).toBe(true);
    expect(featureFlags.isEnabled('form-builder')).toBe(true);
    
    // These are disabled by default
    expect(featureFlags.isEnabled('gallery')).toBe(false);
    expect(featureFlags.isEnabled('animation-engine')).toBe(false);
  });

  it('should enable a flag', () => {
    featureFlags.enable('gallery');
    expect(featureFlags.isEnabled('gallery')).toBe(true);
  });

  it('should disable a flag', () => {
    featureFlags.enable('visual-editor');
    expect(featureFlags.isEnabled('visual-editor')).toBe(true);
    
    featureFlags.disable('visual-editor');
    expect(featureFlags.isEnabled('visual-editor')).toBe(false);
  });

  it('should toggle a flag', () => {
    const initialState = featureFlags.isEnabled('ai-generator');
    featureFlags.toggle('ai-generator');
    expect(featureFlags.isEnabled('ai-generator')).toBe(!initialState);
    
    featureFlags.toggle('ai-generator');
    expect(featureFlags.isEnabled('ai-generator')).toBe(initialState);
  });

  it('should get all flags', () => {
    const flags = featureFlags.getAll();
    expect(flags).toHaveProperty('template-renderer');
    expect(flags).toHaveProperty('visual-editor');
    expect(flags).toHaveProperty('form-builder');
  });

  it('should reset to defaults', () => {
    featureFlags.enable('gallery');
    featureFlags.enable('animation-engine');
    
    featureFlags.resetToDefaults();
    
    // After reset, these should be back to disabled (default)
    expect(featureFlags.isEnabled('gallery')).toBe(false);
    expect(featureFlags.isEnabled('animation-engine')).toBe(false);
  });

  it('should return false for unknown flags', () => {
    expect(featureFlags.isEnabled('non-existent-flag')).toBe(false);
  });

  it('should handle multiple enable/disable calls gracefully', () => {
    featureFlags.enable('gallery');
    featureFlags.enable('gallery');
    expect(featureFlags.isEnabled('gallery')).toBe(true);
    
    featureFlags.disable('gallery');
    featureFlags.disable('gallery');
    expect(featureFlags.isEnabled('gallery')).toBe(false);
  });
});

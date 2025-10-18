import { describe, it, expect, beforeEach } from 'vitest';
import { featureFlags, FEATURE_FLAGS } from '@/core/feature-flags';

describe('Feature Flags', () => {
  beforeEach(() => {
    featureFlags.clear();
  });

  it('enables features', () => {
    featureFlags.enable('test-feature');
    expect(featureFlags.isEnabled('test-feature')).toBe(true);
  });

  it('disables features', () => {
    featureFlags.enable('test-feature');
    featureFlags.disable('test-feature');
    expect(featureFlags.isEnabled('test-feature')).toBe(false);
  });

  it('toggles features', () => {
    expect(featureFlags.isEnabled('test-feature')).toBe(false);
    
    featureFlags.toggle('test-feature');
    expect(featureFlags.isEnabled('test-feature')).toBe(true);
    
    featureFlags.toggle('test-feature');
    expect(featureFlags.isEnabled('test-feature')).toBe(false);
  });

  it('returns false for unknown features', () => {
    expect(featureFlags.isEnabled('unknown-feature')).toBe(false);
  });

  it('gets all feature flags', () => {
    featureFlags.enable('feature1');
    featureFlags.enable('feature2');
    
    const allFlags = featureFlags.getAll();
    expect(allFlags.feature1).toBe(true);
    expect(allFlags.feature2).toBe(true);
  });

  it('sets multiple flags', () => {
    featureFlags.setFlags({
      feature1: true,
      feature2: false,
      feature3: true,
    });
    
    expect(featureFlags.isEnabled('feature1')).toBe(true);
    expect(featureFlags.isEnabled('feature2')).toBe(false);
    expect(featureFlags.isEnabled('feature3')).toBe(true);
  });

  it('provides feature flag constants', () => {
    expect(FEATURE_FLAGS.CORE).toBe('core');
    expect(FEATURE_FLAGS.VISUAL_EDITOR).toBe('visual-editor');
    expect(FEATURE_FLAGS.TEMPLATE_STORAGE).toBe('template-storage');
  });

  it('clears all flags', () => {
    featureFlags.enable('feature1');
    featureFlags.enable('feature2');
    
    featureFlags.clear();
    
    const allFlags = featureFlags.getAll();
    expect(Object.keys(allFlags)).toHaveLength(0);
  });
});

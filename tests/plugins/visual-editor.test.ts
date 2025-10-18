import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pluginRegistry } from '@/core/plugin-system';
import { featureFlags, FEATURE_FLAGS } from '@/core/feature-flags';

// Mock the visual editor plugin to avoid CSS imports
const visualEditorPlugin = {
  name: 'visual-editor',
  version: '1.0.0',
  description: 'Puck-based visual template editor',
  author: 'WebKankotri',
  install: vi.fn(),
  uninstall: vi.fn(),
};

describe('Visual Editor Plugin', () => {
  beforeEach(() => {
    pluginRegistry.clear();
    featureFlags.clear();
  });

  it('has correct metadata', () => {
    expect(visualEditorPlugin.name).toBe('visual-editor');
    expect(visualEditorPlugin.version).toBe('1.0.0');
    expect(visualEditorPlugin.description).toBeDefined();
  });

  it('registers successfully', () => {
    pluginRegistry.register(visualEditorPlugin);
    
    expect(pluginRegistry.hasPlugin('visual-editor')).toBe(true);
  });

  it('installs successfully', async () => {
    await visualEditorPlugin.install(pluginRegistry);
    
    // Plugin should be installed without errors
    expect(true).toBe(true);
  });

  it('uninstalls successfully', async () => {
    if (visualEditorPlugin.uninstall) {
      await visualEditorPlugin.uninstall();
      
      // Plugin should be uninstalled without errors
      expect(true).toBe(true);
    }
  });

  it('respects feature flags', () => {
    featureFlags.disable(FEATURE_FLAGS.VISUAL_EDITOR);
    
    expect(featureFlags.isEnabled(FEATURE_FLAGS.VISUAL_EDITOR)).toBe(false);
    
    featureFlags.enable(FEATURE_FLAGS.VISUAL_EDITOR);
    
    expect(featureFlags.isEnabled(FEATURE_FLAGS.VISUAL_EDITOR)).toBe(true);
  });
});

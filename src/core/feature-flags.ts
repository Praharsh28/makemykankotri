/**
 * Feature Flags System
 * Enables/disables plugins and features instantly
 */

import { FeatureFlags } from './types';
import { eventBus } from './event-bus';

class FeatureFlagsImpl implements FeatureFlags {
  private flags: Map<string, boolean>;
  private readonly STORAGE_KEY = 'webkankotri-feature-flags';

  constructor() {
    this.flags = new Map();
    this.loadFromStorage();
    this.initializeDefaults();
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureName: string): boolean {
    return this.flags.get(featureName) ?? false;
  }

  /**
   * Enable a feature
   */
  enable(featureName: string): void {
    const wasEnabled = this.flags.get(featureName);
    this.flags.set(featureName, true);
    this.saveToStorage();
    
    if (!wasEnabled) {
      eventBus.emit('feature:enabled', { featureName });
      console.log(`✓ Feature "${featureName}" enabled`);
    }
  }

  /**
   * Disable a feature
   */
  disable(featureName: string): void {
    const wasEnabled = this.flags.get(featureName);
    this.flags.set(featureName, false);
    this.saveToStorage();
    
    if (wasEnabled) {
      eventBus.emit('feature:disabled', { featureName });
      console.log(`✗ Feature "${featureName}" disabled`);
    }
  }

  /**
   * Toggle a feature
   */
  toggle(featureName: string): void {
    if (this.isEnabled(featureName)) {
      this.disable(featureName);
    } else {
      this.enable(featureName);
    }
  }

  /**
   * Get all feature flags
   */
  getAll(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    this.flags.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Set multiple flags at once
   */
  setFlags(flags: Record<string, boolean>): void {
    Object.entries(flags).forEach(([name, enabled]) => {
      if (enabled) {
        this.enable(name);
      } else {
        this.disable(name);
      }
    });
  }

  /**
   * Reset all flags to defaults
   */
  resetToDefaults(): void {
    this.flags.clear();
    this.initializeDefaults();
    this.saveToStorage();
    eventBus.emit('feature:reset');
    console.log('✓ Feature flags reset to defaults');
  }

  /**
   * Initialize default feature flags
   */
  private initializeDefaults(): void {
    // Core features (always enabled)
    this.setDefaultFlag('core', true);
    this.setDefaultFlag('event-bus', true);
    this.setDefaultFlag('plugin-system', true);
    
    // Plugins (enabled by default)
    this.setDefaultFlag('visual-editor', true);
    this.setDefaultFlag('template-storage', true);
    this.setDefaultFlag('template-renderer', true);
    this.setDefaultFlag('form-builder', true);
    
    // Optional plugins (disabled by default)
    this.setDefaultFlag('ai-generator', false);
    this.setDefaultFlag('animation-engine', false);
    this.setDefaultFlag('gallery', false);
    this.setDefaultFlag('export', false);
    this.setDefaultFlag('user-management', false);
    
    // Development features
    this.setDefaultFlag('dev-tools', process.env.NODE_ENV === 'development');
    this.setDefaultFlag('debug-mode', false);
  }

  /**
   * Set a default flag only if not already set
   */
  private setDefaultFlag(name: string, value: boolean): void {
    if (!this.flags.has(name)) {
      this.flags.set(name, value);
    }
  }

  /**
   * Load flags from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([name, enabled]) => {
          this.flags.set(name, enabled as boolean);
        });
      }
    } catch (error) {
      console.error('Failed to load feature flags from storage:', error);
    }
  }

  /**
   * Save flags to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = this.getAll();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save feature flags to storage:', error);
    }
  }

  /**
   * Clear all flags (useful for testing)
   */
  clear(): void {
    this.flags.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagsImpl();

// Feature flag names constants
export const FEATURE_FLAGS = {
  // Core
  CORE: 'core',
  EVENT_BUS: 'event-bus',
  PLUGIN_SYSTEM: 'plugin-system',
  
  // Plugins
  VISUAL_EDITOR: 'visual-editor',
  TEMPLATE_STORAGE: 'template-storage',
  TEMPLATE_RENDERER: 'template-renderer',
  FORM_BUILDER: 'form-builder',
  AI_GENERATOR: 'ai-generator',
  ANIMATION_ENGINE: 'animation-engine',
  GALLERY: 'gallery',
  EXPORT: 'export',
  USER_MANAGEMENT: 'user-management',
  
  // Development
  DEV_TOOLS: 'dev-tools',
  DEBUG_MODE: 'debug-mode',
} as const;

/**
 * React hook for feature flags (to be implemented)
 */
export function useFeatureFlag(featureName: string): boolean {
  return featureFlags.isEnabled(featureName);
}

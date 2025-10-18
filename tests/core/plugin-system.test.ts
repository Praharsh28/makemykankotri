import { describe, it, expect, beforeEach } from 'vitest';
import { pluginRegistry, createPlugin } from '@/core/plugin-system';
import { Plugin } from '@/core/types';

describe('Plugin System', () => {
  beforeEach(() => {
    pluginRegistry.clear();
  });

  it('registers a plugin', () => {
    const testPlugin = createPlugin(
      'test-plugin',
      '1.0.0',
      () => {
        // Install logic
      }
    );

    pluginRegistry.register(testPlugin);
    
    expect(pluginRegistry.hasPlugin('test-plugin')).toBe(true);
    expect(pluginRegistry.getPlugin('test-plugin')).toBe(testPlugin);
  });

  it('prevents duplicate plugin registration', () => {
    const testPlugin = createPlugin(
      'test-plugin',
      '1.0.0',
      () => {
        // Install logic
      }
    );

    pluginRegistry.register(testPlugin);
    
    expect(() => {
      pluginRegistry.register(testPlugin);
    }).toThrow('already registered');
  });

  it('unregisters a plugin', () => {
    const testPlugin = createPlugin(
      'test-plugin',
      '1.0.0',
      () => {
        // Install logic
      }
    );

    pluginRegistry.register(testPlugin);
    expect(pluginRegistry.hasPlugin('test-plugin')).toBe(true);
    
    pluginRegistry.unregister('test-plugin');
    expect(pluginRegistry.hasPlugin('test-plugin')).toBe(false);
  });

  it('handles plugin dependencies', () => {
    const basePlugin = createPlugin(
      'base-plugin',
      '1.0.0',
      () => {
        // Install logic
      }
    );

    const dependentPlugin = createPlugin(
      'dependent-plugin',
      '1.0.0',
      () => {
        // Install logic
      },
      {
        dependencies: ['base-plugin'],
      }
    );

    // Should fail without base plugin
    expect(() => {
      pluginRegistry.register(dependentPlugin);
    }).toThrow('depends on');

    // Should succeed with base plugin
    pluginRegistry.register(basePlugin);
    expect(() => {
      pluginRegistry.register(dependentPlugin);
    }).not.toThrow();
  });

  it('prevents unregistering plugins with dependents', () => {
    const basePlugin = createPlugin(
      'base-plugin',
      '1.0.0',
      () => {
        // Install logic
      }
    );

    const dependentPlugin = createPlugin(
      'dependent-plugin',
      '1.0.0',
      () => {
        // Install logic
      },
      {
        dependencies: ['base-plugin'],
      }
    );

    pluginRegistry.register(basePlugin);
    pluginRegistry.register(dependentPlugin);

    // Should fail to unregister base plugin
    expect(() => {
      pluginRegistry.unregister('base-plugin');
    }).toThrow('depends on it');
  });

  it('gets all registered plugins', () => {
    const plugin1 = createPlugin('plugin-1', '1.0.0', () => {});
    const plugin2 = createPlugin('plugin-2', '1.0.0', () => {});

    pluginRegistry.register(plugin1);
    pluginRegistry.register(plugin2);

    const allPlugins = pluginRegistry.getAllPlugins();
    expect(allPlugins).toHaveLength(2);
    expect(allPlugins).toContain(plugin1);
    expect(allPlugins).toContain(plugin2);
  });

  it('validates plugin structure', () => {
    const invalidPlugin = {
      name: 'invalid',
      // Missing version and install
    } as Plugin;

    expect(() => {
      pluginRegistry.register(invalidPlugin);
    }).toThrow();
  });

  it('calls plugin install function', () => {
    let installCalled = false;

    const testPlugin = createPlugin(
      'test-plugin',
      '1.0.0',
      () => {
        installCalled = true;
      }
    );

    pluginRegistry.register(testPlugin);
    expect(installCalled).toBe(true);
  });

  it('calls plugin uninstall function', () => {
    let uninstallCalled = false;

    const testPlugin = createPlugin(
      'test-plugin',
      '1.0.0',
      () => {
        // Install logic
      },
      {
        uninstall: () => {
          uninstallCalled = true;
        },
      }
    );

    pluginRegistry.register(testPlugin);
    pluginRegistry.unregister('test-plugin');
    
    expect(uninstallCalled).toBe(true);
  });
});

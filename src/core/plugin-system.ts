/**
 * Plugin System - Plugin Registry and Management
 * Enables modular, isolated plugin architecture
 */

import { Plugin, PluginRegistry } from './types';
import { eventBus } from './event-bus';

class PluginRegistryImpl implements PluginRegistry {
  private plugins: Map<string, Plugin>;
  private installedPlugins: Set<string>;

  constructor() {
    this.plugins = new Map();
    this.installedPlugins = new Set();
  }

  /**
   * Register and install a plugin
   */
  register(plugin: Plugin): void {
    // Check if plugin already registered
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }

    // Validate plugin
    this.validatePlugin(plugin);

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.installedPlugins.has(dep)) {
          throw new Error(
            `Plugin "${plugin.name}" depends on "${dep}" which is not installed`
          );
        }
      }
    }

    // Register plugin
    this.plugins.set(plugin.name, plugin);

    // Install plugin
    try {
      const result = plugin.install(this);
      if (result instanceof Promise) {
        result
          .then(() => {
            this.installedPlugins.add(plugin.name);
            eventBus.emit('plugin:installed', { pluginName: plugin.name });
            console.log(`✓ Plugin "${plugin.name}" v${plugin.version} installed`);
          })
          .catch((error) => {
            this.plugins.delete(plugin.name);
            console.error(`✗ Plugin "${plugin.name}" installation failed:`, error);
            throw error;
          });
      } else {
        this.installedPlugins.add(plugin.name);
        eventBus.emit('plugin:installed', { pluginName: plugin.name });
        console.log(`✓ Plugin "${plugin.name}" v${plugin.version} installed`);
      }
    } catch (error) {
      this.plugins.delete(plugin.name);
      console.error(`✗ Plugin "${plugin.name}" installation failed:`, error);
      throw error;
    }
  }

  /**
   * Unregister and uninstall a plugin
   */
  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" is not registered`);
    }

    // Check if other plugins depend on this
    for (const [name, p] of this.plugins.entries()) {
      if (p.dependencies?.includes(pluginName)) {
        throw new Error(
          `Cannot unregister "${pluginName}" because "${name}" depends on it`
        );
      }
    }

    // Uninstall plugin
    try {
      if (plugin.uninstall) {
        const result = plugin.uninstall();
        if (result instanceof Promise) {
          result
            .then(() => {
              this.plugins.delete(pluginName);
              this.installedPlugins.delete(pluginName);
              eventBus.emit('plugin:uninstalled', { pluginName });
              console.log(`✓ Plugin "${pluginName}" uninstalled`);
            })
            .catch((error) => {
              console.error(`✗ Plugin "${pluginName}" uninstallation failed:`, error);
              throw error;
            });
        } else {
          this.plugins.delete(pluginName);
          this.installedPlugins.delete(pluginName);
          eventBus.emit('plugin:uninstalled', { pluginName });
          console.log(`✓ Plugin "${pluginName}" uninstalled`);
        }
      } else {
        this.plugins.delete(pluginName);
        this.installedPlugins.delete(pluginName);
        eventBus.emit('plugin:uninstalled', { pluginName });
        console.log(`✓ Plugin "${pluginName}" uninstalled`);
      }
    } catch (error) {
      console.error(`✗ Plugin "${pluginName}" uninstallation failed:`, error);
      throw error;
    }
  }

  /**
   * Get a registered plugin
   */
  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Check if a plugin is registered
   */
  hasPlugin(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }

  /**
   * Check if a plugin is installed
   */
  isInstalled(pluginName: string): boolean {
    return this.installedPlugins.has(pluginName);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all installed plugin names
   */
  getInstalledPlugins(): string[] {
    return Array.from(this.installedPlugins);
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: Plugin): void {
    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new Error('Plugin must have a valid name');
    }

    if (!plugin.version || typeof plugin.version !== 'string') {
      throw new Error(`Plugin "${plugin.name}" must have a valid version`);
    }

    if (typeof plugin.install !== 'function') {
      throw new Error(`Plugin "${plugin.name}" must have an install function`);
    }

    if (plugin.dependencies && !Array.isArray(plugin.dependencies)) {
      throw new Error(`Plugin "${plugin.name}" dependencies must be an array`);
    }
  }

  /**
   * Clear all plugins (useful for testing)
   */
  clear(): void {
    this.plugins.clear();
    this.installedPlugins.clear();
  }
}

// Singleton instance
export const pluginRegistry = new PluginRegistryImpl();

/**
 * Helper to create a plugin
 */
export function createPlugin(
  name: string,
  version: string,
  install: (registry: PluginRegistry) => void | Promise<void>,
  options?: {
    dependencies?: string[];
    uninstall?: () => void | Promise<void>;
    description?: string;
    author?: string;
  }
): Plugin {
  return {
    name,
    version,
    install,
    ...options,
  };
}

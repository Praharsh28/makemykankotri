/**
 * Data Injection Utilities
 * Replace placeholders in content with actual data
 */

/**
 * Inject data into content placeholders
 * Supports {{key}} syntax and nested object access via dot notation
 * 
 * @example
 * injectData("Hello {{user.name}}", { user: { name: "John" } })
 * // Returns: "Hello John"
 */
export function injectData(content: unknown, data: Record<string, unknown>): unknown {
  if (typeof content !== 'string') {
    return content;
  }

  let result = content;

  // Replace {{key}} placeholders
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  result = result.replace(placeholderRegex, (match, key) => {
    const value = getNestedValue(data, key.trim());
    return value !== undefined ? String(value) : match;
  });

  return result;
}

/**
 * Get nested object value by dot notation key
 * 
 * @example
 * getNestedValue({ user: { name: "John" } }, "user.name")
 * // Returns: "John"
 */
export function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = obj;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Check if content has placeholders
 */
export function hasPlaceholders(content: unknown): boolean {
  if (typeof content !== 'string') {
    return false;
  }
  return /\{\{([^}]+)\}\}/g.test(content);
}

/**
 * Extract all placeholder keys from content
 * 
 * @example
 * extractPlaceholderKeys("Hello {{user.name}}, your age is {{user.age}}")
 * // Returns: ["user.name", "user.age"]
 */
export function extractPlaceholderKeys(content: unknown): string[] {
  if (typeof content !== 'string') {
    return [];
  }

  const keys: string[] = [];
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  let match;

  while ((match = placeholderRegex.exec(content)) !== null) {
    keys.push(match[1].trim());
  }

  return keys;
}

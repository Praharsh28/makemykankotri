/**
 * Form Preview Component
 * Real-time preview of form data
 */

import React from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface FormPreviewProps {
  data: Record<string, unknown>;
  title?: string;
}

export function FormPreview({ data, title = 'Preview' }: FormPreviewProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('form-builder')) {
    return null;
  }

  // Filter out empty/null/undefined values
  const validEntries = Object.entries(data).filter(([_, value]) => {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    return true;
  });

  // Empty state
  if (validEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
          {title}
        </h3>
        <p className="text-neutral-500 text-center py-8">
          No data to preview yet. Fill out the form to see a preview.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
        {title}
      </h3>
      
      <div className="space-y-3">
        {validEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-start py-2 border-b border-neutral-100 last:border-0"
          >
            <span className="font-medium text-neutral-700 text-sm capitalize">
              {key}
            </span>
            <span className="text-neutral-900 text-sm text-right max-w-xs break-words">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Format value for display
 */
function formatValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    // Check if it's a date string
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return String(value);
}

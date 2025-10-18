/**
 * PluginErrorBoundary
 * Error boundary for individual plugins
 */

'use client';

import { ErrorBoundary } from './ErrorBoundary';

interface PluginErrorBoundaryProps {
  children: React.ReactNode;
  pluginName: string;
}

export function PluginErrorBoundary({ 
  children, 
  pluginName 
}: PluginErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-neutral-600">
            The &quot;{pluginName}&quot; plugin encountered an error.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

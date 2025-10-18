/**
 * ExportImageButton Component
 * Button to export template as PNG/JPEG
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState } from 'react';
import { exportToPNG, exportToJPEG, ImageExportOptions } from '@/lib/export/image-export';

export interface ExportImageButtonProps {
  elementId: string;
  filename?: string;
  format?: 'png' | 'jpeg';
  options?: ImageExportOptions;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'base' | 'lg';
  children?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ExportImageButton({
  elementId,
  filename,
  format = 'png',
  options = {},
  variant = 'primary',
  size = 'base',
  children,
  onSuccess,
  onError,
}: ExportImageButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFilename = format === 'png' ? 'kankotri.png' : 'kankotri.jpg';

  async function handleExport() {
    setExporting(true);
    setError(null);

    try {
      const exportOptions = {
        ...options,
        filename: filename || defaultFilename,
        format,
      };

      if (format === 'png') {
        await exportToPNG(elementId, exportOptions);
      } else {
        await exportToJPEG(elementId, exportOptions);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export image';
      setError(errorMessage);
      console.error('[ExportImageButton] Error:', err);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setExporting(false);
    }
  }

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const formatLabel = format.toUpperCase();

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        disabled={exporting}
        aria-label={exporting ? `Exporting ${formatLabel}` : `Export to ${formatLabel}`}
        className={`
          rounded-lg font-medium
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          focus-visible:ring-2 focus-visible:ring-primary-500
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
        `}
      >
        {exporting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {children || `Export ${formatLabel}`}
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}

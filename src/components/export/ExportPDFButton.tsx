/**
 * ExportPDFButton Component
 * Button to export template as PDF
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState } from 'react';
import { exportToPDF, exportToA4PDF, PDFExportOptions } from '@/lib/export/pdf-export';

export interface ExportPDFButtonProps {
  elementId: string;
  filename?: string;
  options?: PDFExportOptions;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'base' | 'lg';
  children?: React.ReactNode;
  useA4?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ExportPDFButton({
  elementId,
  filename = 'kankotri.pdf',
  options = {},
  variant = 'primary',
  size = 'base',
  children,
  useA4 = false,
  onSuccess,
  onError,
}: ExportPDFButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);

    try {
      if (useA4) {
        await exportToA4PDF(elementId, filename);
      } else {
        await exportToPDF(elementId, { ...options, filename });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(errorMessage);
      console.error('[ExportPDFButton] Error:', err);

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

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        disabled={exporting}
        aria-label={exporting ? 'Exporting PDF' : 'Export to PDF'}
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {children || 'Export PDF'}
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

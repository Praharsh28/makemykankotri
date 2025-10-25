/**
 * File Upload Component
 * Drag & drop file upload with preview
 */

import React, { useState, useRef } from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface FileUploadProps {
  name: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}

export function FileUpload({
  name,
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  required,
  disabled,
  error: externalError,
  onChange,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check feature flag
  if (!featureFlags.isEnabled('form-builder')) {
    return null;
  }

  const validateFile = (selectedFile: File): boolean => {
    // Check file size
    if (selectedFile.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`);
      return false;
    }

    // Check file type
    if (accept && !matchesAccept(selectedFile.type, accept)) {
      setError('Invalid file type. Please select a valid file.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    onChange(selectedFile);

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayError = externalError || error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging ? 'border-primary-500 bg-primary-50' : 
              displayError ? 'border-red-500 bg-red-50' : 
              'border-neutral-300 hover:border-neutral-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            disabled={disabled}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Choose file"
          />

          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="mt-2 text-sm text-neutral-600">
            <span className="font-medium text-primary-500">Click to upload</span>
            {' or drag and drop'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {accept === 'image/*' ? 'Images only' : accept}
            {' · '}Max {formatFileSize(maxSize)}
          </p>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
          <div className="flex items-start gap-4">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-sm text-red-500">{displayError}</p>
      )}
    </div>
  );
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if file type matches accept pattern
 */
function matchesAccept(fileType: string, accept: string): boolean {
  const acceptPatterns = accept.split(',').map(p => p.trim());
  
  return acceptPatterns.some(pattern => {
    if (pattern === fileType) return true;
    if (pattern.endsWith('/*')) {
      const baseType = pattern.slice(0, -2);
      return fileType.startsWith(baseType);
    }
    return false;
  });
}

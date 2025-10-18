/**
 * Image Export Utilities
 * Convert templates to PNG/JPEG and generate thumbnails
 */

import html2canvas from 'html2canvas';

export interface ImageExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg';
}

/**
 * Export element to PNG image
 */
export async function exportToPNG(
  elementId: string,
  options: ImageExportOptions = {}
): Promise<void> {
  const {
    filename = 'kankotri.png',
    quality = 1.0,
    scale = 2,
    backgroundColor = '#ffffff',
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
    });

    // Convert to PNG blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      },
      'image/png',
      quality
    );
  } catch (error) {
    console.error('[PNG Export] Error:', error);
    throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export element to JPEG image
 */
export async function exportToJPEG(
  elementId: string,
  options: ImageExportOptions = {}
): Promise<void> {
  const {
    filename = 'kankotri.jpg',
    quality = 0.92,
    scale = 2,
    backgroundColor = '#ffffff',
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
    });

    // Convert to JPEG blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      quality
    );
  } catch (error) {
    console.error('[JPEG Export] Error:', error);
    throw new Error(`Failed to export JPEG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate thumbnail from element
 */
export async function generateThumbnail(
  elementId: string,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    width = 400,
    height = 600,
    maintainAspectRatio = true,
    quality = 0.8,
    format = 'jpeg',
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Convert to canvas at original size
    const sourceCanvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Create thumbnail canvas
    const thumbCanvas = document.createElement('canvas');
    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Calculate dimensions
    let thumbWidth = width;
    let thumbHeight = height;

    if (maintainAspectRatio) {
      const aspectRatio = sourceCanvas.width / sourceCanvas.height;
      if (width / height > aspectRatio) {
        thumbWidth = height * aspectRatio;
      } else {
        thumbHeight = width / aspectRatio;
      }
    }

    thumbCanvas.width = thumbWidth;
    thumbCanvas.height = thumbHeight;

    // Draw resized image
    ctx.drawImage(sourceCanvas, 0, 0, thumbWidth, thumbHeight);

    // Convert to data URL
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    return thumbCanvas.toDataURL(mimeType, quality);
  } catch (error) {
    console.error('[Thumbnail] Error:', error);
    throw new Error(`Failed to generate thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate thumbnail and download
 */
export async function downloadThumbnail(
  elementId: string,
  filename: string = 'thumbnail.jpg',
  options: ThumbnailOptions = {}
): Promise<void> {
  try {
    const dataUrl = await generateThumbnail(elementId, options);
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('[Download Thumbnail] Error:', error);
    throw new Error(`Failed to download thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate image blob without downloading
 */
export async function generateImageBlob(
  elementId: string,
  options: ImageExportOptions = {}
): Promise<Blob> {
  const {
    format = 'png',
    quality = 1.0,
    scale = 2,
    backgroundColor = '#ffffff',
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
    });

    return new Promise((resolve, reject) => {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
          } else {
            resolve(blob);
          }
        },
        mimeType,
        quality
      );
    });
  } catch (error) {
    console.error('[Image Blob] Error:', error);
    throw new Error(`Failed to generate image blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Optimize image by reducing size and quality
 */
export async function optimizeImage(
  elementId: string,
  targetSizeKB: number = 500
): Promise<Blob> {
  let quality = 0.9;
  let scale = 2;
  let blob: Blob;

  try {
    // Try with initial settings
    blob = await generateImageBlob(elementId, {
      format: 'jpeg',
      quality,
      scale,
    });

    // Reduce quality/scale until target size is reached
    while (blob.size > targetSizeKB * 1024 && quality > 0.1) {
      quality -= 0.1;
      
      if (quality < 0.5 && scale > 1) {
        scale -= 0.5;
      }

      blob = await generateImageBlob(elementId, {
        format: 'jpeg',
        quality,
        scale,
      });
    }

    return blob;
  } catch (error) {
    console.error('[Optimize Image] Error:', error);
    throw new Error(`Failed to optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * PDF Export Utilities
 * Convert templates to PDF using html2canvas and jsPDF
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'a3';
  orientation?: 'portrait' | 'landscape';
  scale?: number;
}

/**
 * Export element to PDF
 */
export async function exportToPDF(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'kankotri.pdf',
    quality = 1.0,
    format = 'a4',
    orientation = 'portrait',
    scale = 2,
  } = options;

  try {
    // Get element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Convert to canvas with high quality
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', quality);

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    // Add image to PDF (full page)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export element to PDF with standard A4 size
 */
export async function exportToA4PDF(
  elementId: string,
  filename: string = 'kankotri.pdf'
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // A4 dimensions in mm
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit A4
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Center image on page
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate PDF blob without downloading
 */
export async function generatePDFBlob(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  const {
    quality = 1.0,
    format = 'a4',
    orientation = 'portrait',
    scale = 2,
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
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', quality);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Return as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    throw new Error(`Failed to generate PDF blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

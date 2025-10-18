/**
 * PDF Export Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToPDF, exportToA4PDF, generatePDFBlob } from '@/lib/export/pdf-export';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock html2canvas
vi.mock('html2canvas');

// Mock jsPDF
vi.mock('jspdf', () => {
  const mockPDF = {
    addImage: vi.fn(),
    save: vi.fn(),
    output: vi.fn(),
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
  };
  
  return {
    default: vi.fn(() => mockPDF),
  };
});

describe('PDF Export', () => {
  let mockElement: HTMLElement;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock element
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    document.body.appendChild(mockElement);

    // Create mock canvas
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 1200;
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

    // Mock html2canvas to return our canvas
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  describe('exportToPDF', () => {
    it('exports element to PDF with default options', async () => {
      await exportToPDF('test-element');

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      }));

      expect(jsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'px',
        format: [800, 1200],
      });
    });

    it('exports with custom filename', async () => {
      await exportToPDF('test-element', { filename: 'custom.pdf' });

      const pdfInstance = vi.mocked(jsPDF).mock.results[0]?.value;
      expect(pdfInstance.save).toHaveBeenCalledWith('custom.pdf');
    });

    it('exports with landscape orientation', async () => {
      await exportToPDF('test-element', { orientation: 'landscape' });

      expect(jsPDF).toHaveBeenCalledWith({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 1200],
      });
    });

    it('throws error when element not found', async () => {
      await expect(exportToPDF('non-existent')).rejects.toThrow('Element with id "non-existent" not found');
    });

    it('applies custom scale', async () => {
      await exportToPDF('test-element', { scale: 3 });

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 3,
      }));
    });
  });

  describe('exportToA4PDF', () => {
    it('exports to A4 format', async () => {
      await exportToA4PDF('test-element');

      expect(jsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
    });

    it('uses custom filename', async () => {
      await exportToA4PDF('test-element', 'my-invitation.pdf');

      const pdfInstance = vi.mocked(jsPDF).mock.results[0]?.value;
      expect(pdfInstance.save).toHaveBeenCalledWith('my-invitation.pdf');
    });

    it('throws error when element not found', async () => {
      await expect(exportToA4PDF('missing-element')).rejects.toThrow('Element with id "missing-element" not found');
    });

    it('adds image to PDF', async () => {
      await exportToA4PDF('test-element');

      const pdfInstance = vi.mocked(jsPDF).mock.results[0]?.value;
      expect(pdfInstance.addImage).toHaveBeenCalled();
    });
  });

  describe('generatePDFBlob', () => {
    it('generates PDF blob without saving', async () => {
      const mockBlob = new Blob(['pdf data'], { type: 'application/pdf' });
      
      // Setup mock before calling the function
      const mockPDFInstance = {
        addImage: vi.fn(),
        save: vi.fn(),
        output: vi.fn(() => mockBlob),
        internal: {
          pageSize: {
            getWidth: () => 210,
            getHeight: () => 297,
          },
        },
      };
      vi.mocked(jsPDF).mockReturnValue(mockPDFInstance as any);

      const blob = await generatePDFBlob('test-element');

      expect(blob).toBeInstanceOf(Blob);
      expect(mockPDFInstance.output).toHaveBeenCalledWith('blob');
    });

    it('throws error when element not found', async () => {
      await expect(generatePDFBlob('missing')).rejects.toThrow('Element with id "missing" not found');
    });

    it('applies custom options', async () => {
      await generatePDFBlob('test-element', {
        quality: 0.8,
        scale: 3,
      });

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 3,
      }));
    });
  });
});

/**
 * Image Export Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportToPNG,
  exportToJPEG,
  generateThumbnail,
  downloadThumbnail,
  generateImageBlob,
  optimizeImage,
} from '@/lib/export/image-export';
import html2canvas from 'html2canvas';

// Mock html2canvas
vi.mock('html2canvas');

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('Image Export', () => {
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

    // Mock toBlob
    mockCanvas.toBlob = vi.fn((callback) => {
      const blob = new Blob(['test'], { type: 'image/png' });
      callback(blob);
    }) as any;

    // Mock toDataURL
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

    // Mock getContext
    mockCanvas.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
    })) as any;

    // Mock html2canvas
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    // Mock document.createElement for thumbnail canvas
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        const canvas = originalCreateElement('canvas');
        canvas.getContext = vi.fn(() => ({
          drawImage: vi.fn(),
        })) as any;
        canvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,thumbnail');
        return canvas;
      } else if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = vi.fn();
        return link;
      }
      return originalCreateElement(tagName);
    }) as any;
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  describe('exportToPNG', () => {
    it('exports element to PNG', async () => {
      await exportToPNG('test-element');

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      }));

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/png',
        1.0
      );
    });

    it('uses custom filename', async () => {
      await exportToPNG('test-element', { filename: 'custom.png' });

      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('throws error when element not found', async () => {
      await expect(exportToPNG('non-existent')).rejects.toThrow('Element with id "non-existent" not found');
    });

    it('applies custom options', async () => {
      await exportToPNG('test-element', {
        quality: 0.8,
        scale: 3,
        backgroundColor: '#f0f0f0',
      });

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 3,
        backgroundColor: '#f0f0f0',
      }));
    });
  });

  describe('exportToJPEG', () => {
    it('exports element to JPEG', async () => {
      await exportToJPEG('test-element');

      expect(html2canvas).toHaveBeenCalled();
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.92
      );
    });

    it('uses custom quality', async () => {
      await exportToJPEG('test-element', { quality: 0.75 });

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.75
      );
    });

    it('throws error when element not found', async () => {
      await expect(exportToJPEG('missing')).rejects.toThrow('Element with id "missing" not found');
    });
  });

  describe('generateThumbnail', () => {
    it('generates thumbnail with default size', async () => {
      const dataUrl = await generateThumbnail('test-element');

      expect(dataUrl).toBe('data:image/jpeg;base64,thumbnail');
      expect(html2canvas).toHaveBeenCalled();
    });

    it('generates thumbnail with custom dimensions', async () => {
      const dataUrl = await generateThumbnail('test-element', {
        width: 300,
        height: 450,
      });

      expect(dataUrl).toBeTruthy();
    });

    it('maintains aspect ratio when specified', async () => {
      await generateThumbnail('test-element', {
        width: 400,
        height: 600,
        maintainAspectRatio: true,
      });

      expect(html2canvas).toHaveBeenCalled();
    });

    it('generates PNG thumbnail', async () => {
      const dataUrl = await generateThumbnail('test-element', {
        format: 'png',
      });

      expect(dataUrl).toBeTruthy();
    });

    it('throws error when element not found', async () => {
      await expect(generateThumbnail('missing')).rejects.toThrow('Element with id "missing" not found');
    });
  });

  describe('downloadThumbnail', () => {
    it('downloads thumbnail', async () => {
      // Mock fetch for data URL
      global.fetch = vi.fn(() =>
        Promise.resolve({
          blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
        } as any)
      );

      await downloadThumbnail('test-element', 'thumb.jpg');

      expect(html2canvas).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('uses default filename', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' })),
        } as any)
      );

      await downloadThumbnail('test-element');

      expect(html2canvas).toHaveBeenCalled();
    });
  });

  describe('generateImageBlob', () => {
    it('generates PNG blob', async () => {
      const blob = await generateImageBlob('test-element', { format: 'png' });

      expect(blob).toBeInstanceOf(Blob);
      expect(html2canvas).toHaveBeenCalled();
    });

    it('generates JPEG blob', async () => {
      const blob = await generateImageBlob('test-element', { format: 'jpeg' });

      expect(blob).toBeInstanceOf(Blob);
    });

    it('applies custom quality', async () => {
      await generateImageBlob('test-element', {
        format: 'jpeg',
        quality: 0.7,
      });

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.7
      );
    });

    it('throws error when element not found', async () => {
      await expect(generateImageBlob('missing')).rejects.toThrow('Element with id "missing" not found');
    });
  });

  describe('optimizeImage', () => {
    it('optimizes image to target size', async () => {
      // Mock blob with size
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      Object.defineProperty(mockBlob, 'size', { value: 300 * 1024 });

      mockCanvas.toBlob = vi.fn((callback) => {
        callback(mockBlob);
      }) as any;

      const blob = await optimizeImage('test-element', 500);

      expect(blob).toBeInstanceOf(Blob);
      expect(html2canvas).toHaveBeenCalled();
    });

    it('throws error when element not found', async () => {
      await expect(optimizeImage('missing')).rejects.toThrow('Element with id "missing" not found');
    });
  });
});

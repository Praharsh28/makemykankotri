/**
 * ExportImageButton Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportImageButton } from '@/components/export/ExportImageButton';
import * as imageExport from '@/lib/export/image-export';

// Mock image export functions
vi.mock('@/lib/export/image-export', () => ({
  exportToPNG: vi.fn(),
  exportToJPEG: vi.fn(),
  generateThumbnail: vi.fn(),
  downloadThumbnail: vi.fn(),
  generateImageBlob: vi.fn(),
  optimizeImage: vi.fn(),
}));

describe('ExportImageButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders export button with default format', () => {
    render(<ExportImageButton elementId="test-element" />);

    expect(screen.getByText('Export PNG')).toBeInTheDocument();
  });

  it('renders with JPEG format', () => {
    render(<ExportImageButton elementId="test-element" format="jpeg" />);

    expect(screen.getByText('Export JPEG')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <ExportImageButton elementId="test-element">
        Download Image
      </ExportImageButton>
    );

    expect(screen.getByText('Download Image')).toBeInTheDocument();
  });

  it('calls exportToPNG on click for PNG format', async () => {
    vi.mocked(imageExport.exportToPNG).mockResolvedValue();

    render(
      <ExportImageButton
        elementId="test-element"
        format="png"
        filename="test.png"
      />
    );

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(imageExport.exportToPNG).toHaveBeenCalledWith('test-element', {
        filename: 'test.png',
        format: 'png',
      });
    });
  });

  it('calls exportToJPEG on click for JPEG format', async () => {
    vi.mocked(imageExport.exportToJPEG).mockResolvedValue();

    render(
      <ExportImageButton
        elementId="test-element"
        format="jpeg"
        filename="test.jpg"
      />
    );

    fireEvent.click(screen.getByText('Export JPEG'));

    await waitFor(() => {
      expect(imageExport.exportToJPEG).toHaveBeenCalledWith('test-element', {
        filename: 'test.jpg',
        format: 'jpeg',
      });
    });
  });

  it('shows loading state during export', async () => {
    vi.mocked(imageExport.exportToPNG).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ExportImageButton elementId="test-element" />);

    fireEvent.click(screen.getByText('Export PNG'));

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onSuccess when export succeeds', async () => {
    vi.mocked(imageExport.exportToPNG).mockResolvedValue();
    const mockOnSuccess = vi.fn();

    render(
      <ExportImageButton
        elementId="test-element"
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(imageExport.exportToPNG).mockRejectedValue(
      new Error('Export failed')
    );

    render(<ExportImageButton elementId="test-element" />);

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(screen.getByText(/Export failed/)).toBeInTheDocument();
    });
  });

  it('calls onError when export fails', async () => {
    const error = new Error('Export failed');
    vi.mocked(imageExport.exportToPNG).mockRejectedValue(error);
    const mockOnError = vi.fn();

    render(
      <ExportImageButton
        elementId="test-element"
        onError={mockOnError}
      />
    );

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  it('applies primary variant styles', () => {
    render(<ExportImageButton elementId="test-element" variant="primary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-500');
  });

  it('applies secondary variant styles', () => {
    render(<ExportImageButton elementId="test-element" variant="secondary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary-500');
  });

  it('applies outline variant styles', () => {
    render(<ExportImageButton elementId="test-element" variant="outline" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <ExportImageButton elementId="test-element" size="sm" />
    );
    expect(screen.getByRole('button')).toHaveClass('px-3');

    rerender(<ExportImageButton elementId="test-element" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });

  it('passes custom options to export function', async () => {
    vi.mocked(imageExport.exportToPNG).mockResolvedValue();

    const options = {
      quality: 0.9,
      scale: 3,
      backgroundColor: '#f0f0f0',
    };

    render(
      <ExportImageButton
        elementId="test-element"
        format="png"
        filename="custom.png"
        options={options}
      />
    );

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(imageExport.exportToPNG).toHaveBeenCalledWith('test-element', {
        ...options,
        filename: 'custom.png',
        format: 'png',
      });
    });
  });

  it('uses default filename based on format', async () => {
    vi.mocked(imageExport.exportToPNG).mockResolvedValue();

    render(<ExportImageButton elementId="test-element" format="png" />);

    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(imageExport.exportToPNG).toHaveBeenCalledWith('test-element', expect.objectContaining({
        filename: 'kankotri.png',
      }));
    });
  });

  it('uses default JPEG filename for JPEG format', async () => {
    vi.mocked(imageExport.exportToJPEG).mockResolvedValue();

    render(<ExportImageButton elementId="test-element" format="jpeg" />);

    fireEvent.click(screen.getByText('Export JPEG'));

    await waitFor(() => {
      expect(imageExport.exportToJPEG).toHaveBeenCalledWith('test-element', expect.objectContaining({
        filename: 'kankotri.jpg',
      }));
    });
  });

  it('clears error on new export attempt', async () => {
    vi.mocked(imageExport.exportToPNG)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce();

    render(<ExportImageButton elementId="test-element" />);

    // First attempt - fails
    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(screen.getByText(/First error/)).toBeInTheDocument();
    });

    // Second attempt - succeeds
    fireEvent.click(screen.getByText('Export PNG'));

    await waitFor(() => {
      expect(screen.queryByText(/First error/)).not.toBeInTheDocument();
    });
  });
});

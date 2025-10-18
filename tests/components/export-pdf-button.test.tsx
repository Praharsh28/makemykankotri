/**
 * ExportPDFButton Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportPDFButton } from '@/components/export/ExportPDFButton';
import * as pdfExport from '@/lib/export/pdf-export';

// Mock PDF export functions
vi.mock('@/lib/export/pdf-export', () => ({
  exportToPDF: vi.fn(),
  exportToA4PDF: vi.fn(),
  generatePDFBlob: vi.fn(),
}));

describe('ExportPDFButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders export button', () => {
    render(<ExportPDFButton elementId="test-element" />);

    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <ExportPDFButton elementId="test-element">
        Download Invitation
      </ExportPDFButton>
    );

    expect(screen.getByText('Download Invitation')).toBeInTheDocument();
  });

  it('calls exportToPDF on click', async () => {
    vi.mocked(pdfExport.exportToPDF).mockResolvedValue();

    render(<ExportPDFButton elementId="test-element" filename="test.pdf" />);

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(pdfExport.exportToPDF).toHaveBeenCalledWith('test-element', {
        filename: 'test.pdf',
      });
    });
  });

  it('calls exportToA4PDF when useA4 is true', async () => {
    vi.mocked(pdfExport.exportToA4PDF).mockResolvedValue();

    render(
      <ExportPDFButton
        elementId="test-element"
        filename="test.pdf"
        useA4={true}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(pdfExport.exportToA4PDF).toHaveBeenCalledWith('test-element', 'test.pdf');
    });
  });

  it('shows loading state during export', async () => {
    vi.mocked(pdfExport.exportToPDF).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ExportPDFButton elementId="test-element" />);

    fireEvent.click(screen.getByText('Export PDF'));

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onSuccess when export succeeds', async () => {
    vi.mocked(pdfExport.exportToPDF).mockResolvedValue();
    const mockOnSuccess = vi.fn();

    render(
      <ExportPDFButton elementId="test-element" onSuccess={mockOnSuccess} />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(pdfExport.exportToPDF).mockRejectedValue(
      new Error('Export failed')
    );

    render(<ExportPDFButton elementId="test-element" />);

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(screen.getByText(/Export failed/)).toBeInTheDocument();
    });
  });

  it('calls onError when export fails', async () => {
    const error = new Error('Export failed');
    vi.mocked(pdfExport.exportToPDF).mockRejectedValue(error);
    const mockOnError = vi.fn();

    render(
      <ExportPDFButton elementId="test-element" onError={mockOnError} />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  it('applies primary variant styles', () => {
    render(<ExportPDFButton elementId="test-element" variant="primary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-500');
  });

  it('applies secondary variant styles', () => {
    render(<ExportPDFButton elementId="test-element" variant="secondary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary-500');
  });

  it('applies outline variant styles', () => {
    render(<ExportPDFButton elementId="test-element" variant="outline" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <ExportPDFButton elementId="test-element" size="sm" />
    );
    expect(screen.getByRole('button')).toHaveClass('px-3');

    rerender(<ExportPDFButton elementId="test-element" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });

  it('passes custom options to exportToPDF', async () => {
    vi.mocked(pdfExport.exportToPDF).mockResolvedValue();

    const options = {
      quality: 0.9,
      scale: 3,
      orientation: 'landscape' as const,
    };

    render(
      <ExportPDFButton
        elementId="test-element"
        filename="custom.pdf"
        options={options}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(pdfExport.exportToPDF).toHaveBeenCalledWith('test-element', {
        ...options,
        filename: 'custom.pdf',
      });
    });
  });

  it('clears error on new export attempt', async () => {
    vi.mocked(pdfExport.exportToPDF)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce();

    render(<ExportPDFButton elementId="test-element" />);

    // First attempt - fails
    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(screen.getByText(/First error/)).toBeInTheDocument();
    });

    // Second attempt - succeeds
    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(screen.queryByText(/First error/)).not.toBeInTheDocument();
    });
  });
});

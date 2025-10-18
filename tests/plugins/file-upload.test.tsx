/**
 * File Upload Component Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '@/plugins/form-builder/FileUpload';
import { featureFlags } from '@/core/feature-flags';

describe('File Upload Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('form-builder');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('form-builder');
      const { container } = render(
        <FileUpload name="photo" onChange={mockOnChange} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders upload area', () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(
        <FileUpload
          name="photo"
          label="Upload Photo"
          onChange={mockOnChange}
        />
      );
      expect(screen.getByText('Upload Photo')).toBeInTheDocument();
    });

    it('shows required indicator', () => {
      render(
        <FileUpload
          name="photo"
          label="Photo"
          required
          onChange={mockOnChange}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows file size limit', () => {
      render(
        <FileUpload
          name="photo"
          maxSize={5 * 1024 * 1024}
          onChange={mockOnChange}
        />
      );
      expect(screen.getByText(/max.*5.*mb/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('accepts file via input', () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      expect(mockOnChange).toHaveBeenCalledWith(file);
    });

    it('accepts file via drag and drop', () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dropZone = screen.getByText(/drag.*drop/i).parentElement;
      
      fireEvent.drop(dropZone!, {
        dataTransfer: { files: [file] },
      });
      
      expect(mockOnChange).toHaveBeenCalledWith(file);
    });

    it('prevents default on drag over', () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const dropZone = screen.getByText(/drag.*drop/i).parentElement;
      const event = new Event('dragover', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      dropZone!.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('File Validation', () => {
    it('rejects files larger than maxSize', async () => {
      render(
        <FileUpload
          name="photo"
          maxSize={1024}
          onChange={mockOnChange}
        />
      );
      
      const largeFile = new File(['x'.repeat(2000)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [largeFile] } });
      
      await waitFor(() => {
        expect(screen.getByText(/file.*too large/i)).toBeInTheDocument();
      });
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('rejects invalid file types', async () => {
      render(
        <FileUpload
          name="photo"
          accept="image/*"
          onChange={mockOnChange}
        />
      );
      
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [textFile] } });
      
      await waitFor(() => {
        expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
      });
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('accepts valid files', () => {
      render(
        <FileUpload
          name="photo"
          maxSize={5 * 1024 * 1024}
          accept="image/*"
          onChange={mockOnChange}
        />
      );
      
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [validFile] } });
      
      expect(mockOnChange).toHaveBeenCalledWith(validFile);
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Preview', () => {
    it('shows image preview for image files', async () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        const img = screen.getByAltText(/preview/i);
        expect(img).toBeInTheDocument();
      });
    });

    it('shows file name for selected file', async () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'my-photo.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(screen.getByText('my-photo.jpg')).toBeInTheDocument();
      });
    });

    it('shows file size for selected file', async () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['x'.repeat(1500)], 'test.jpg', {
        type: 'image/jpeg',
      });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(screen.getByText(/1.*kb/i)).toBeInTheDocument();
      });
    });
  });

  describe('Clear/Remove', () => {
    it('shows remove button when file selected', async () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/remove/i)).toBeInTheDocument();
      });
    });

    it('clears file when remove clicked', async () => {
      render(<FileUpload name="photo" onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        const removeButton = screen.getByLabelText(/remove/i);
        fireEvent.click(removeButton);
      });
      
      expect(mockOnChange).toHaveBeenCalledWith(null);
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(
        <FileUpload name="photo" disabled onChange={mockOnChange} />
      );
      
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('does not accept drops when disabled', () => {
      render(
        <FileUpload name="photo" disabled onChange={mockOnChange} />
      );
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dropZone = screen.getByText(/drag.*drop/i).parentElement;
      
      fireEvent.drop(dropZone!, {
        dataTransfer: { files: [file] },
      });
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    it('shows error message when provided', () => {
      render(
        <FileUpload
          name="photo"
          error="File is required"
          onChange={mockOnChange}
        />
      );
      
      expect(screen.getByText('File is required')).toBeInTheDocument();
    });

    it('applies error styling when error present', () => {
      const { container } = render(
        <FileUpload
          name="photo"
          error="Error"
          onChange={mockOnChange}
        />
      );
      
      const dropZone = container.querySelector('.border-red-500');
      expect(dropZone).toBeInTheDocument();
    });
  });
});

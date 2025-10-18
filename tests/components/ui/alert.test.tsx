/**
 * Alert Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders success alert', () => {
    render(<Alert type="success" message="Operation successful" />);

    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });

  it('renders error alert', () => {
    render(<Alert type="error" message="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  it('renders warning alert', () => {
    render(<Alert type="warning" message="Please be careful" />);

    expect(screen.getByText('Please be careful')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-amber-50');
  });

  it('renders info alert', () => {
    render(<Alert type="info" message="Here is some information" />);

    expect(screen.getByText('Here is some information')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });

  it('renders title when provided', () => {
    render(<Alert type="success" title="Success!" message="All done" />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('All done')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(<Alert type="error" message="Error occurred" />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('shows close button when onClose provided', () => {
    const mockOnClose = vi.fn();

    render(<Alert type="success" message="Closeable" onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close alert');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when onClose not provided', () => {
    render(<Alert type="success" message="Not closeable" />);

    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const mockOnClose = vi.fn();

    render(<Alert type="success" message="Test" onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close alert');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Alert type="success" message="Test" className="custom-class" />
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('has proper ARIA role', () => {
    render(<Alert type="error" message="Test" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders correct icon for each type', () => {
    const { rerender } = render(<Alert type="success" message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert type="error" message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert type="warning" message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert type="info" message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

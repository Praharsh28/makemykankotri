/**
 * LoadingOverlay Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders with default message', () => {
    render(<LoadingOverlay />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingOverlay message="Please wait" />);

    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders as fixed fullscreen', () => {
    const { container } = render(<LoadingOverlay fullScreen={true} />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
  });

  it('renders as absolute positioned', () => {
    const { container } = render(<LoadingOverlay fullScreen={false} />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('absolute');
    expect(overlay).toHaveClass('inset-0');
  });

  it('renders with transparent background', () => {
    const { container } = render(<LoadingOverlay transparent={true} />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('bg-white/70');
  });

  it('renders with opaque background', () => {
    const { container } = render(<LoadingOverlay transparent={false} />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('bg-white/90');
  });

  it('has proper ARIA attributes', () => {
    render(<LoadingOverlay message="Processing" />);

    const overlay = screen.getByRole('status');
    expect(overlay).toHaveAttribute('aria-live', 'polite');
    expect(overlay).toHaveAttribute('aria-label', 'Processing');
  });

  it('displays spinner animation', () => {
    const { container } = render(<LoadingOverlay />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('has backdrop blur effect', () => {
    const { container } = render(<LoadingOverlay />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('has high z-index for overlay', () => {
    const { container } = render(<LoadingOverlay />);

    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toHaveClass('z-50');
  });
});

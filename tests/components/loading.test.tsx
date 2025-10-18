/**
 * Loading Components Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SkeletonCard, SkeletonText } from '@/components/Skeleton';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('accepts different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('w-4');
    
    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('w-12');
  });

  it('accepts different colors', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    expect(screen.getByRole('status')).toHaveClass('border-primary-500');
    
    rerender(<LoadingSpinner color="white" />);
    expect(screen.getByRole('status')).toHaveClass('border-white');
  });
});

describe('Skeleton Components', () => {
  it('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders SkeletonText with custom lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(5);
  });

  it('renders SkeletonText with default lines', () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(3);
  });
});

/**
 * AnimationLibrary Component Tests
 * Day 16: Animation Picker UI
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimationLibrary } from '@/plugins/animation-engine/AnimationLibrary';
import { featureFlags } from '@/core/feature-flags';

describe('AnimationLibrary Component', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('animation-engine');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('animation-engine');
      const { container } = render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders animation library UI', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(screen.getByText(/animation library/i)).toBeInTheDocument();
    });

    it('displays available animations', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(screen.getByText('Particle Layer')).toBeInTheDocument();
      expect(screen.getByText('Timeline Animation')).toBeInTheDocument();
      expect(screen.getByText('Cinematic Reveal')).toBeInTheDocument();
    });
  });

  describe('Animation Selection', () => {
    it('calls onSelect when animation clicked', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      
      const particleOption = screen.getByText('Particle Layer');
      fireEvent.click(particleOption);
      
      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'particle' })
      );
    });

    it('highlights selected animation', () => {
      render(
        <AnimationLibrary
          onSelect={mockOnSelect}
          selectedAnimation={{ type: 'timeline', props: {} }}
        />
      );
      
      const timelineOption = screen.getByText('Timeline Animation').closest('button');
      expect(timelineOption).toHaveClass('bg-primary-500');
    });

    it('allows changing selection', () => {
      const { rerender } = render(<AnimationLibrary onSelect={mockOnSelect} />);
      
      fireEvent.click(screen.getByText('Particle Layer'));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      
      rerender(<AnimationLibrary onSelect={mockOnSelect} />);
      fireEvent.click(screen.getByText('Cinematic Reveal'));
      expect(mockOnSelect).toHaveBeenCalledTimes(2);
    });
  });

  describe('Animation Categories', () => {
    it('groups animations by category', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(screen.getByText(/canvas effects/i)).toBeInTheDocument();
      expect(screen.getByText(/transitions/i)).toBeInTheDocument();
    });

    it('filters by category', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} category="transitions" />);
      expect(screen.getByText('Timeline Animation')).toBeInTheDocument();
      expect(screen.getByText('Cinematic Reveal')).toBeInTheDocument();
    });
  });

  describe('Animation Details', () => {
    it('shows animation description', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(screen.getByText(/physics-based particles/i)).toBeInTheDocument();
    });

    it('displays animation icon/preview', () => {
      const { container } = render(<AnimationLibrary onSelect={mockOnSelect} />);
      const icons = container.querySelectorAll('[data-animation-icon]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('shows configuration options', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} showDetails />);
      const durationElements = screen.getAllByText(/duration/i);
      expect(durationElements.length).toBeGreaterThan(0);
    });
  });

  describe('Grid Layout', () => {
    it('displays animations in grid', () => {
      const { container } = render(<AnimationLibrary onSelect={mockOnSelect} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('supports different column counts', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} columns={4} />);
      const grid = document.querySelector('[data-columns="4"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters animations by search query', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} searchable />);
      
      const searchInput = screen.getByPlaceholderText(/search animations/i);
      fireEvent.change(searchInput, { target: { value: 'particle' } });
      
      expect(screen.getByText('Particle Layer')).toBeInTheDocument();
      expect(screen.queryByText('Timeline Animation')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} />);
      const firstOption = screen.getByText('Particle Layer').closest('button');
      
      firstOption?.focus();
      expect(document.activeElement).toBe(firstOption);
    });
  });

  describe('Empty State', () => {
    it('shows message when no animations match filter', () => {
      render(<AnimationLibrary onSelect={mockOnSelect} searchable />);
      
      const searchInput = screen.getByPlaceholderText(/search animations/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      expect(screen.getByText(/no animations found/i)).toBeInTheDocument();
    });
  });
});

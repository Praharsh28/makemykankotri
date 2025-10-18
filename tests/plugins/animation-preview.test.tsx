/**
 * AnimationPreview Component Tests
 * Day 16: Animation Picker UI
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimationPreview } from '@/plugins/animation-engine/AnimationPreview';
import { featureFlags } from '@/core/feature-flags';

// Mock Konva components for testing
vi.mock('react-konva', () => ({
  Stage: ({ children, ...props }: any) => (
    <div data-testid="konva-stage" {...props}>
      {children}
    </div>
  ),
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
}));

// Mock useMediaQuery hooks for testing
vi.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsTablet: () => false,
  useIsDesktop: () => true,
}));

describe('AnimationPreview Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('animation-engine');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('animation-engine');
      const { container } = render(
        <AnimationPreview animation={{ type: 'particle', props: {} }} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders preview container', () => {
      render(<AnimationPreview animation={{ type: 'particle', props: {} }} />);
      expect(screen.getByTestId('animation-preview')).toBeInTheDocument();
    });

    it('shows animation type', () => {
      render(<AnimationPreview animation={{ type: 'cinematic', props: {} }} />);
      expect(screen.getByText(/cinematic/i)).toBeInTheDocument();
    });
  });

  describe('Preview Controls', () => {
    it('displays play/pause button', () => {
      render(<AnimationPreview animation={{ type: 'timeline', props: {} }} />);
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });

    it('toggles play/pause state', () => {
      render(<AnimationPreview animation={{ type: 'timeline', props: {} }} />);
      
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);
      
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });

    it('has restart button', () => {
      render(<AnimationPreview animation={{ type: 'particle', props: {} }} />);
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
    });
  });

  describe('Settings Panel', () => {
    it('displays animation settings', () => {
      render(
        <AnimationPreview
          animation={{ type: 'timeline', props: { duration: 1, ease: 'power3.out' } }}
          showSettings
        />
      );
      expect(screen.getByText(/duration/i)).toBeInTheDocument();
      expect(screen.getByText(/easing/i)).toBeInTheDocument();
    });

    it('allows editing settings', () => {
      const onSettingsChange = vi.fn();
      render(
        <AnimationPreview
          animation={{ type: 'timeline', props: {} }}
          showSettings
          onSettingsChange={onSettingsChange}
        />
      );
      
      const durationInput = screen.getByLabelText(/duration/i);
      fireEvent.change(durationInput, { target: { value: '2' } });
      
      expect(onSettingsChange).toHaveBeenCalled();
    });
  });

  describe('Live Preview', () => {
    it('renders animation component', () => {
      render(
        <AnimationPreview animation={{ type: 'particle', props: { count: 20 } }} />
      );
      expect(screen.getByTestId('animation-preview')).toBeInTheDocument();
    });

    it('updates when animation changes', () => {
      const { rerender } = render(
        <AnimationPreview animation={{ type: 'particle', props: {} }} />
      );
      
      rerender(
        <AnimationPreview animation={{ type: 'cinematic', props: {} }} />
      );
      
      expect(screen.getByText(/cinematic/i)).toBeInTheDocument();
    });
  });

  describe('Props Display', () => {
    it('shows current property values', () => {
      render(
        <AnimationPreview
          animation={{
            type: 'timeline',
            props: { duration: 1.5, stagger: 0.2, ease: 'bounce.out' }
          }}
          showSettings
        />
      );
      
      expect(screen.getByDisplayValue('1.5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0.2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AnimationPreview animation={{ type: 'particle', props: {} }} />);
      expect(screen.getByTestId('animation-preview')).toHaveAttribute('aria-label');
    });
  });
});

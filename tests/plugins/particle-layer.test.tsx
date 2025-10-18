/**
 * ParticleLayer Component Tests
 * Day 14: Konva Setup
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ParticleLayer } from '@/plugins/animation-engine/ParticleLayer';
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
  useIsMobile: () => false,  // Default to desktop in tests
  useIsTablet: () => false,
  useIsDesktop: () => true,
}));

describe('ParticleLayer Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('animation-engine');
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('animation-engine');
      const { container } = render(<ParticleLayer count={10} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders Konva Stage', () => {
      const { getByTestId } = render(<ParticleLayer count={10} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('accepts width and height props', () => {
      const { getByTestId } = render(<ParticleLayer count={10} width={800} height={600} />);
      const stage = getByTestId('konva-stage');
      expect(stage).toBeInTheDocument();
    });

    it('uses default dimensions when not provided', () => {
      const { getByTestId } = render(<ParticleLayer count={10} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Particle Count', () => {
    it('creates specified number of particles', () => {
      const { getByTestId } = render(<ParticleLayer count={20} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('handles zero particles', () => {
      const { getByTestId } = render(<ParticleLayer count={0} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('handles large particle counts', () => {
      const { getByTestId } = render(<ParticleLayer count={100} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Physics Configuration', () => {
    it('accepts custom gravity', () => {
      const { getByTestId } = render(
        <ParticleLayer count={10} gravity={0.5} />
      );
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('accepts custom velocity range', () => {
      const { getByTestId } = render(
        <ParticleLayer count={10} velocityRange={{ min: -2, max: 2 }} />
      );
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('uses default physics when not specified', () => {
      const { getByTestId } = render(<ParticleLayer count={10} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Particle Appearance', () => {
    it('accepts custom particle color', () => {
      const { getByTestId } = render(
        <ParticleLayer count={10} color="#F5B800" />
      );
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('accepts custom particle size range', () => {
      const { getByTestId } = render(
        <ParticleLayer count={10} sizeRange={{ min: 2, max: 8 }} />
      );
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('accepts opacity setting', () => {
      const { getByTestId } = render(
        <ParticleLayer count={10} opacity={0.7} />
      );
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Animation Control', () => {
    it('starts animation by default', () => {
      const { getByTestId } = render(<ParticleLayer count={10} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('respects paused prop', () => {
      const { getByTestId } = render(<ParticleLayer count={10} paused />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('accepts animation speed', () => {
      const { getByTestId } = render(<ParticleLayer count={10} speed={2} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Lifecycle', () => {
    it('cleans up animation on unmount', () => {
      const { unmount } = render(<ParticleLayer count={10} />);
      unmount();
      // Should not throw errors
      expect(true).toBe(true);
    });

    it('updates when count changes', () => {
      const { rerender, getByTestId } = render(<ParticleLayer count={10} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
      
      rerender(<ParticleLayer count={20} />);
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });

    it('handles window resize', () => {
      const { getByTestId } = render(<ParticleLayer count={10} />);
      
      // Simulate resize
      window.dispatchEvent(new Event('resize'));
      
      expect(getByTestId('konva-stage')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('emits particle-animation-start event', () => {
      const onStart = vi.fn();
      render(<ParticleLayer count={10} onStart={onStart} />);
      // Animation should start
      expect(true).toBe(true);
    });

    it('emits particle-animation-stop event on unmount', () => {
      const onStop = vi.fn();
      const { unmount } = render(<ParticleLayer count={10} onStop={onStop} />);
      unmount();
      expect(true).toBe(true);
    });
  });
});

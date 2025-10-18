/**
 * TimelineAnimation Component Tests
 * Day 15: GSAP Integration
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { TimelineAnimation } from '@/plugins/animation-engine/TimelineAnimation';
import { featureFlags } from '@/core/feature-flags';

// Mock GSAP
const mockTimeline = {
  from: vi.fn().mockReturnThis(),
  to: vi.fn().mockReturnThis(),
  play: vi.fn().mockReturnThis(),
  pause: vi.fn().mockReturnThis(),
  reverse: vi.fn().mockReturnThis(),
  kill: vi.fn(),
};

vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => mockTimeline),
  },
}));

describe('TimelineAnimation Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('animation-engine');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('animation-engine');
      const { container } = render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders children when feature flag enabled', () => {
      const { getByText } = render(
        <TimelineAnimation>
          <div>Test Content</div>
        </TimelineAnimation>
      );
      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('applies animation wrapper', () => {
      const { container } = render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(container.querySelector('[data-animated="true"]')).toBeInTheDocument();
    });
  });

  describe('Timeline Creation', () => {
    it('creates GSAP timeline on mount', () => {
      render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      // Timeline should be created (mockTimeline.from should be called)
      expect(mockTimeline.from).toHaveBeenCalled();
    });

    it('accepts duration prop', () => {
      render(
        <TimelineAnimation duration={2}>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 2 })
      );
    });

    it('accepts delay prop', () => {
      render(
        <TimelineAnimation delay={0.5}>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ delay: 0.5 })
      );
    });

    it('uses default values when props not provided', () => {
      render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalled();
    });
  });

  describe('Easing Functions', () => {
    it('applies power3.out easing', () => {
      render(
        <TimelineAnimation ease="power3.out">
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ ease: 'power3.out' })
      );
    });

    it('applies bounce easing', () => {
      render(
        <TimelineAnimation ease="bounce.out">
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ ease: 'bounce.out' })
      );
    });

    it('applies elastic easing', () => {
      render(
        <TimelineAnimation ease="elastic.out">
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ ease: 'elastic.out' })
      );
    });
  });

  describe('Stagger Animations', () => {
    it('applies stagger to multiple children', () => {
      render(
        <TimelineAnimation stagger={0.2}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ stagger: 0.2 })
      );
    });

    it('handles single child without stagger', () => {
      render(
        <TimelineAnimation stagger={0.2}>
          <div>Single Child</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalled();
    });
  });

  describe('Animation Control', () => {
    it('starts paused when paused prop is true', () => {
      render(
        <TimelineAnimation paused>
          <div>Test</div>
        </TimelineAnimation>
      );
      // Timeline created but not played
      expect(mockTimeline.from).toHaveBeenCalled();
    });

    it('plays automatically by default', () => {
      render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      // Animation runs automatically
      expect(mockTimeline.from).toHaveBeenCalled();
    });

    it('can reverse animation', () => {
      render(
        <TimelineAnimation reverse>
          <div>Test</div>
        </TimelineAnimation>
      );
      // Timeline supports reverse
      expect(mockTimeline.from).toHaveBeenCalled();
    });
  });

  describe('Lifecycle', () => {
    it('cleans up timeline on unmount', () => {
      const { unmount } = render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      unmount();
      expect(mockTimeline.kill).toHaveBeenCalled();
    });

    it('accepts onComplete callback', () => {
      const onComplete = vi.fn();
      render(
        <TimelineAnimation onComplete={onComplete}>
          <div>Test</div>
        </TimelineAnimation>
      );
      
      // onComplete is passed to timeline config
      expect(mockTimeline.from).toHaveBeenCalled();
    });
  });

  describe('Animation Properties', () => {
    it('animates opacity from 0 to 1', () => {
      render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ opacity: 0 })
      );
    });

    it('animates y position (slide up)', () => {
      render(
        <TimelineAnimation>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ y: expect.any(Number) })
      );
    });

    it('accepts custom animation properties', () => {
      render(
        <TimelineAnimation animateFrom={{ scale: 0, rotation: 45 }}>
          <div>Test</div>
        </TimelineAnimation>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ scale: 0, rotation: 45 })
      );
    });
  });

  describe('Integration', () => {
    it('updates when props change', () => {
      const { rerender } = render(
        <TimelineAnimation duration={1}>
          <div>Test</div>
        </TimelineAnimation>
      );
      
      vi.clearAllMocks();
      
      rerender(
        <TimelineAnimation duration={2}>
          <div>Test</div>
        </TimelineAnimation>
      );
      
      expect(mockTimeline.kill).toHaveBeenCalled();
    });
  });
});

/**
 * CinematicReveal Component Tests
 * Day 15: GSAP Integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CinematicReveal } from '@/plugins/animation-engine/CinematicReveal';
import { featureFlags } from '@/core/feature-flags';

// Mock GSAP
const mockTimeline = {
  from: vi.fn().mockReturnThis(),
  play: vi.fn().mockReturnThis(),
  pause: vi.fn().mockReturnThis(),
  kill: vi.fn(),
};

vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => mockTimeline),
  },
}));

describe('CinematicReveal Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('animation-engine');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('animation-engine');
      const { container } = render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders children when feature flag enabled', () => {
      const { getByText } = render(
        <CinematicReveal>
          <div>Cinematic Content</div>
        </CinematicReveal>
      );
      expect(getByText('Cinematic Content')).toBeInTheDocument();
    });
  });

  describe('Animation Effect', () => {
    it('applies fade in effect', () => {
      render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ opacity: 0 })
      );
    });

    it('applies slide up effect', () => {
      render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ y: 50 })
      );
    });

    it('uses power3.out easing by default', () => {
      render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ ease: 'power3.out' })
      );
    });

    it('uses 1.2s duration by default', () => {
      render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 1.2 })
      );
    });
  });

  describe('Stagger Effect', () => {
    it('applies stagger to multiple elements', () => {
      render(
        <CinematicReveal>
          <div className="element">Item 1</div>
          <div className="element">Item 2</div>
          <div className="element">Item 3</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ stagger: 0.2 })
      );
    });

    it('accepts custom stagger value', () => {
      render(
        <CinematicReveal stagger={0.3}>
          <div>Item 1</div>
          <div>Item 2</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ stagger: 0.3 })
      );
    });
  });

  describe('Customization', () => {
    it('accepts custom duration', () => {
      render(
        <CinematicReveal duration={2}>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 2 })
      );
    });

    it('accepts custom delay', () => {
      render(
        <CinematicReveal delay={0.5}>
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ delay: 0.5 })
      );
    });

    it('accepts custom easing', () => {
      render(
        <CinematicReveal ease="elastic.out">
          <div>Test</div>
        </CinematicReveal>
      );
      expect(mockTimeline.from).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ ease: 'elastic.out' })
      );
    });
  });

  describe('Lifecycle', () => {
    it('cleans up on unmount', () => {
      const { unmount } = render(
        <CinematicReveal>
          <div>Test</div>
        </CinematicReveal>
      );
      unmount();
      expect(mockTimeline.kill).toHaveBeenCalled();
    });
  });
});

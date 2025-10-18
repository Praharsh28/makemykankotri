/**
 * TimelineAnimation Component
 * GSAP timeline wrapper for React
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { featureFlags } from '@/core/feature-flags';

export interface TimelineAnimationProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  paused?: boolean;
  reverse?: boolean;
  animateFrom?: gsap.TweenVars;
  onComplete?: () => void;
}

export function TimelineAnimation({
  children,
  duration = 1,
  delay = 0,
  stagger = 0,
  ease = 'power3.out',
  paused = false,
  reverse = false,
  animateFrom,
  onComplete,
}: TimelineAnimationProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('animation-engine')) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create timeline
    const tl = gsap.timeline({
      paused,
      onComplete,
    });

    // Default animation properties
    const defaultFrom = {
      opacity: 0,
      y: 50,
    };

    // Merge custom properties
    const fromVars = {
      ...defaultFrom,
      ...animateFrom,
      duration,
      delay,
      ease,
      stagger,
    };

    // Animate children
    const elements = containerRef.current.querySelectorAll('[data-animate]');
    if (elements.length > 0) {
      tl.from(Array.from(elements), fromVars);
    } else {
      tl.from(Array.from(containerRef.current.children), fromVars);
    }

    // Control playback
    if (!paused) {
      if (reverse) {
        tl.reverse();
      } else {
        tl.play();
      }
    }

    timelineRef.current = tl;

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [duration, delay, stagger, ease, paused, reverse, animateFrom, onComplete]);

  return (
    <div ref={containerRef} data-animated="true">
      {children}
    </div>
  );
}

/**
 * CinematicReveal Component
 * Fade in + slide up with stagger effect
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { featureFlags } from '@/core/feature-flags';

export interface CinematicRevealProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
}

export function CinematicReveal({
  children,
  duration = 1.2,
  delay = 0,
  stagger = 0.2,
  ease = 'power3.out',
}: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | undefined>(undefined);

  // Check feature flag
  const isEnabled = featureFlags.isEnabled('animation-engine');

  useEffect(() => {
    if (!containerRef.current) return;

    // Create timeline
    const tl = gsap.timeline();

    // Cinematic reveal: fade in + slide up
    tl.from(Array.from(containerRef.current.children), {
      opacity: 0,
      y: 50,
      duration,
      delay,
      stagger,
      ease,
    });

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [duration, delay, stagger, ease, isEnabled]);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} data-cinematic="true">
      {children}
    </div>
  );
}

/**
 * ParticleLayer Component
 * Physics-based particle system using Konva
 */

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { featureFlags } from '@/core/feature-flags';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export interface ParticleLayerProps {
  count: number;
  width?: number;
  height?: number;
  gravity?: number;
  velocityRange?: { min: number; max: number };
  color?: string;
  sizeRange?: { min: number; max: number };
  opacity?: number;
  paused?: boolean;
  speed?: number;
  onStart?: () => void;
  onStop?: () => void;
}

export function ParticleLayer({
  count,
  width,
  height,
  gravity = 0.1,
  velocityRange = { min: -3, max: 3 },
  color = '#F5B800',
  sizeRange = { min: 2, max: 6 },
  opacity = 0.8,
  paused = false,
  speed = 1,
  onStart,
  onStop,
}: ParticleLayerProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('animation-engine')) {
    return null;
  }

  const isMobile = useIsMobile();

  // Adaptive particle count: 12 on mobile, full count on desktop
  const adaptiveCount = isMobile ? Math.min(count, 12) : count;

  const [dimensions, setDimensions] = useState({
    width: width || (typeof window !== 'undefined' ? window.innerWidth : 800),
    height: height || (typeof window !== 'undefined' ? window.innerHeight : 600),
  });

  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const createParticle = (): Particle => ({
    x: Math.random() * dimensions.width,
    y: Math.random() * dimensions.height,
    vx: velocityRange.min + Math.random() * (velocityRange.max - velocityRange.min),
    vy: velocityRange.min + Math.random() * (velocityRange.max - velocityRange.min),
    radius: sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min),
    opacity,
  });

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: adaptiveCount }, () => createParticle());
    
    if (onStart) {
      onStart();
    }

    return () => {
      if (onStop) {
        onStop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptiveCount]);

  // Handle window resize
  useEffect(() => {
    if (width && height) return; // Don't resize if dimensions are fixed

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    if (paused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      particlesRef.current = particlesRef.current.map(particle => 
        updateParticle(particle, dimensions, gravity, speed)
      );
      
      // Trigger re-render by updating state
      setDimensions((prevDims) => ({ ...prevDims }));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paused, dimensions, gravity, speed]);

  const updateParticle = (
    particle: Particle,
    dims: { width: number; height: number },
    g: number,
    s: number
  ): Particle => {
    let { x, y, vx, vy, radius, opacity: pOpacity } = particle;

    // Apply velocity
    x += vx * s;
    y += vy * s;

    // Apply gravity
    vy += g * s;

    // Bounce off walls
    if (x < 0 || x > dims.width) {
      vx *= -0.8;
      x = Math.max(0, Math.min(dims.width, x));
    }

    if (y < 0 || y > dims.height) {
      vy *= -0.8;
      y = Math.max(0, Math.min(dims.height, y));
    }

    return { x, y, vx, vy, radius, opacity: pOpacity };
  };

  return (
    <Stage width={dimensions.width} height={dimensions.height}>
      <Layer>
        {particlesRef.current.map((particle, index) => (
          <Circle
            key={index}
            x={particle.x}
            y={particle.y}
            radius={particle.radius}
            fill={color}
            opacity={particle.opacity}
          />
        ))}
      </Layer>
    </Stage>
  );
}

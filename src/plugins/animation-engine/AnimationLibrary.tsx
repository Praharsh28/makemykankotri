/**
 * AnimationLibrary Component
 * Browse and select animations
 */

import React, { useState } from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface AnimationType {
  type: 'particle' | 'timeline' | 'cinematic';
  props: Record<string, unknown>;
}

export interface AnimationLibraryProps {
  onSelect: (animation: AnimationType) => void;
  selectedAnimation?: AnimationType;
  category?: string;
  showDetails?: boolean;
  columns?: 2 | 3 | 4;
  searchable?: boolean;
}

interface AnimationOption {
  type: AnimationType['type'];
  name: string;
  description: string;
  category: string;
  icon: string;
  defaultProps: Record<string, unknown>;
}

const animations: AnimationOption[] = [
  {
    type: 'particle',
    name: 'Particle Layer',
    description: 'Physics-based particles with gravity and collision',
    category: 'canvas-effects',
    icon: '✨',
    defaultProps: { count: 40, gravity: 0.1 },
  },
  {
    type: 'timeline',
    name: 'Timeline Animation',
    description: 'GSAP timeline with custom easing and stagger',
    category: 'transitions',
    icon: '🎬',
    defaultProps: { duration: 1, ease: 'power3.out' },
  },
  {
    type: 'cinematic',
    name: 'Cinematic Reveal',
    description: 'Fade in + slide up effect with stagger',
    category: 'transitions',
    icon: '🎭',
    defaultProps: { duration: 1.2, stagger: 0.2 },
  },
];

export function AnimationLibrary({
  onSelect,
  selectedAnimation,
  category,
  showDetails = false,
  columns = 3,
  searchable = false,
}: AnimationLibraryProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('animation-engine')) {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState('');

  // Filter animations
  const filtered = animations.filter(anim => {
    if (category && anim.category !== category) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        anim.name.toLowerCase().includes(query) ||
        anim.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">Animation Library</h3>
        <p className="text-sm text-neutral-600">Choose an animation for your template</p>
      </div>

      {/* Search */}
      {searchable && (
        <input
          type="text"
          placeholder="Search animations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      )}

      {/* Categories */}
      {!category && (
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-neutral-700">Canvas Effects</span>
          <span className="font-medium text-neutral-700">Transitions</span>
        </div>
      )}

      {/* Animation Grid */}
      {filtered.length > 0 ? (
        <div
          role="listbox"
          className={`grid gap-4 ${gridCols[columns]}`}
          data-columns={columns}
        >
          {filtered.map((anim) => (
            <AnimationCard
              key={anim.type}
              animation={anim}
              selected={selectedAnimation?.type === anim.type}
              showDetails={showDetails}
              onSelect={() =>
                onSelect({
                  type: anim.type,
                  props: anim.defaultProps,
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-500">
          <p>No animations found</p>
        </div>
      )}
    </div>
  );
}

interface AnimationCardProps {
  animation: AnimationOption;
  selected: boolean;
  showDetails: boolean;
  onSelect: () => void;
}

function AnimationCard({ animation, selected, showDetails, onSelect }: AnimationCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        text-left p-4 rounded-lg border-2 transition-all duration-200
        hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500
        ${
          selected
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-neutral-200 bg-white hover:border-primary-300'
        }
      `}
    >
      {/* Icon */}
      <div
        className="text-3xl mb-2"
        data-animation-icon
        aria-hidden="true"
      >
        {animation.icon}
      </div>

      {/* Name */}
      <h4 className={`font-semibold mb-1 ${selected ? 'text-white' : 'text-neutral-900'}`}>
        {animation.name}
      </h4>

      {/* Description */}
      <p className={`text-sm ${selected ? 'text-white/90' : 'text-neutral-600'}`}>
        {animation.description}
      </p>

      {/* Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <div className="text-xs space-y-1">
            <div>Duration: {(animation.defaultProps.duration as number) || 'variable'}</div>
          </div>
        </div>
      )}
    </button>
  );
}

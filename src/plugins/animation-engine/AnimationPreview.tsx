/**
 * AnimationPreview Component
 * Preview animation before applying
 */

import React, { useState } from 'react';
import { featureFlags } from '@/core/feature-flags';
import { ParticleLayer } from './ParticleLayer';
import { TimelineAnimation } from './TimelineAnimation';
import { CinematicReveal } from './CinematicReveal';
import type { AnimationType } from './AnimationLibrary';

export interface AnimationPreviewProps {
  animation: AnimationType;
  showSettings?: boolean;
  onSettingsChange?: (props: Record<string, unknown>) => void;
  className?: string;
}

export function AnimationPreview({ animation, className = '', showSettings, onSettingsChange }: AnimationPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Check feature flag
  const isEnabled = featureFlags.isEnabled('animation-engine');

  const handleRestart = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleSettingChange = (key: string, value: unknown) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...animation.props,
        [key]: value,
      });
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      data-testid="animation-preview"
      aria-label="Animation preview"
      className={`space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-neutral-900 capitalize">
          {animation.type} Animation
        </h4>
        
        {/* Controls */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-sm font-medium transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-sm font-medium transition-colors"
            aria-label="Restart"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="border-2 border-neutral-200 rounded-lg p-6 bg-neutral-50 min-h-[200px] flex items-center justify-center overflow-hidden">
        {animation.type === 'particle' && isPlaying && (
          <ParticleLayer
            count={(animation.props.count as number) || 40}
            width={400}
            height={200}
            {...animation.props}
          />
        )}

        {animation.type === 'timeline' && isPlaying && (
          <TimelineAnimation
            duration={(animation.props.duration as number) || 1}
            ease={(animation.props.ease as string) || 'power3.out'}
            stagger={(animation.props.stagger as number) || 0}
            {...animation.props}
          >
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-neutral-900">Animated Element 1</div>
              <div className="text-lg text-neutral-700">Animated Element 2</div>
              <div className="text-base text-neutral-600">Animated Element 3</div>
            </div>
          </TimelineAnimation>
        )}

        {animation.type === 'cinematic' && isPlaying && (
          <CinematicReveal
            duration={(animation.props.duration as number) || 1.2}
            stagger={(animation.props.stagger as number) || 0.2}
            ease={(animation.props.ease as string) || 'power3.out'}
            {...animation.props}
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-neutral-900">Hero Title</h1>
              <p className="text-lg text-neutral-700">Subtitle text</p>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                Call to Action
              </button>
            </div>
          </CinematicReveal>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-3 p-4 bg-white rounded-lg border border-neutral-200">
          <h5 className="font-medium text-neutral-900">Settings</h5>

          {animation.type === 'particle' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Count
                </label>
                <input
                  type="number"
                  value={(animation.props.count as number) || 40}
                  onChange={(e) => handleSettingChange('count', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded"
                  min="1"
                  max="100"
                />
              </div>
            </>
          )}

          {(animation.type === 'timeline' || animation.type === 'cinematic') && (
            <>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-1">
                  Duration (seconds)
                </label>
                <input
                  id="duration"
                  type="number"
                  value={(animation.props.duration as number) || 1}
                  onChange={(e) => handleSettingChange('duration', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded"
                  min="0.1"
                  max="5"
                  step="0.1"
                />
              </div>

              <div>
                <label htmlFor="easing" className="block text-sm font-medium text-neutral-700 mb-1">
                  Easing
                </label>
                <select
                  id="easing"
                  value={(animation.props.ease as string) || 'power3.out'}
                  onChange={(e) => handleSettingChange('ease', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded"
                >
                  <option value="power3.out">Power3 Out</option>
                  <option value="bounce.out">Bounce Out</option>
                  <option value="elastic.out">Elastic Out</option>
                  <option value="none">Linear</option>
                </select>
              </div>

              {animation.type === 'timeline' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Stagger
                  </label>
                  <input
                    type="number"
                    value={(animation.props.stagger as number) || 0}
                    onChange={(e) => handleSettingChange('stagger', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

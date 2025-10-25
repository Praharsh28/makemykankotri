/**
 * Style Conversion Utilities
 * Convert element styles to React CSS Properties
 */

import React from 'react';
import type { Element } from '../types';

/**
 * Convert element style object to React CSSProperties
 * Handles unit conversion (px) and property mapping
 */
export function convertStyle(style: Element['style']): React.CSSProperties {
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    color: style.color,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    backgroundColor: style.backgroundColor,
    padding: style.padding ? `${style.padding}px` : undefined,
    margin: style.margin ? `${style.margin}px` : undefined,
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
  };
}

/**
 * Convert element position to absolute positioning style
 */
export function convertPositionStyle(
  position: Element['position'],
  size: Element['size']
): React.CSSProperties {
  return {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: position.z,
    width: typeof size.width === 'number' ? `${size.width}px` : size.width,
    height: typeof size.height === 'number' ? `${size.height}px` : size.height,
  };
}

/**
 * Merge multiple style objects
 */
export function mergeStyles(...styles: React.CSSProperties[]): React.CSSProperties {
  return Object.assign({}, ...styles);
}

/**
 * Convert template layout to container style
 */
export function convertLayoutStyle(layout: {
  width: number;
  height: number;
  background: string;
}): React.CSSProperties {
  return {
    position: 'relative',
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    backgroundColor: layout.background,
    overflow: 'hidden',
  };
}

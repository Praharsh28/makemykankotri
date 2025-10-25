/**
 * Element Inspector - Dev Tool
 * Press Ctrl+Shift+I to toggle
 * Hover over elements to see component info
 * Click to copy selector path
 */

'use client';

import { useEffect, useState } from 'react';

export function ElementInspector() {
  const [isActive, setIsActive] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<{
    selector: string;
    component: string;
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    // Toggle inspector with Ctrl+Shift+I
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        setIsActive((prev) => !prev);
        console.log(isActive ? '🔍 Inspector OFF' : '🔍 Inspector ON - Hover over elements!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Get component info from data attributes or class names
      const component = 
        target.getAttribute('data-component') ||
        target.className.split(' ')[0] ||
        target.tagName.toLowerCase();

      // Build selector path
      const selector = buildSelector(target);

      setHoveredElement({
        selector,
        component,
        position: { x: e.clientX, y: e.clientY },
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (!hoveredElement) return;
      e.preventDefault();
      e.stopPropagation();
      
      // Copy to clipboard
      navigator.clipboard.writeText(hoveredElement.selector);
      console.log('📋 Copied to clipboard:', hoveredElement.selector);
      console.log('Component:', hoveredElement.component);
      
      // Show alert
      alert(`✅ Copied to clipboard!\n\nSelector: ${hoveredElement.selector}\nComponent: ${hoveredElement.component}\n\nYou can now tell me: "Change ${hoveredElement.component}"`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, true);
    };
  }, [isActive, hoveredElement]);

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-blue-500/10 pointer-events-none z-[9998]" />

      {/* Status Badge */}
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] font-mono text-sm">
        🔍 Inspector Active - Click element to copy info
      </div>

      {/* Hover Info */}
      {hoveredElement && (
        <div
          className="fixed bg-black text-white px-3 py-2 rounded-lg shadow-lg z-[9999] font-mono text-xs pointer-events-none"
          style={{
            left: hoveredElement.position.x + 10,
            top: hoveredElement.position.y + 10,
          }}
        >
          <div className="font-bold text-blue-300">{hoveredElement.component}</div>
          <div className="text-gray-300 mt-1">{hoveredElement.selector}</div>
          <div className="text-gray-400 mt-1 text-[10px]">Click to copy</div>
        </div>
      )}
    </>
  );
}

function buildSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && parts.length < 5) {
    let selector = current.tagName.toLowerCase();
    
    // Add ID if present
    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break;
    }
    
    // Add class if present (first class only)
    const firstClass = current.className?.split(' ')[0];
    if (firstClass && !firstClass.includes('hover') && !firstClass.includes('focus')) {
      selector += `.${firstClass}`;
    }
    
    parts.unshift(selector);
    current = current.parentElement;
  }
  
  return parts.join(' > ');
}

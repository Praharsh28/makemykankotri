/**
 * TemplateCard Component
 * Beautiful card for displaying templates in gallery
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import Image from 'next/image';
import { Template } from '@/core/types';
import { useState } from 'react';

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
  selected?: boolean;
}

export function TemplateCard({ 
  template, 
  onSelect,
  selected = false 
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        group relative
        bg-white rounded-xl overflow-hidden
        border-2 transition-all duration-300
        cursor-pointer
        ${selected 
          ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
          : 'border-neutral-200 hover:border-primary-400 hover:shadow-md'
        }
      `}
      onClick={() => onSelect?.(template)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className={`
              object-cover transition-transform duration-500
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-500">No Preview</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full py-2 px-4 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Use Template
            </button>
          </div>
        </div>

        {/* Selected Badge */}
        {selected && (
          <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Selected
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-1 line-clamp-1">
          {template.name}
        </h3>
        
        {template.description && (
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
            {template.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            {template.category && (
              <span className="px-2 py-1 bg-neutral-100 rounded-md">
                {template.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>{template.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

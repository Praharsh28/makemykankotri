/**
 * Share Button Component
 * Copy link and share invitation
 */

import React, { useState } from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface ShareButtonProps {
  url: string;
  showShareOptions?: boolean;
}

export function ShareButton({ url, showShareOptions = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Check feature flag
  if (!featureFlags.isEnabled('template-renderer')) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyError(false);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyError(true);
      
      setTimeout(() => {
        setCopyError(false);
      }, 3000);
    }
  };

  const handleShare = () => {
    setShowOptions(!showOptions);
  };

  // Kept for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shareToWhatsApp = () => {
    const message = `Check out my wedding invitation: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToEmail = () => {
    const subject = 'Wedding Invitation';
    const body = `You're invited! View the invitation here: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Extract slug for display
  const slug = url.split('/').pop() || url;

  return (
    <div className="space-y-4">
      {/* URL Display */}
      <div className="flex items-center gap-2 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex-1 overflow-hidden">
          <label className="text-xs font-medium text-neutral-600 block mb-1">
            Share Link
          </label>
          <div className="text-sm text-neutral-900 font-mono truncate">
            {slug}
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link to clipboard"
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${copied 
              ? 'bg-green-500 text-white' 
              : copyError
              ? 'bg-red-500 text-white'
              : 'bg-primary-500 text-white hover:bg-primary-600'
            }
          `}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : copyError ? (
            'Failed'
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Share Options */}
      {showShareOptions && (
        <div>
          <button
            type="button"
            onClick={handleShare}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-2"
          >
            {showOptions ? 'Hide' : 'Show'} Share Options
          </button>

          {showOptions && (
            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my wedding invitation: ${url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              <button
                type="button"
                onClick={shareToEmail}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * LoadingOverlay Component
 * Full-screen or contained loading overlay
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

export interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export function LoadingOverlay({
  message = 'Loading...',
  fullScreen = false,
  transparent = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0' : 'absolute inset-0'}
        flex items-center justify-center
        ${transparent ? 'bg-white/70' : 'bg-white/90'}
        backdrop-blur-sm
        z-50
        transition-opacity duration-300
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>

        {/* Message */}
        <p className="text-neutral-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

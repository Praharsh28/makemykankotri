/**
 * Auth Layout
 * Wraps all auth pages with proper client-side rendering
 * Prevents SSR/SSG issues with auth context
 */

import React, { Suspense } from 'react';

// Disable static generation for entire auth route group
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

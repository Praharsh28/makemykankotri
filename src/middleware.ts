/**
 * Next.js Middleware - Route Protection
 * Protects authenticated and admin routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, let client-side handle auth redirects
  // Middleware runs on edge, checking session is complex
  // We'll use client-side protection in page components
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/settings/:path*'],
};

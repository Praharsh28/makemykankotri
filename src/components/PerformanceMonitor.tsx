/**
 * Performance Monitor
 * Tracks Web Vitals and reports metrics
 */

'use client';

import { useEffect } from 'react';

interface Metric {
  name: string;
  value: number;
  rating: string;
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid SSR issues
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const sendToAnalytics = (metric: Metric) => {
        // In production, send to your analytics service
        if (process.env.NODE_ENV === 'development') {
          console.log('[Performance]', {
            name: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
          });
        }
      };

      onCLS(sendToAnalytics);
      onINP(sendToAnalytics); // Replaced FID with INP (Interaction to Next Paint)
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });
  }, []);

  return null;
}

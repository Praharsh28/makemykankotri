import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Disable static optimization for dynamic routes
  // This prevents build errors with auth context
  eslint: {
    ignoreDuringBuilds: false, // Keep ESLint enabled
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript strict
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/plugins/*', '@/core/*'],
  },
};

export default withBundleAnalyzer(nextConfig);

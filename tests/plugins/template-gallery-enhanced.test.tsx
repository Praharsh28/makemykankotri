/**
 * Enhanced TemplateGallery Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TemplateGallery } from '@/plugins/gallery/TemplateGallery';
import { templateStorage } from '@/core/template-system/TemplateStorage';
import { featureFlags } from '@/core/feature-flags';
import { Template } from '@/core/types';

// Mock TemplateStorage
vi.mock('@/core/template-system/TemplateStorage', () => ({
  templateStorage: {
    list: vi.fn(),
  },
}));

// Mock useMediaQuery
vi.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsTablet: () => false,
  useIsDesktop: () => true,
}));

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Traditional',
    slug: 'traditional',
    category: 'Traditional',
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb1.jpg',
    tags: [],
    description: 'Traditional template',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    published: true,
    views: 100,
    uses: 50,
  },
  {
    id: '2',
    name: 'Modern',
    slug: 'modern',
    category: 'Modern',
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb2.jpg',
    tags: [],
    description: 'Modern template',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    published: true,
    views: 200,
    uses: 75,
  },
];

describe('Enhanced TemplateGallery', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('gallery');
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(templateStorage.list).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TemplateGallery />);
    
    // Should show skeleton cards
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays templates after loading', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<TemplateGallery />);

    await waitFor(() => {
      expect(screen.getByText('Traditional template')).toBeInTheDocument();
      expect(screen.getByText('Modern template')).toBeInTheDocument();
    });
  });

  it('filters templates by category', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<TemplateGallery category="Traditional" />);

    await waitFor(() => {
      expect(screen.getByText('Traditional Templates')).toBeInTheDocument();
    });
  });

  it('shows empty state when no templates', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue([]);

    render(<TemplateGallery />);

    await waitFor(() => {
      expect(screen.getByText('No Templates Found')).toBeInTheDocument();
    });
  });

  it('shows error state on failure', async () => {
    vi.mocked(templateStorage.list).mockRejectedValue(new Error('Failed'));

    render(<TemplateGallery />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load templates/i)).toBeInTheDocument();
    });
  });

  it('displays template count', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<TemplateGallery />);

    await waitFor(() => {
      expect(screen.getByText(/2 templates available/i)).toBeInTheDocument();
    });
  });
});

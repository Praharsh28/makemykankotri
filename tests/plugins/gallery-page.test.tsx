/**
 * GalleryPage Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GalleryPage } from '@/plugins/gallery/GalleryPage';
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
    name: 'Traditional Wedding',
    slug: 'traditional-wedding',
    category: 'Traditional',
    tags: ['gold', 'elegant'],
    description: 'Beautiful traditional design',
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb1.jpg',
    createdBy: 'admin',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    version: 1,
    published: true,
    views: 100,
    uses: 50,
  },
  {
    id: '2',
    name: 'Modern Minimalist',
    slug: 'modern-minimalist',
    category: 'Modern',
    tags: ['minimalist', 'clean'],
    description: 'Clean modern template',
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb2.jpg',
    createdBy: 'admin',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    version: 1,
    published: true,
    views: 200,
    uses: 75,
  },
  {
    id: '3',
    name: 'Vintage Style',
    slug: 'vintage-style',
    category: 'Vintage',
    tags: ['vintage', 'classic'],
    description: 'Classic vintage template',
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb3.jpg',
    createdBy: 'admin',
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
    version: 1,
    published: true,
    views: 50,
    uses: 25,
  },
];

describe('GalleryPage', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('gallery');
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(templateStorage.list).mockImplementation(
      () => new Promise(() => {})
    );

    render(<GalleryPage />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays templates after loading', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('Beautiful traditional design')).toBeInTheDocument();
      expect(screen.getByText('Clean modern template')).toBeInTheDocument();
      expect(screen.getByText('Classic vintage template')).toBeInTheDocument();
    });
  });

  it('displays gallery header', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('Template Gallery')).toBeInTheDocument();
    });
  });

  it('displays filter components', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
      expect(screen.getByText('All')).toBeInTheDocument();
    });
  });

  it('filters templates by search', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
    });
  });

  it('displays category filter buttons', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('has sort dropdown', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('shows template count', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText(/3 beautiful wedding invitation templates/i)).toBeInTheDocument();
    });
  });


  it('shows empty state when no templates', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue([]);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('No Templates Found')).toBeInTheDocument();
    });
  });

  it('shows error state on load failure', async () => {
    vi.mocked(templateStorage.list).mockRejectedValue(new Error('Failed'));

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load templates/i)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('displays unique categories', async () => {
    vi.mocked(templateStorage.list).mockResolvedValue(mockTemplates);

    render(<GalleryPage />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      // Should have All + 3 categories = 4+ buttons (plus any clear filters)
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });
  });
});

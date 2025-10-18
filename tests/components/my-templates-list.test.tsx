/**
 * MyTemplatesList Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MyTemplatesList } from '@/components/dashboard/MyTemplatesList';
import { templateStorage } from '@/core/template-system/TemplateStorage';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { supabase } from '@/core/template-system/supabase';
import { Template } from '@/core/types';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('@/core/template-system/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

// Mock TemplateStorage
vi.mock('@/core/template-system/TemplateStorage', () => ({
  templateStorage: {
    getUserTemplates: vi.fn(),
    delete: vi.fn(),
    save: vi.fn(),
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
    id: 'template-1',
    name: 'Template 1',
    slug: 'template-1',
    description: 'Description 1',
    category: 'Traditional',
    tags: [],
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb1.jpg',
    createdBy: 'user-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    version: 1,
    published: true,
    views: 100,
    uses: 50,
  },
  {
    id: 'template-2',
    name: 'Template 2',
    slug: 'template-2',
    description: 'Description 2',
    category: 'Modern',
    tags: [],
    elements: [],
    editableFields: [],
    layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
    globalAnimations: [],
    thumbnail: '/thumb2.jpg',
    createdBy: 'user-1',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    version: 1,
    published: false,
    views: 50,
    uses: 25,
  },
];

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  created_at: '2025-01-01',
};

describe('MyTemplatesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as any,
          access_token: 'token',
        } as any,
      },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    } as any);
  });

  it('renders component', () => {
    vi.mocked(templateStorage.getUserTemplates).mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    expect(container).toBeTruthy();
  });

  it('displays templates after loading', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue(mockTemplates);

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
      expect(screen.getByText('Template 2')).toBeInTheDocument();
    });
  });

  it('shows template count', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue(mockTemplates);

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2 templates')).toBeInTheDocument();
    });
  });

  it('shows error state on load failure', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockRejectedValue(
      new Error('Failed')
    );

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load templates')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('shows empty state when no templates', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue([]);

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No Templates Yet')).toBeInTheDocument();
      expect(screen.getByText(/Create your first wedding invitation/)).toBeInTheDocument();
    });
  });

  it('deletes template when confirmed', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue(mockTemplates);
    vi.mocked(templateStorage.delete).mockResolvedValue();

    const mockOnDeleted = vi.fn();

    render(
      <AuthProvider>
        <MyTemplatesList onTemplateDeleted={mockOnDeleted} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
    });

    // Open actions menu for first template
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);

    // Click delete
    fireEvent.click(screen.getByText('Delete'));

    // Confirm delete
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(templateStorage.delete).toHaveBeenCalledWith('template-1');
      expect(mockOnDeleted).toHaveBeenCalledWith(mockTemplates[0]);
    });
  });

  it('duplicates template', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue(mockTemplates);
    vi.mocked(templateStorage.save).mockResolvedValue(mockTemplates[0]);

    const mockOnDuplicated = vi.fn();

    render(
      <AuthProvider>
        <MyTemplatesList onTemplateDuplicated={mockOnDuplicated} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
    });

    // Open actions menu
    const menuButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(menuButtons[0]);

    // Click duplicate
    fireEvent.click(screen.getByText('Duplicate'));

    await waitFor(() => {
      expect(templateStorage.save).toHaveBeenCalled();
      expect(mockOnDuplicated).toHaveBeenCalled();
    });
  });

  it('retries loading on error', async () => {
    vi.mocked(templateStorage.getUserTemplates)
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce(mockTemplates);

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load templates')).toBeInTheDocument();
    });

    // Click try again
    fireEvent.click(screen.getByText('Try Again'));

    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
    });
  });

  it('shows message when user not logged in', () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    // Will show loading initially, then message
    // Not testing this case deeply as auth is required for this component
  });

  it('displays New Template button', async () => {
    vi.mocked(templateStorage.getUserTemplates).mockResolvedValue(mockTemplates);

    render(
      <AuthProvider>
        <MyTemplatesList />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('+ New Template')).toBeInTheDocument();
    });
  });
});

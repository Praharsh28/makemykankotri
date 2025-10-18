/**
 * MyTemplateCard Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyTemplateCard } from '@/components/dashboard/MyTemplateCard';
import { Template } from '@/core/types';

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const mockTemplate: Template = {
  id: 'template-1',
  name: 'Wedding Invitation',
  slug: 'wedding-invitation',
  description: 'Beautiful wedding template',
  category: 'Traditional',
  tags: ['wedding', 'traditional'],
  elements: [],
  editableFields: [],
  layout: { width: 800, height: 1200, background: '#fff', orientation: 'portrait' },
  globalAnimations: [],
  thumbnail: '/thumb.jpg',
  createdBy: 'user-1',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-15'),
  version: 1,
  published: true,
  views: 150,
  uses: 25,
};

describe('MyTemplateCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders template information', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    expect(screen.getByText('Wedding Invitation')).toBeInTheDocument();
    expect(screen.getByText('Beautiful wedding template')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // views
  });

  it('shows published status', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('shows draft status for unpublished templates', () => {
    const draftTemplate = { ...mockTemplate, published: false };
    render(<MyTemplateCard template={draftTemplate} />);

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('displays thumbnail image', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    const img = screen.getByAltText('Wedding Invitation');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/thumb.jpg');
  });

  it('shows placeholder when no thumbnail', () => {
    const noThumbTemplate = { ...mockTemplate, thumbnail: '' };
    render(<MyTemplateCard template={noThumbTemplate} />);

    expect(screen.getByText('No thumbnail')).toBeInTheDocument();
  });

  it('toggles actions menu on button click', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('navigates to editor on edit click', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Click edit
    fireEvent.click(screen.getByText('Edit'));

    expect(mockPush).toHaveBeenCalledWith('/editor/template-1');
  });

  it('calls onDuplicate when duplicate clicked', () => {
    const mockOnDuplicate = vi.fn();
    render(<MyTemplateCard template={mockTemplate} onDuplicate={mockOnDuplicate} />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Click duplicate
    fireEvent.click(screen.getByText('Duplicate'));

    expect(mockOnDuplicate).toHaveBeenCalledWith(mockTemplate);
  });

  it('shows delete confirmation modal', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Click delete
    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByText('Delete Template?')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it('calls onDelete when confirmed', () => {
    const mockOnDelete = vi.fn();
    render(<MyTemplateCard template={mockTemplate} onDelete={mockOnDelete} />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Click delete
    fireEvent.click(screen.getByText('Delete'));

    // Confirm delete
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[deleteButtons.length - 1]); // Click the confirm button

    expect(mockOnDelete).toHaveBeenCalledWith(mockTemplate);
  });

  it('cancels delete when cancel clicked', () => {
    const mockOnDelete = vi.fn();
    render(<MyTemplateCard template={mockTemplate} onDelete={mockOnDelete} />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);

    // Click delete
    fireEvent.click(screen.getByText('Delete'));

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(screen.queryByText('Delete Template?')).not.toBeInTheDocument();
  });

  it('displays updated date', () => {
    render(<MyTemplateCard template={mockTemplate} />);

    const dateText = new Date('2025-01-15').toLocaleDateString();
    expect(screen.getByText(dateText)).toBeInTheDocument();
  });

  it('shows default description when none provided', () => {
    const noDescTemplate = { ...mockTemplate, description: '' };
    render(<MyTemplateCard template={noDescTemplate} />);

    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});

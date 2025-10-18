/**
 * GalleryFilters Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GalleryFilters } from '@/plugins/gallery/GalleryFilters';

describe('GalleryFilters', () => {
  const mockOnFilterChange = vi.fn();
  const mockCategories = ['Traditional', 'Modern', 'Vintage'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Traditional')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
    expect(screen.getByText('Vintage')).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onFilterChange when category is selected', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    fireEvent.click(screen.getByText('Traditional'));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      category: 'Traditional',
      sortBy: 'popular',
    });
  });

  it('calls onFilterChange when sort option changes', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'recent' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      category: '',
      sortBy: 'recent',
    });
  });

  it('debounces search input', async () => {
    vi.useFakeTimers();

    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    const input = screen.getByPlaceholderText('Search templates...');

    // Type in search
    fireEvent.change(input, { target: { value: 'wedding' } });

    // Should not call immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(300);

    // Should call after debounce
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'wedding',
      category: '',
      sortBy: 'popular',
    });

    vi.useRealTimers();
  });

  it('shows clear filters button when filters are active', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        initialFilters={{ search: 'test', category: 'Traditional', sortBy: 'popular' }}
      />
    );

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('hides clear filters button when no filters active', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('clears all filters when clear button clicked', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        initialFilters={{ search: 'test', category: 'Traditional', sortBy: 'recent' }}
      />
    );

    fireEvent.click(screen.getByText('Clear Filters'));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      category: '',
      sortBy: 'popular',
    });
  });

  it('highlights selected category', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
        initialFilters={{ category: 'Modern' }}
      />
    );

    const modernButton = screen.getByText('Modern');
    expect(modernButton).toHaveClass('bg-primary-500', 'text-white');
  });

  it('highlights All when no category selected', () => {
    render(
      <GalleryFilters
        onFilterChange={mockOnFilterChange}
        categories={mockCategories}
      />
    );

    const allButton = screen.getByText('All');
    expect(allButton).toHaveClass('bg-primary-500', 'text-white');
  });
});

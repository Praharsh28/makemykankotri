/**
 * GalleryFilters Component
 * Search, category filters, and sort options
 * Following design system from 09_UI_UX_DESIGN.md
 */

'use client';

import { useState, useEffect } from 'react';

export interface FilterState {
  search: string;
  category: string;
  sortBy: 'recent' | 'popular' | 'name';
}

export interface GalleryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  initialFilters?: Partial<FilterState>;
}

export function GalleryFilters({
  onFilterChange,
  categories,
  initialFilters = {},
}: GalleryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    sortBy: initialFilters.sortBy || 'popular',
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  function updateFilters(updates: Partial<FilterState>) {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  function clearFilters() {
    const clearedFilters: FilterState = {
      search: '',
      category: '',
      sortBy: 'popular',
    };
    setFilters(clearedFilters);
    setSearchInput('');
    onFilterChange(clearedFilters);
  }

  const hasActiveFilters = filters.search || filters.category;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search templates..."
          className="
            w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            text-neutral-900 placeholder-neutral-500
          "
        />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              ${
                !filters.category
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }
            `}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateFilters({ category })}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${
                  filters.category === category
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Sort by:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilters({
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="
                px-3 py-2 rounded-lg border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-all duration-200
                text-neutral-900 bg-white
                cursor-pointer
              "
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="
                px-4 py-2 rounded-lg font-medium text-sm
                text-neutral-700 hover:text-neutral-900
                border border-neutral-300 hover:border-neutral-400
                transition-all duration-200
              "
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

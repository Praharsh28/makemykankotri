/**
 * TemplateCard Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateCard } from '@/plugins/gallery/TemplateCard';
import { Template } from '@/core/types';

const mockTemplate: Template = {
  id: 'test-1',
  name: 'Traditional Kankotri',
  slug: 'traditional-kankotri',
  description: 'Beautiful traditional design',
  category: 'Traditional',
  thumbnail: '/test-thumbnail.jpg',
  views: 123,
  uses: 45,
  elements: [],
  editableFields: [],
  layout: {
    width: 800,
    height: 1200,
    background: '#fff',
    orientation: 'portrait',
  },
  globalAnimations: [],
  tags: [],
  createdBy: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  published: true,
};

describe('TemplateCard', () => {
  it('renders template information', () => {
    render(<TemplateCard template={mockTemplate} />);
    
    expect(screen.getByText('Traditional Kankotri')).toBeInTheDocument();
    expect(screen.getByText('Beautiful traditional design')).toBeInTheDocument();
    expect(screen.getByText('Traditional')).toBeInTheDocument();
  });

  it('shows selected state', () => {
    const { container } = render(<TemplateCard template={mockTemplate} selected />);
    
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(container.querySelector('.border-primary-500')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<TemplateCard template={mockTemplate} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Traditional Kankotri'));
    expect(onSelect).toHaveBeenCalledWith(mockTemplate);
  });

  it('shows hover overlay on mouse enter', () => {
    const { container } = render(<TemplateCard template={mockTemplate} />);
    const card = container.firstChild as HTMLElement;
    
    fireEvent.mouseEnter(card);
    expect(screen.getByText('Use Template')).toBeInTheDocument();
  });

  it('renders placeholder when no thumbnail', () => {
    const noThumbTemplate = { ...mockTemplate, thumbnail: '' };
    render(<TemplateCard template={noThumbTemplate} />);
    
    expect(screen.getByText('No Preview')).toBeInTheDocument();
  });
});

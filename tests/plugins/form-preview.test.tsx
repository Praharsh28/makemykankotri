/**
 * Form Preview Component Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormPreview } from '@/plugins/form-builder/FormPreview';
import { featureFlags } from '@/core/feature-flags';

describe('Form Preview Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('form-builder');
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('form-builder');
      const { container } = render(<FormPreview data={{}} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders empty state when no data', () => {
      render(<FormPreview data={{}} />);
      expect(screen.getByText(/No data to preview/i)).toBeInTheDocument();
    });

    it('renders preview title', () => {
      const data: FormData = { name: 'John Doe' };
      render(<FormPreview data={data} />);
      expect(screen.getByText(/Preview/i)).toBeInTheDocument();
    });

    it('displays form data fields', () => {
      const data: FormData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('formats field names correctly', () => {
      const data: FormData = {
        firstName: 'John',
        lastName: 'Doe',
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('firstName')).toBeInTheDocument();
      expect(screen.getByText('lastName')).toBeInTheDocument();
    });

    it('handles undefined values', () => {
      const data: FormData = {
        name: 'John',
        email: undefined,
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.queryByText('email')).not.toBeInTheDocument();
    });

    it('handles null values', () => {
      const data: FormData = {
        name: 'John',
        phone: null,
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.queryByText('phone')).not.toBeInTheDocument();
    });

    it('handles empty string values', () => {
      const data: FormData = {
        name: 'John',
        notes: '',
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.queryByText('notes')).not.toBeInTheDocument();
    });

    it('displays number values', () => {
      const data: FormData = {
        age: 25,
        guests: 150,
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('displays boolean values', () => {
      const data: FormData = {
        acceptTerms: true,
        newsletter: false,
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('displays date values formatted', () => {
      const data: FormData = {
        weddingDate: '2025-12-25',
      };
      render(<FormPreview data={data} />);
      expect(screen.getByText(/Dec|December/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies design system classes', () => {
      const data: FormData = { name: 'John' };
      const { container } = render(<FormPreview data={data} />);
      const preview = container.querySelector('.bg-white');
      expect(preview).toBeInTheDocument();
    });

    it('has proper spacing', () => {
      const data: FormData = { name: 'John', email: 'john@example.com' };
      const { container } = render(<FormPreview data={data} />);
      const preview = container.querySelector('.space-y-3');
      expect(preview).toBeInTheDocument();
    });
  });

  describe('Custom Title', () => {
    it('renders custom title when provided', () => {
      const data: FormData = { name: 'John' };
      render(<FormPreview data={data} title="Custom Preview" />);
      expect(screen.getByText('Custom Preview')).toBeInTheDocument();
    });

    it('uses default title when not provided', () => {
      const data: FormData = { name: 'John' };
      render(<FormPreview data={data} />);
      expect(screen.getByText(/Preview/i)).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    it('updates when data changes', () => {
      const { rerender } = render(<FormPreview data={{ name: 'John' }} />);
      expect(screen.getByText('John')).toBeInTheDocument();

      rerender(<FormPreview data={{ name: 'Jane' }} />);
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.queryByText('John')).not.toBeInTheDocument();
    });

    it('updates when fields are added', () => {
      const { rerender } = render(<FormPreview data={{ name: 'John' }} />);
      expect(screen.queryByText('email')).not.toBeInTheDocument();

      rerender(<FormPreview data={{ name: 'John', email: 'john@example.com' }} />);
      expect(screen.getByText('email')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('updates when fields are removed', () => {
      const { rerender } = render(
        <FormPreview data={{ name: 'John', email: 'john@example.com' }} />
      );
      expect(screen.getByText('email')).toBeInTheDocument();

      rerender(<FormPreview data={{ name: 'John' }} />);
      expect(screen.queryByText('email')).not.toBeInTheDocument();
    });
  });
});

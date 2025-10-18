/**
 * Share Button Component Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from '@/plugins/template-renderer/ShareButton';
import { featureFlags } from '@/core/feature-flags';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('Share Button Component', () => {
  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('template-renderer');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('template-renderer');
      const { container } = render(<ShareButton url="https://example.com/test" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders share button', () => {
      render(<ShareButton url="https://example.com/test" />);
      expect(screen.getByText(/share/i)).toBeInTheDocument();
    });

    it('shows URL in display', () => {
      render(<ShareButton url="https://example.com/preview/test-123" />);
      expect(screen.getByText(/test-123/)).toBeInTheDocument();
    });
  });

  describe('Copy to Clipboard', () => {
    it('copies URL to clipboard on button click', async () => {
      const testUrl = 'https://example.com/preview/test-slug';
      render(<ShareButton url={testUrl} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testUrl);
      });
    });

    it('shows success message after copy', async () => {
      render(<ShareButton url="https://example.com/test" />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });

    it('shows success message initially', async () => {
      render(<ShareButton url="https://example.com/test" />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });

    it('shows error on clipboard failure', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
      writeTextSpy.mockRejectedValueOnce(new Error('Failed'));

      render(<ShareButton url="https://example.com/test" />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      
      await fireEvent.click(copyButton);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /copy/i });
        expect(button.textContent).toContain('Failed');
      });

      writeTextSpy.mockRestore();
    });
  });

  describe('Share Options', () => {
    it('shows share options when share button clicked', () => {
      render(<ShareButton url="https://example.com/test" showShareOptions />);

      const shareButton = screen.getByText(/show share options/i);
      fireEvent.click(shareButton);

      expect(screen.getByText(/whatsapp/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });

    it('generates WhatsApp share URL', () => {
      render(<ShareButton url="https://example.com/preview/test" showShareOptions />);

      const shareButton = screen.getByText(/show share options/i);
      fireEvent.click(shareButton);

      const whatsappLink = screen.getByText(/whatsapp/i).closest('a');
      const href = whatsappLink?.getAttribute('href') || '';
      expect(href).toContain('wa.me');
      expect(href).toContain('test');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ShareButton url="https://example.com/test" />);
      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveAttribute('aria-label');
    });

    it('shows focus states', () => {
      render(<ShareButton url="https://example.com/test" />);
      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });
});

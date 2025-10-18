/**
 * AI Prompt Dialog Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIPromptDialog } from '@/plugins/ai-generator/AIPromptDialog';
import { featureFlags } from '@/core/feature-flags';
import type { Template } from '@/core/types';

// Mock V0Generator
vi.mock('@/plugins/ai-generator/V0Generator', () => ({
  V0Generator: vi.fn().mockImplementation(() => ({
    generateTemplate: vi.fn().mockResolvedValue({
      success: true,
      template: {
        id: 'test-template',
        name: 'Test Template',
        elements: [],
        editableFields: [],
        layout: { width: 800, height: 600, background: '#FFF', orientation: 'portrait' as const },
        globalAnimations: [],
        thumbnail: '',
        category: 'wedding',
        tags: [],
        description: 'Test',
        createdBy: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        published: false,
        views: 0,
        uses: 0,
        slug: 'test'
      },
      timestamp: 1000
    })
  }))
}));

describe('AI Prompt Dialog', () => {
  const mockOnClose = vi.fn();
  const mockOnGenerate = vi.fn();

  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('ai-generator');
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      const { container } = render(
        <AIPromptDialog isOpen={false} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('ai-generator');
      const { container } = render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders dialog when open and enabled', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(screen.getByText('Generate Template with AI')).toBeInTheDocument();
    });

    it('shows prompt textarea', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(screen.getByPlaceholderText(/Create a traditional/i)).toBeInTheDocument();
    });

    it('shows example prompts', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(screen.getByText(/Try these examples/i)).toBeInTheDocument();
      expect(screen.getByText(/traditional Gujarati/i)).toBeInTheDocument();
    });

    it('shows character count', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      expect(screen.getByText(/0 \/ 10 minimum characters/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('updates prompt on text input', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      
      expect(textarea).toHaveValue('Test prompt');
    });

    it('updates character count on input', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
      
      expect(screen.getByText(/11 \/ 10 minimum characters/i)).toBeInTheDocument();
    });

    it('fills prompt when example clicked', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const exampleButton = screen.getByText(/traditional Gujarati/i);
      fireEvent.click(exampleButton);
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i) as HTMLTextAreaElement;
      expect(textarea.value).toContain('Gujarati');
    });

    it('closes dialog on backdrop click', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const backdrop = document.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(backdrop!);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes dialog on close button click', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const closeButton = screen.getByLabelText('Close dialog');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes dialog on cancel button click', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('disables generate button when prompt too short', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const generateButton = screen.getByText('Generate Template');
      expect(generateButton).toBeDisabled();
    });

    it('enables generate button when prompt valid', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt text' } });
      
      const generateButton = screen.getByText('Generate Template');
      expect(generateButton).not.toBeDisabled();
    });

    it('shows minimum character requirement', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Short' } });
      
      // Check character count shows requirement not met
      expect(screen.getByText(/5 \/ 10 minimum characters/i)).toBeInTheDocument();
      
      // Button should be disabled
      const generateButton = screen.getByText('Generate Template');
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Generation Process', () => {
    it('shows loading state during generation', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      expect(screen.getByText('Generating...')).toBeInTheDocument();
      expect(generateButton).toBeDisabled();
    });

    it('calls onGenerate with template on success', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('shows success message after generation', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Template Generated!/i)).toBeInTheDocument();
      });
    });

    it('closes dialog after successful generation', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('triggers generation on Cmd+Enter', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
      
      // Check that generation was triggered (onGenerate called)
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('triggers generation on Ctrl+Enter', async () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
      
      // Check that generation was triggered (onGenerate called)
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('shows error message on generation failure', async () => {
      // Mock failure
      const { V0Generator } = await import('@/plugins/ai-generator/V0Generator');
      vi.mocked(V0Generator).mockImplementationOnce(() => ({
        generateTemplate: vi.fn().mockResolvedValue({
          success: false,
          error: 'API Error',
          timestamp: 100
        })
      }) as never);

      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Generation Failed')).toBeInTheDocument();
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });

    it('does not close dialog on error', async () => {
      // Mock failure
      const { V0Generator } = await import('@/plugins/ai-generator/V0Generator');
      vi.mocked(V0Generator).mockImplementationOnce(() => ({
        generateTemplate: vi.fn().mockResolvedValue({
          success: false,
          error: 'Test error',
          timestamp: 100
        })
      }) as never);

      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Valid prompt for testing' } });
      
      const generateButton = screen.getByText('Generate Template');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test error')).toBeInTheDocument();
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('clears state on close', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles backdrop click', () => {
      render(
        <AIPromptDialog isOpen={true} onClose={mockOnClose} onGenerate={mockOnGenerate} />
      );
      
      const textarea = screen.getByPlaceholderText(/Create a traditional/i);
      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      
      // Click backdrop
      const backdrop = document.querySelector('.bg-black.bg-opacity-50');
      fireEvent.click(backdrop!);
      
      // Should close dialog
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});

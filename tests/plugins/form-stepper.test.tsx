/**
 * Form Stepper (Multi-step Forms) Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormStepper } from '@/plugins/form-builder/FormStepper';
import { featureFlags } from '@/core/feature-flags';

describe('Form Stepper Component', () => {
  const mockSteps = [
    { id: 'step1', title: 'Personal Info', fields: ['name', 'email'] },
    { id: 'step2', title: 'Wedding Details', fields: ['date', 'venue'] },
    { id: 'step3', title: 'Review', fields: [] },
  ];

  beforeEach(() => {
    featureFlags.clear();
    featureFlags.enable('form-builder');
  });

  describe('Rendering', () => {
    it('renders nothing when feature flag disabled', () => {
      featureFlags.disable('form-builder');
      const { container } = render(
        <FormStepper steps={mockSteps} currentStep={0} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders all step titles', () => {
      render(<FormStepper steps={mockSteps} currentStep={0} />);
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Wedding Details')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });

    it('highlights current step', () => {
      render(<FormStepper steps={mockSteps} currentStep={1} />);
      const currentStepNumber = screen.getByText('2').closest('div');
      expect(currentStepNumber).toHaveClass('bg-primary-500');
    });

    it('shows completed steps', () => {
      render(<FormStepper steps={mockSteps} currentStep={2} completedSteps={[0, 1]} />);
      const checkmarks = screen.getAllByTestId('checkmark-icon');
      expect(checkmarks).toHaveLength(2);
      const step1Number = checkmarks[0].closest('div');
      expect(step1Number).toHaveClass('bg-green-500');
    });
  });

  describe('Progress Indicator', () => {
    it('shows progress percentage', () => {
      render(<FormStepper steps={mockSteps} currentStep={1} />);
      expect(screen.getByText(/50%|2 of 3/i)).toBeInTheDocument();
    });

    it('shows progress bar', () => {
      const { container } = render(<FormStepper steps={mockSteps} currentStep={1} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('updates progress bar width', () => {
      const { container } = render(<FormStepper steps={mockSteps} currentStep={1} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('style', expect.stringContaining('67%'));
    });
  });

  describe('Navigation', () => {
    it('calls onStepChange when step clicked', () => {
      const onStepChange = vi.fn();
      render(
        <FormStepper
          steps={mockSteps}
          currentStep={0}
          onStepChange={onStepChange}
          completedSteps={[0]}
        />
      );

      fireEvent.click(screen.getByText('Wedding Details'));
      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('does not allow jumping to incomplete steps', () => {
      const onStepChange = vi.fn();
      render(
        <FormStepper
          steps={mockSteps}
          currentStep={0}
          onStepChange={onStepChange}
          completedSteps={[]}
        />
      );

      fireEvent.click(screen.getByText('Review'));
      expect(onStepChange).not.toHaveBeenCalled();
    });

    it('allows clicking previous steps', () => {
      const onStepChange = vi.fn();
      render(
        <FormStepper
          steps={mockSteps}
          currentStep={2}
          onStepChange={onStepChange}
          completedSteps={[0, 1]}
        />
      );

      fireEvent.click(screen.getByText('Personal Info'));
      expect(onStepChange).toHaveBeenCalledWith(0);
    });
  });

  describe('Step Numbers', () => {
    it('shows step numbers', () => {
      render(<FormStepper steps={mockSteps} currentStep={0} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows checkmark for completed steps', () => {
      render(<FormStepper steps={mockSteps} currentStep={2} completedSteps={[0, 1]} />);
      const checkmarks = screen.getAllByTestId('checkmark-icon');
      expect(checkmarks).toHaveLength(2);
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile styles', () => {
      const { container } = render(<FormStepper steps={mockSteps} currentStep={0} />);
      expect(container.querySelector('.flex-col')).toBeInTheDocument();
    });

    it('hides step labels on mobile when specified', () => {
      render(<FormStepper steps={mockSteps} currentStep={0} hideLabelsOnMobile />);
      const label = screen.getByText('Personal Info');
      expect(label.parentElement).toHaveClass('hidden');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<FormStepper steps={mockSteps} currentStep={1} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('marks current step with aria-current', () => {
      render(<FormStepper steps={mockSteps} currentStep={1} />);
      const currentStep = screen.getByText('Wedding Details').closest('button');
      expect(currentStep).toHaveAttribute('aria-current', 'step');
    });

    it('disables future steps', () => {
      render(<FormStepper steps={mockSteps} currentStep={0} completedSteps={[]} />);
      const futureStep = screen.getByText('Review').closest('button');
      expect(futureStep).toBeDisabled();
    });
  });
});

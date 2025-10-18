/**
 * Form Stepper Component
 * Multi-step form navigation with progress indicator
 */

import React from 'react';
import { featureFlags } from '@/core/feature-flags';

export interface FormStep {
  id: string;
  title: string;
  fields: string[];
}

export interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
  completedSteps?: number[];
  onStepChange?: (stepIndex: number) => void;
  hideLabelsOnMobile?: boolean;
}

export function FormStepper({
  steps,
  currentStep,
  completedSteps = [],
  onStepChange,
  hideLabelsOnMobile = false,
}: FormStepperProps) {
  // Check feature flag
  if (!featureFlags.isEnabled('form-builder')) {
    return null;
  }

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleStepClick = (stepIndex: number) => {
    if (!onStepChange) return;

    // Allow clicking current step, previous steps, or next step if current is completed
    const canNavigate =
      stepIndex <= currentStep ||
      completedSteps.includes(stepIndex - 1);

    if (canNavigate) {
      onStepChange(stepIndex);
    }
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status: string): string => {
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 text-white`;
      case 'current':
        return `${baseClasses} bg-primary-500 text-white ring-4 ring-primary-200`;
      case 'upcoming':
        return `${baseClasses} bg-neutral-200 text-neutral-500`;
      default:
        return baseClasses;
    }
  };

  return (
    <nav role="navigation" aria-label="Form progress" className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-full bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = index <= currentStep || completedSteps.includes(index - 1);
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={`
                  flex items-center gap-3 group
                  ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  ${isCurrent ? '' : 'opacity-75 hover:opacity-100'}
                `}
              >
                {/* Step Number/Checkmark */}
                <div className={getStepClasses(status)}>
                  {status === 'completed' ? (
                    <svg
                      data-testid="checkmark-icon"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div
                  className={`
                    text-left
                    ${hideLabelsOnMobile ? 'hidden sm:block' : ''}
                  `}
                >
                  <div
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-primary-700' : 'text-neutral-700'}
                    `}
                  >
                    {step.title}
                  </div>
                  {step.fields.length > 0 && (
                    <div className="text-xs text-neutral-500">
                      {step.fields.length} field{step.fields.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex flex-1 mx-4">
                  <div
                    className={`
                      h-0.5 flex-1
                      ${completedSteps.includes(index) ? 'bg-green-500' : 'bg-neutral-300'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

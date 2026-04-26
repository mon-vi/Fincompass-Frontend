import { cn } from '@/utils/cn';
import { TOTAL_STEPS, STEP_META } from '../store/onboardingStore';
import type { OnboardingStep } from '../store/onboardingStore';

interface ProgressIndicatorProps {
  currentStep: OnboardingStep;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as OnboardingStep);

  return (
    <nav>
      <ol className="flex items-center justify-between">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isCompleted && 'bg-indigo-600 text-white',
                    isCurrent &&
                      'border-2 border-indigo-600 bg-white text-indigo-700 shadow-sm',
                    !isCompleted &&
                      !isCurrent &&
                      'border-2 border-slate-200 bg-white text-slate-400',
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1.5 hidden text-xs font-medium sm:block',
                    isCurrent ? 'text-indigo-700' : 'text-slate-400',
                  )}
                >
                  {STEP_META[step].label}
                </span>
              </div>

              {step < TOTAL_STEPS && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-10 sm:w-20',
                    step < currentStep ? 'bg-indigo-600' : 'bg-slate-200',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

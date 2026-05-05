import { cn } from '@/utils/cn';
import { TOTAL_STEPS, STEP_META } from '../store/onboardingStore';
import type { OnboardingStep } from '../store/onboardingStore';

interface ProgressIndicatorProps {
  currentStep: OnboardingStep;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as OnboardingStep);

  return (
    <nav aria-label="Onboarding progress">
      <ol className="flex items-center gap-1 sm:gap-0">
        {steps.map((step, i) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isLast = i === steps.length - 1;

          return (
            <li key={step} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-9 sm:w-9',
                    isCompleted && 'bg-emerald-500 text-white',
                    isCurrent && 'bg-[#12355b] text-white shadow-md ring-4 ring-[#12355b]/15',
                    !isCompleted && !isCurrent && 'bg-slate-100 text-slate-400 ring-1 ring-slate-200',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
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
                    'hidden text-[10px] font-semibold leading-none sm:block',
                    isCurrent ? 'text-[#12355b]' : isCompleted ? 'text-emerald-600' : 'text-slate-400',
                  )}
                >
                  {STEP_META[step].label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 rounded-full transition-all duration-300 sm:mx-1.5',
                    step < currentStep ? 'bg-emerald-400' : 'bg-slate-200',
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

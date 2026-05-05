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
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={step}>
              <div
                className={cn(
                  'h-full rounded-2xl border p-3 transition-all',
                  isCompleted && 'border-emerald-200 bg-emerald-50',
                  isCurrent && 'border-[#12355b]/30 bg-[#12355b]/5 shadow-sm shadow-slate-900/[0.04]',
                  !isCompleted && !isCurrent && 'border-slate-200 bg-slate-50',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-black transition-colors',
                    isCompleted && 'bg-emerald-600 text-white',
                    isCurrent &&
                      'bg-[#12355b] text-white shadow-sm',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-white text-slate-400 ring-1 ring-slate-200',
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
                <span className={cn('mt-3 block text-xs font-bold', isCurrent ? 'text-[#12355b]' : isCompleted ? 'text-emerald-700' : 'text-slate-500')}>
                  {STEP_META[step].label}
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  {isCompleted ? 'Saved' : isCurrent ? 'Now' : 'Next'}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

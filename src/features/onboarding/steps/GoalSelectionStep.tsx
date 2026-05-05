import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Alert } from '@/components/ui/Alert';
import { step1Schema, GOAL_OPTIONS, type Step1Data, type GoalType } from '../validation';

const GOAL_ICONS: Record<GoalType, string> = {
  pay_off_debt: '💳',
  emergency_fund: '🛡️',
  save_for_purchase: '🏠',
  grow_wealth: '📈',
  improve_cash_flow: '💵',
};

interface GoalSelectionStepProps {
  onComplete: (data: Step1Data) => void;
  defaultValues?: Partial<Step1Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
  formId?: string;
}

export function GoalSelectionStep({
  onComplete,
  defaultValues,
  isSubmitting,
  submitError,
  formId,
}: GoalSelectionStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { goals: [], ...defaultValues },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onComplete)} noValidate>
      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-3">
            {GOAL_OPTIONS.map(({ value, label, description }) => {
              const isSelected = (field.value ?? []).includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const current = field.value ?? [];
                    field.onChange(
                      isSelected
                        ? current.filter((v) => v !== value)
                        : [...current, value],
                    );
                  }}
                  disabled={isSubmitting}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all sm:gap-4',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/20',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    isSelected
                      ? 'border-[#12355b]/50 bg-[#12355b]/5 shadow-sm ring-2 ring-[#12355b]/10'
                      : 'border-slate-200 bg-white hover:border-[#12355b]/20 hover:bg-slate-50',
                  )}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl"
                    aria-hidden="true"
                  >
                    {GOAL_ICONS[value]}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-bold leading-5',
                        isSelected ? 'text-[#12355b]' : 'text-slate-900',
                      )}
                    >
                      {label}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
                  </div>

                  {isSelected && (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#12355b]"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      />

      {errors.goals && (
        <p className="mt-4 text-sm font-medium text-red-600" role="alert">
          {errors.goals.message}
        </p>
      )}

      {submitError && (
        <Alert variant="error" className="mt-4">
          {submitError.message ?? 'Failed to save your goals. Please try again.'}
        </Alert>
      )}
    </form>
  );
}

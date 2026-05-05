import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Alert } from '@/components/ui/Alert';
import { StepNavigation } from '../components/StepNavigation';
import { step1Schema, GOAL_OPTIONS, type Step1Data } from '../validation';

interface GoalSelectionStepProps {
  onComplete: (data: Step1Data) => void;
  defaultValues?: Partial<Step1Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
}

export function GoalSelectionStep({ onComplete, defaultValues, isSubmitting, submitError }: GoalSelectionStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { goals: [], ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Checkpoint 1</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">What should FinCompass help you improve first?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select every goal that fits. We will use this to shape your first dashboard and action plan.
        </p>
      </div>

      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3 sm:grid-cols-2">
            {GOAL_OPTIONS.map(({ value, label, description }) => {
              const isSelected = (field.value ?? []).includes(value);
              return (
                <label
                  key={value}
                  className={cn(
                    'flex min-h-32 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                    isSelected
                      ? 'border-[#12355b]/40 bg-[#12355b]/5 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
                    checked={isSelected}
                    onChange={(e) => {
                      const current = field.value ?? [];
                      field.onChange(
                        e.target.checked
                          ? [...current, value]
                          : current.filter((v) => v !== value),
                      );
                    }}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-bold',
                        isSelected ? 'text-[#12355b]' : 'text-slate-950',
                      )}
                    >
                      {label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      />

      {errors.goals && (
        <p className="text-sm text-red-600" role="alert">
          {errors.goals.message}
        </p>
      )}

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your goals. Please try again.'}
        </Alert>
      )}

      <StepNavigation isSubmitting={isSubmitting} />
    </form>
  );
}

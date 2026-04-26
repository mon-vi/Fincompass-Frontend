import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { StepNavigation } from '../components/StepNavigation';
import { step1Schema, GOAL_OPTIONS, type Step1Data } from '../validation';

interface GoalSelectionStepProps {
  onComplete: (data: Step1Data) => void;
  defaultValues?: Partial<Step1Data>;
}

export function GoalSelectionStep({ onComplete, defaultValues }: GoalSelectionStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { goals: [], ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">What are your financial goals?</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select all that apply — we'll tailor your plan accordingly.
        </p>
      </div>

      <Controller
        name="goals"
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            {GOAL_OPTIONS.map(({ value, label, description }) => {
              const isSelected = (field.value ?? []).includes(value);
              return (
                <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50',
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
                        'text-sm font-medium',
                        isSelected ? 'text-indigo-900' : 'text-slate-900',
                      )}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-slate-500">{description}</p>
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

      <StepNavigation />
    </form>
  );
}

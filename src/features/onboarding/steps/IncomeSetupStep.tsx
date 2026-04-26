import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { StepNavigation } from '../components/StepNavigation';
import { step2Schema, INCOME_TYPE_OPTIONS, type Step2Data } from '../validation';

interface IncomeSetupStepProps {
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
  defaultValues?: Partial<Step2Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
}

export function IncomeSetupStep({ onComplete, onBack, defaultValues, isSubmitting, submitError }: IncomeSetupStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema) as Resolver<Step2Data>,
    defaultValues,
  });

  const selectedType = watch('incomeType');

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">What's your monthly income?</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your average take-home pay after taxes.
        </p>
      </div>

      <Input
        label="Monthly take-home income"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="3,000"
        error={errors.monthlyIncome?.message}
        {...register('monthlyIncome')}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Income type</p>
        <div className="space-y-2">
          {INCOME_TYPE_OPTIONS.map(({ value, label, description }) => {
            const isSelected = selectedType === value;
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
                  type="radio"
                  value={value}
                  className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  {...register('incomeType')}
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
        {errors.incomeType && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.incomeType.message}
          </p>
        )}
      </div>

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your income details. Please try again.'}
        </Alert>
      )}

      <StepNavigation onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}

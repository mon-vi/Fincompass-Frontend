import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Alert } from '@/components/ui/Alert';
import { step2Schema, INCOME_TYPE_OPTIONS, type Step2Data } from '../validation';

interface IncomeSetupStepProps {
  onComplete: (data: Step2Data) => void;
  onBack?: () => void;
  defaultValues?: Partial<Step2Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
  formId?: string;
}

export function IncomeSetupStep({
  onComplete,
  defaultValues,
  isSubmitting,
  submitError,
  formId,
}: IncomeSetupStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema) as Resolver<Step2Data>,
    defaultValues,
  });

  const selectedType = useWatch({ control, name: 'incomeType' });

  return (
    <form id={formId} onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      {/* Large currency input */}
      <div>
        <label
          htmlFor="monthlyIncome"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Monthly take-home amount
        </label>
        <div
          className={cn(
            'flex items-center overflow-hidden rounded-2xl border bg-white shadow-sm transition-all',
            'focus-within:border-[#2b6d91] focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
            errors.monthlyIncome ? 'border-red-400' : 'border-slate-300/90 hover:border-slate-400',
          )}
        >
          <span className="select-none pl-5 text-2xl font-bold text-slate-400">$</span>
          <input
            id="monthlyIncome"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder="3,000"
            disabled={isSubmitting}
            aria-invalid={!!errors.monthlyIncome}
            aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : 'monthlyIncome-hint'}
            className="min-h-16 flex-1 bg-transparent px-3 text-2xl font-bold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-300 disabled:cursor-not-allowed"
            {...register('monthlyIncome')}
          />
        </div>
        {errors.monthlyIncome ? (
          <p id="monthlyIncome-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {errors.monthlyIncome.message}
          </p>
        ) : (
          <p id="monthlyIncome-hint" className="mt-2 text-xs text-slate-500">
            What actually lands in your account each month, after tax.
          </p>
        )}
      </div>

      {/* Income type */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">What type of income is this?</p>
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
          {INCOME_TYPE_OPTIONS.map(({ value, label, description }) => {
            const isSelected = selectedType === value;
            return (
              <label
                key={value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all',
                  'focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                  isSelected
                    ? 'border-[#12355b]/50 bg-[#12355b]/5 shadow-sm ring-2 ring-[#12355b]/10'
                    : 'border-slate-200 bg-white hover:border-[#12355b]/20 hover:bg-slate-50',
                )}
              >
                <input
                  type="radio"
                  value={value}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
                  {...register('incomeType')}
                />
                <div>
                  <p className={cn('text-sm font-bold', isSelected ? 'text-[#12355b]' : 'text-slate-900')}>
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs leading-4 text-slate-500">{description}</p>
                </div>
              </label>
            );
          })}
        </div>
        {errors.incomeType && (
          <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {errors.incomeType.message}
          </p>
        )}
      </div>

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your income details. Please try again.'}
        </Alert>
      )}
    </form>
  );
}

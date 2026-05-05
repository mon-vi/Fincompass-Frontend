import { useForm, Controller, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { step3Schema, DEBT_TYPE_OPTIONS, type Step3Data } from '../validation';

interface DebtSetupStepProps {
  onComplete: (data: Step3Data) => void;
  onBack?: () => void;
  defaultValues?: Partial<Step3Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
  formId?: string;
}

export function DebtSetupStep({
  onComplete,
  defaultValues,
  isSubmitting,
  submitError,
  formId,
}: DebtSetupStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema) as Resolver<Step3Data>,
    defaultValues: {
      hasDebts: defaultValues?.hasDebts ?? false,
      totalDebtBalance: defaultValues?.totalDebtBalance,
      averageInterestRate: defaultValues?.averageInterestRate,
      primaryDebtType: defaultValues?.primaryDebtType,
    },
  });

  const hasDebts = useWatch({ control, name: 'hasDebts' });
  const selectedDebtType = useWatch({ control, name: 'primaryDebtType' });

  return (
    <form id={formId} onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      {/* Yes / No toggle */}
      <Controller
        name="hasDebts"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => field.onChange(true)}
              disabled={isSubmitting}
              className={cn(
                'min-h-20 rounded-2xl border px-4 py-4 text-sm font-bold transition-all',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
                hasDebts === true
                  ? 'border-[#12355b]/50 bg-[#12355b]/5 text-[#12355b] shadow-sm ring-2 ring-[#12355b]/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#12355b]/20 hover:bg-slate-50',
              )}
            >
              <span className="block text-xl mb-1">💳</span>
              Yes, I have debts
            </button>
            <button
              type="button"
              onClick={() => field.onChange(false)}
              disabled={isSubmitting}
              className={cn(
                'min-h-20 rounded-2xl border px-4 py-4 text-sm font-bold transition-all',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
                hasDebts === false
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-500/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <span className="block text-xl mb-1">✅</span>
              No debts
            </button>
          </div>
        )}
      />

      {/* Debt details — shown only when hasDebts is true */}
      {hasDebts && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.03] sm:p-5">
          <Input
            label="Total debt balance ($)"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder="15,000"
            disabled={isSubmitting}
            error={errors.totalDebtBalance?.message}
            {...register('totalDebtBalance')}
          />

          <Input
            label="Average interest rate (%)"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.1"
            placeholder="18.5"
            hint="Optional — helps calculate payoff timelines"
            disabled={isSubmitting}
            error={errors.averageInterestRate?.message}
            {...register('averageInterestRate')}
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Primary debt type</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEBT_TYPE_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                    'focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                    selectedDebtType === value
                      ? 'border-[#12355b]/40 bg-[#12355b]/5 text-[#12355b]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    value={value}
                    disabled={isSubmitting}
                    className="h-4 w-4 shrink-0 border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
                    {...register('primaryDebtType')}
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.primaryDebtType?.message && (
              <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {errors.primaryDebtType.message}
              </p>
            )}
          </div>
        </div>
      )}

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your debt details. Please try again.'}
        </Alert>
      )}
    </form>
  );
}

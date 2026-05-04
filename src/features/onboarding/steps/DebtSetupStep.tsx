import { useForm, Controller, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { StepNavigation } from '../components/StepNavigation';
import { step3Schema, DEBT_TYPE_OPTIONS, type Step3Data } from '../validation';

interface DebtSetupStepProps {
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
  defaultValues?: Partial<Step3Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
}

export function DebtSetupStep({ onComplete, onBack, defaultValues, isSubmitting, submitError }: DebtSetupStepProps) {
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
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Checkpoint 3</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Tell us about your debt picture.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Include credit cards, loans, and other balances. If you are debt-free, we will celebrate that too.
        </p>
      </div>

      <Controller
        name="hasDebts"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => field.onChange(true)}
              className={cn(
                'min-h-20 rounded-2xl border px-4 py-4 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/15',
                hasDebts === true
                  ? 'border-[#12355b]/40 bg-[#12355b]/5 text-[#12355b] shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              Yes, I have debts
            </button>
            <button
              type="button"
              onClick={() => field.onChange(false)}
              className={cn(
                'min-h-20 rounded-2xl border px-4 py-4 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/15',
                hasDebts === false
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              No debts
            </button>
          </div>
        )}
      />

      {hasDebts && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <Input
            label="Total debt balance ($)"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder="15,000"
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
            error={errors.averageInterestRate?.message}
            {...register('averageInterestRate')}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Primary debt type</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {DEBT_TYPE_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                    selectedDebtType === value
                      ? 'border-[#12355b]/40 bg-[#12355b]/5 text-[#12355b]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    value={value}
                    className="h-4 w-4 shrink-0 border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
                    {...register('primaryDebtType')}
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.primaryDebtType?.message && (
              <p className="mt-1 text-sm text-red-600" role="alert">
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

      <StepNavigation onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}

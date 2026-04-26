import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/Input';
import { StepNavigation } from '../components/StepNavigation';
import { step3Schema, DEBT_TYPE_OPTIONS, type Step3Data } from '../validation';

interface DebtSetupStepProps {
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
  defaultValues?: Partial<Step3Data>;
}

export function DebtSetupStep({ onComplete, onBack, defaultValues }: DebtSetupStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      hasDebts: defaultValues?.hasDebts ?? false,
      totalDebtBalance: defaultValues?.totalDebtBalance,
      averageInterestRate: defaultValues?.averageInterestRate,
      primaryDebtType: defaultValues?.primaryDebtType,
    },
  });

  const hasDebts = watch('hasDebts');
  const selectedDebtType = watch('primaryDebtType');

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Do you have any debts?</h2>
        <p className="mt-1 text-sm text-slate-500">
          Include credit cards, loans, and any outstanding balances.
        </p>
      </div>

      <Controller
        name="hasDebts"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => field.onChange(true)}
              className={cn(
                'rounded-xl border px-4 py-4 text-sm font-medium transition-colors',
                hasDebts === true
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50',
              )}
            >
              Yes, I have debts
            </button>
            <button
              type="button"
              onClick={() => field.onChange(false)}
              className={cn(
                'rounded-xl border px-4 py-4 text-sm font-medium transition-colors',
                hasDebts === false
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50',
              )}
            >
              No debts
            </button>
          </div>
        )}
      />

      {hasDebts && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEBT_TYPE_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                    selectedDebtType === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    value={value}
                    className="h-3.5 w-3.5 shrink-0 border-slate-300 text-indigo-600 focus:ring-indigo-500"
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

      <StepNavigation onBack={onBack} />
    </form>
  );
}

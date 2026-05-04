import { useForm, useWatch, type Resolver } from 'react-hook-form';
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
    control,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema) as Resolver<Step2Data>,
    defaultValues,
  });

  const selectedType = useWatch({ control, name: 'incomeType' });

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Checkpoint 2</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Add your monthly take-home income.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use your average after-tax income. A close estimate is enough to build a useful first plan.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Input
          label="Monthly take-home income"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          placeholder="3000"
          hint="This should be what actually lands in your account each month."
          error={errors.monthlyIncome?.message}
          {...register('monthlyIncome')}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-slate-800">What best describes it?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {INCOME_TYPE_OPTIONS.map(({ value, label, description }) => {
            const isSelected = selectedType === value;
            return (
              <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                    isSelected
                      ? 'border-[#12355b]/40 bg-[#12355b]/5 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                <input
                  type="radio"
                  value={value}
                  className="mt-0.5 h-5 w-5 shrink-0 border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
                  {...register('incomeType')}
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

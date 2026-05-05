import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Alert } from '@/components/ui/Alert';
import { step4Schema, EXPENSE_FIELDS, type Step4Data } from '../validation';

const EXPENSE_ICONS: Record<string, string> = {
  housing: '🏠',
  transportation: '🚗',
  food: '🛒',
  utilities: '⚡',
  other: '📦',
};

interface ExpenseSetupStepProps {
  onComplete: (data: Step4Data) => void;
  onBack?: () => void;
  defaultValues?: Partial<Step4Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
  formId?: string;
}

export function ExpenseSetupStep({
  onComplete,
  defaultValues,
  isSubmitting,
  submitError,
  formId,
}: ExpenseSetupStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema) as Resolver<Step4Data>,
    defaultValues: {
      housing: 0,
      transportation: 0,
      food: 0,
      utilities: 0,
      other: 0,
      ...defaultValues,
    },
  });

  const watched = useWatch({ control });
  const total = EXPENSE_FIELDS.reduce((sum, { name }) => sum + (Number(watched[name]) || 0), 0);

  return (
    <form id={formId} onSubmit={handleSubmit(onComplete)} noValidate className="space-y-3">
      {EXPENSE_FIELDS.map(({ name, label, placeholder }) => (
        <div key={name} className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-slate-200/70">
          <span
            className="mt-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12355b]/10 text-lg"
            aria-hidden="true"
          >
            {EXPENSE_ICONS[name]}
          </span>
          <div className="flex-1">
            <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">
              {label}
            </label>
            <div
              className={cn(
                'flex items-center overflow-hidden rounded-xl border bg-white shadow-sm transition-all',
                'focus-within:border-[#2b6d91] focus-within:ring-4 focus-within:ring-[#2b6d91]/15',
                errors[name] ? 'border-red-400' : 'border-slate-300/90 hover:border-slate-400',
              )}
            >
              <span className="select-none pl-3.5 text-sm font-semibold text-slate-400">$</span>
              <input
                id={name}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder={placeholder}
                disabled={isSubmitting}
                aria-invalid={!!errors[name]}
                className="min-h-11 flex-1 bg-transparent px-2 text-sm font-semibold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-300 disabled:cursor-not-allowed"
                {...register(name)}
              />
            </div>
            {errors[name] && (
              <p className="mt-1 text-xs font-medium text-red-600" role="alert">
                {errors[name]?.message}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Live running total */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#12355b]/10 bg-[#12355b]/5 px-4 py-3">
        <span className="text-sm font-semibold text-slate-700">Monthly total</span>
        <span className="text-xl font-black text-[#12355b]">${total.toLocaleString()}</span>
      </div>

      {submitError && (
        <Alert variant="error" className="mt-2">
          {submitError.message ?? 'Failed to save your expenses. Please try again.'}
        </Alert>
      )}
    </form>
  );
}

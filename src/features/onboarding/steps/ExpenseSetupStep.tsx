import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { StepNavigation } from '../components/StepNavigation';
import { step4Schema, EXPENSE_FIELDS, type Step4Data } from '../validation';

interface ExpenseSetupStepProps {
  onComplete: (data: Step4Data) => void;
  onBack: () => void;
  defaultValues?: Partial<Step4Data>;
  isSubmitting?: boolean;
  submitError?: Error | null;
}

export function ExpenseSetupStep({
  onComplete,
  onBack,
  defaultValues,
  isSubmitting,
  submitError,
}: ExpenseSetupStepProps) {
  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Checkpoint 4</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Estimate your monthly essentials.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Round numbers are fine. We just need enough to show your first budget and cash-flow picture.
        </p>
      </div>

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your profile. Please try again.'}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {EXPENSE_FIELDS.map(({ name, label, placeholder }) => (
          <Input
            key={name}
            label={`${label} ($)`}
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder={placeholder}
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </div>

      <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-medium leading-5 text-emerald-800 ring-1 ring-emerald-200">
        After this, FinCompass will prepare your dashboard. You can adjust every estimate later.
      </p>

      <StepNavigation onBack={onBack} isSubmitting={isSubmitting} isLastStep />
    </form>
  );
}

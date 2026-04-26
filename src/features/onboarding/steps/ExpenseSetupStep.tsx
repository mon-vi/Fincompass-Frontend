import { useForm } from 'react-hook-form';
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
    resolver: zodResolver(step4Schema),
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
    <form onSubmit={handleSubmit(onComplete)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Monthly expenses</h2>
        <p className="mt-1 text-sm text-slate-500">
          Estimate your major monthly costs. Leave at 0 if not applicable.
        </p>
      </div>

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Failed to save your profile. Please try again.'}
        </Alert>
      )}

      <div className="space-y-4">
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

      <p className="text-xs text-slate-400">
        These estimates help us build your initial financial picture. You can adjust them later.
      </p>

      <StepNavigation onBack={onBack} isSubmitting={isSubmitting} isLastStep />
    </form>
  );
}

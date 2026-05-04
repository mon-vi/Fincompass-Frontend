import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { debtSchema, DEBT_TYPE_LABELS, type DebtFormData } from '../validation';

interface DebtFormProps {
  defaultValues?: Partial<DebtFormData>;
  onSubmit: (data: DebtFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: Error | null;
  submitLabel?: string;
}

const DEBT_TYPES = Object.entries(DEBT_TYPE_LABELS) as [string, string][];

export function DebtForm({ defaultValues, onSubmit, onCancel, isSubmitting, submitError, submitLabel = 'Save' }: DebtFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema) as Resolver<DebtFormData>,
    defaultValues: { dueDayOfMonth: 1, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input label="Debt name" placeholder="e.g. Chase Freedom Visa" error={errors.name?.message} {...register('name')} />

      <Select label="Debt type" error={errors.type?.message} {...register('type')}>
        <option value="">Select type…</option>
        {DEBT_TYPES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Current balance ($)"
          type="number"
          inputMode="numeric"
          min="0"
          step="0.01"
          placeholder="8500"
          error={errors.balance?.message}
          {...register('balance')}
        />
        <Input
          label="Original balance ($)"
          type="number"
          inputMode="numeric"
          min="0"
          step="0.01"
          placeholder="11000"
          error={errors.originalBalance?.message}
          {...register('originalBalance')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Interest rate (% APR)"
          type="number"
          inputMode="decimal"
          min="0"
          max="100"
          step="0.01"
          placeholder="22.99"
          error={errors.interestRate?.message}
          {...register('interestRate')}
        />
        <Input
          label="Minimum payment ($)"
          type="number"
          inputMode="numeric"
          min="0"
          step="0.01"
          placeholder="200"
          error={errors.minimumPayment?.message}
          {...register('minimumPayment')}
        />
      </div>

      <Input
        label="Due day of month"
        type="number"
        inputMode="numeric"
        min="1"
        max="31"
        placeholder="15"
        hint="Day of the month the payment is due (1–31)"
        error={errors.dueDayOfMonth?.message}
        {...register('dueDayOfMonth')}
      />

      {submitError && (
        <Alert variant="error">{submitError.message ?? 'Something went wrong. Please try again.'}</Alert>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">{submitLabel}</Button>
      </div>
    </form>
  );
}


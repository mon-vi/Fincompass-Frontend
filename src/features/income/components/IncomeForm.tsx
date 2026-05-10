import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { incomeSchema, type IncomeFormData } from '../validation';
import { INCOME_TYPE_LABELS, INCOME_FREQUENCY_LABELS } from '../services';

interface IncomeFormProps {
  defaultValues?: Partial<IncomeFormData>;
  onSubmit: (data: IncomeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: Error | null;
  submitLabel?: string;
}

const TYPES = Object.entries(INCOME_TYPE_LABELS) as [string, string][];
const FREQUENCIES = Object.entries(INCOME_FREQUENCY_LABELS) as [string, string][];

export function IncomeForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
  submitLabel = 'Save',
}: IncomeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema) as Resolver<IncomeFormData>,
    defaultValues: {
      frequency: 'monthly',
      type: 'salary',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input
        label="Source name"
        placeholder="e.g. Day job, Freelance clients"
        error={errors.sourceName?.message}
        {...register('sourceName')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Type" error={errors.type?.message} {...register('type')}>
          {TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>

        <Select label="Frequency" error={errors.frequency?.message} {...register('frequency')}>
          {FREQUENCIES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      <Input
        label="Amount ($)"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount')}
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

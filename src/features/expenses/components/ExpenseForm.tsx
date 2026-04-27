import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { expenseSchema, type ExpenseFormData } from '../validation';
import { EXPENSE_CATEGORY_LABELS } from '../services';

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: Error | null;
  submitLabel?: string;
}

const CATEGORIES = Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][];

export function ExpenseForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
  submitLabel = 'Save',
}: ExpenseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema) as Resolver<ExpenseFormData>,
    defaultValues: {
      isRecurring: false,
      date: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
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
        <Input
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <Input
        label="Description"
        placeholder="e.g. Monthly rent"
        error={errors.description?.message}
        {...register('description')}
      />

      <Select label="Category" error={errors.category?.message} {...register('category')}>
        <option value="">Select category…</option>
        {CATEGORIES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          {...register('isRecurring')}
        />
        <span className="text-sm text-slate-700">Recurring monthly expense</span>
      </label>

      {submitError && (
        <Alert variant="error">{submitError.message ?? 'Something went wrong. Please try again.'}</Alert>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">{submitLabel}</Button>
      </div>
    </form>
  );
}

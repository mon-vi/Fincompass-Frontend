import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDeleteExpense } from '../hooks';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS } from '../services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Expense } from '../services';

interface ExpenseRowProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
}

export function ExpenseRow({ expense, onEdit }: ExpenseRowProps) {
  const remove = useDeleteExpense();

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
        {EXPENSE_CATEGORY_ICONS[expense.category]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{expense.description}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">{formatDate(expense.date, { dateStyle: 'medium' })}</span>
          <Badge variant="default" className="text-xs">{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
          {expense.isRecurring && <Badge variant="info" className="text-xs">Recurring</Badge>}
          {expense.source !== 'manual' && (
            <Badge variant="default" className="text-xs capitalize">{expense.source.replace('_', ' ')}</Badge>
          )}
        </div>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-900">
        {formatCurrency(expense.amount)}
      </span>

      <div className="flex shrink-0 gap-1">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>Edit</Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          isLoading={remove.isPending}
          onClick={() => {
            if (confirm('Delete this expense?')) {
              remove.mutate(expense.id);
            }
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

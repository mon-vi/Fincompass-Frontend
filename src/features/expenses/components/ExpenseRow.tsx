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
    <div className="flex flex-col gap-3 rounded-2xl px-2 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg">
        {EXPENSE_CATEGORY_ICONS[expense.category]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{expense.description}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">{formatDate(expense.date, { dateStyle: 'medium' })}</span>
          <Badge variant="default" className="text-xs">{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
          {expense.isRecurring && <Badge variant="info" className="text-xs">Recurring</Badge>}
          {expense.source !== 'manual' && (
            <Badge variant="default" className="text-xs capitalize">{expense.source.replace('_', ' ')}</Badge>
          )}
        </div>
      </div>

      <span className="shrink-0 text-base font-black tracking-tight text-slate-950 sm:text-sm">
        {formatCurrency(expense.amount)}
      </span>

      <div className="flex shrink-0 gap-1 sm:ml-auto">
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
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

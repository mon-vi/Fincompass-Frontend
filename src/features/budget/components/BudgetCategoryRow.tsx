import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { BudgetCategory } from '../services';

interface BudgetCategoryRowProps {
  category: BudgetCategory;
}

export function BudgetCategoryRow({ category }: BudgetCategoryRowProps) {
  const isOver = category.spent > category.budgeted;
  const pct = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
  const variant = isOver ? 'danger' : pct >= 85 ? 'warning' : 'default';

  return (
    <div className="space-y-2 rounded-2xl px-2 py-3 transition hover:bg-slate-50">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-lg leading-none">{category.icon}</span>
          <span className="text-sm font-bold text-slate-950">{category.name}</span>
          {isOver && (
            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">Over</span>
          )}
        </div>
        <div className="sm:text-right">
          <span className={cn('text-sm font-semibold', isOver ? 'text-red-600' : 'text-slate-900')}>
            {formatCurrency(category.spent)}
          </span>
          <span className="text-xs text-slate-400"> / {formatCurrency(category.budgeted)}</span>
        </div>
      </div>
      <ProgressBar value={category.spent} max={category.budgeted || 1} size="sm" variant={variant} />
    </div>
  );
}

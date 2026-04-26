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
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{category.icon}</span>
          <span className="text-sm font-medium text-slate-800">{category.name}</span>
          {isOver && (
            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">Over</span>
          )}
        </div>
        <div className="text-right">
          <span className={cn('text-sm font-semibold', isOver ? 'text-red-600' : 'text-slate-900')}>
            {formatCurrency(category.spent)}
          </span>
          <span className="text-xs text-slate-400"> / {formatCurrency(category.budgeted)}</span>
        </div>
      </div>
      <ProgressBar value={category.spent} max={category.budgeted} size="sm" variant={variant} />
    </div>
  );
}

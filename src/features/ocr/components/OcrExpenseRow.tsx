import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS } from '@/features/expenses/services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { OcrExtractedExpense } from '../services';

interface OcrExpenseRowProps {
  expense: OcrExtractedExpense;
  selected: boolean;
  onToggle: () => void;
}

export function OcrExpenseRow({ expense, selected, onToggle }: OcrExpenseRowProps) {
  const confidencePct = Math.round(expense.confidence * 100);
  const confidenceVariant = confidencePct >= 90 ? 'success' : confidencePct >= 70 ? 'warning' : 'danger';

  return (
    <label className={cn(
      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
      selected ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50',
    )}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />

      <span className="text-lg">{EXPENSE_CATEGORY_ICONS[expense.suggestedCategory]}</span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{expense.description}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">{formatDate(expense.date, { dateStyle: 'medium' })}</span>
          <Badge variant="default" className="text-xs">{EXPENSE_CATEGORY_LABELS[expense.suggestedCategory]}</Badge>
          <Badge variant={confidenceVariant} className="text-xs">{confidencePct}% confidence</Badge>
        </div>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-900">
        {formatCurrency(expense.amount)}
      </span>
    </label>
  );
}

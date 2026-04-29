import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS } from '@/features/expenses/services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { OcrExtractedItem } from '../services';

interface OcrExpenseRowProps {
  item: OcrExtractedItem;
  selected: boolean;
  onToggle: () => void;
  onChange: (item: OcrExtractedItem) => void;
}

export function OcrExpenseRow({ item, selected, onToggle, onChange }: OcrExpenseRowProps) {
  const confidencePct = Math.round(item.confidence * 100);
  const confidenceVariant = confidencePct >= 90 ? 'success' : confidencePct >= 70 ? 'warning' : 'danger';
  const isExpense = item.type === 'expense';

  const update = (patch: Partial<OcrExtractedItem>) => onChange({ ...item, ...patch } as OcrExtractedItem);

  return (
    <div className={cn(
      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
      selected ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50',
    )}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />

      <span className="text-lg">{isExpense ? EXPENSE_CATEGORY_ICONS[item.suggestedCategory] : '$'}</span>

      <div className="min-w-0 flex-1 space-y-2">
        <input
          value={item.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-900 focus:border-indigo-300 focus:bg-white focus:outline-none"
          aria-label="Description"
        />
        <div className="flex flex-wrap items-center gap-2">
          {isExpense ? (
            <span className="text-xs text-slate-400">{formatDate(item.date, { dateStyle: 'medium' })}</span>
          ) : item.dueDate ? (
            <span className="text-xs text-slate-400">Due {formatDate(item.dueDate, { dateStyle: 'medium' })}</span>
          ) : null}
          <Badge variant="default" className="text-xs">
            {isExpense ? EXPENSE_CATEGORY_LABELS[item.suggestedCategory] : item.debtType ?? 'Debt'}
          </Badge>
          <Badge variant={confidenceVariant} className="text-xs">{confidencePct}% confidence</Badge>
        </div>
      </div>

      <div className="w-32 shrink-0">
        <label className="sr-only" htmlFor={`ocr-amount-${item.id}`}>Amount</label>
        <input
          id={`ocr-amount-${item.id}`}
          type="number"
          min="0"
          step="0.01"
          value={item.amount}
          onChange={(e) => update({ amount: Number(e.target.value) })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold text-slate-900 focus:border-indigo-300 focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{formatCurrency(item.amount)}</p>
      </div>
    </div>
  );
}

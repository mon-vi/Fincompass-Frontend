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
      'flex cursor-pointer flex-col gap-3 rounded-2xl border px-4 py-3 transition-all sm:flex-row sm:items-center',
      selected ? 'border-[#2b6d91]/40 bg-[#2b6d91]/5 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50',
    )}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 rounded border-slate-300 text-[#12355b] focus:ring-[#2b6d91]"
      />

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg">{isExpense ? EXPENSE_CATEGORY_ICONS[item.suggestedCategory] : '$'}</span>

      <div className="min-w-0 flex-1 space-y-2">
        <input
          value={item.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-xl border border-transparent bg-transparent px-2 py-1 text-sm font-bold text-slate-950 focus:border-[#2b6d91]/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/10"
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

      <div className="w-full shrink-0 sm:w-36">
        <label className="sr-only" htmlFor={`ocr-amount-${item.id}`}>Amount</label>
        <input
          id={`ocr-amount-${item.id}`}
          type="number"
          min="0"
          step="0.01"
          value={item.amount}
          onChange={(e) => update({ amount: Number(e.target.value) })}
          className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-right text-sm font-bold text-slate-950 focus:border-[#2b6d91] focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/10"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{formatCurrency(item.amount)}</p>
      </div>
    </div>
  );
}

import { formatCurrency, formatDate } from '@/utils/formatters';
import type { DebtTimelineItem } from '../services';

interface DebtTimelineListProps {
  debts: DebtTimelineItem[];
}

export function DebtTimelineList({ debts }: DebtTimelineListProps) {
  return (
    <ol className="space-y-3">
      {debts.map((debt, idx) => (
        <li key={debt.debtId} className="flex items-start gap-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {idx + 1}
          </div>
          <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-900">{debt.debtName}</p>
              <p className="text-sm text-emerald-700 font-medium">
                Paid off {formatDate(debt.payoffDate, { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>Total paid: <strong className="text-slate-700">{formatCurrency(debt.totalPaid)}</strong></span>
              <span>Interest paid: <strong className="text-slate-700">{formatCurrency(debt.interestPaid)}</strong></span>
              <span>Month {debt.payoffMonth}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

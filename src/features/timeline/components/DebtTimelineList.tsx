import { formatCurrency, formatDate } from '@/utils/formatters';
import type { DebtTimelineItem } from '../services';

interface DebtTimelineListProps {
  debts: DebtTimelineItem[];
}

export function DebtTimelineList({ debts }: DebtTimelineListProps) {
  return (
    <ol className="space-y-3">
      {debts.map((debt, idx) => (
        <li key={debt.debtId} className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#12355b]/10 text-xs font-black text-[#12355b]">
            {idx + 1}
          </div>
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-950">{debt.debtName}</p>
              <p className="text-sm font-bold text-emerald-700">
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

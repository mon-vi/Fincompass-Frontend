import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Timeline } from '../services';

interface PayoffSummaryProps {
  timeline: Timeline;
}

export function PayoffSummary({ timeline }: PayoffSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Debt-free date"
        value={formatDate(timeline.payoffDate, { month: 'short', year: 'numeric' })}
        subtext={`${timeline.totalMonths} months`}
      />
      <StatCard
        label="Total interest"
        value={formatCurrency(timeline.totalInterestPaid)}
        subtext="to be paid"
      />
      <StatCard
        label="Total paid"
        value={formatCurrency(timeline.totalPaid)}
        subtext="including interest"
      />
      <StatCard
        label="Monthly payment"
        value={formatCurrency(700 + timeline.extraPayment)}
        subtext={timeline.extraPayment > 0 ? `+${formatCurrency(timeline.extraPayment)} extra` : 'minimum payments'}
      />
    </div>
  );
}

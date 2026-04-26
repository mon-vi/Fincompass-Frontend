import { ProgressBar } from '@/components/ui/ProgressBar';
import type { HealthScore } from '../services';

interface ScoreBreakdownProps {
  breakdown: HealthScore['breakdown'];
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const factors = [
    { key: 'debtToIncome', ...breakdown.debtToIncome },
    { key: 'savingsRate', ...breakdown.savingsRate },
    { key: 'paymentHistory', ...breakdown.paymentHistory },
    { key: 'budgetAdherence', ...breakdown.budgetAdherence },
  ];

  return (
    <div className="space-y-4">
      {factors.map((factor) => {
        const variant =
          factor.score >= 80 ? 'success' : factor.score >= 60 ? 'default' : factor.score >= 40 ? 'warning' : 'danger';
        return (
          <div key={factor.key}>
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-800">{factor.label}</span>
                <span className="ml-2 text-xs text-slate-500">{factor.value}</span>
              </div>
              <span className="text-sm font-bold text-slate-700">{factor.score}/100</span>
            </div>
            <ProgressBar value={factor.score} variant={variant} size="sm" />
          </div>
        );
      })}
    </div>
  );
}

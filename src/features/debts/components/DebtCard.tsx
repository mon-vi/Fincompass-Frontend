import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/utils/formatters';
import { DEBT_TYPE_LABELS } from '../validation';
import { useMarkDebtPaid } from '../hooks';
import type { Debt } from '../services';
import { ROUTES } from '@/constants/routes';

interface DebtCardProps {
  debt: Debt;
}

export function DebtCard({ debt }: DebtCardProps) {
  const markPaid = useMarkDebtPaid();
  const paid = (1 - debt.balance / debt.originalBalance) * 100;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{debt.name}</p>
          <Badge variant={debt.isPaid ? 'success' : 'default'} className="mt-1">
            {debt.isPaid ? 'Paid off' : DEBT_TYPE_LABELS[debt.type] ?? debt.type}
          </Badge>
        </div>
        <p className="shrink-0 text-xl font-bold text-slate-900">{formatCurrency(debt.balance)}</p>
      </div>

      {!debt.isPaid && (
        <>
          <ProgressBar
            value={paid}
            label={`${Math.round(paid)}% paid off`}
            showPercent={false}
            variant={paid >= 80 ? 'success' : paid >= 50 ? 'default' : 'warning'}
          />
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>APR: <strong className="text-slate-700">{debt.interestRate}%</strong></span>
            <span>Min payment: <strong className="text-slate-700">{formatCurrency(debt.minimumPayment)}/mo</strong></span>
            <span>Due: <strong className="text-slate-700">Day {debt.dueDayOfMonth}</strong></span>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        {!debt.isPaid && (
          <Button
            variant="ghost"
            size="sm"
            isLoading={markPaid.isPending}
            onClick={() => markPaid.mutate(debt.id)}
          >
            Mark paid
          </Button>
        )}
        <Link
          to={`${ROUTES.DEBTS}/${debt.id}/edit`}
          className="ml-auto text-xs text-indigo-600 hover:underline"
        >
          Edit
        </Link>
      </div>
    </Card>
  );
}

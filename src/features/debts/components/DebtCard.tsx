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
    <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.06]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight text-slate-950">{debt.name}</p>
          <Badge variant={debt.isPaid ? 'success' : 'default'} className="mt-1">
            {debt.isPaid ? 'Paid off' : DEBT_TYPE_LABELS[debt.type] ?? debt.type}
          </Badge>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Remaining</p>
          <p className="shrink-0 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(debt.balance)}</p>
        </div>
      </div>

      {!debt.isPaid && (
        <>
          <ProgressBar
            value={paid}
            label={`${Math.round(paid)}% paid off`}
            showPercent={false}
            variant={paid >= 80 ? 'success' : paid >= 50 ? 'default' : 'warning'}
          />
          <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
            <span className="rounded-xl bg-slate-50 px-3 py-2">APR: <strong className="text-slate-800">{debt.interestRate}%</strong></span>
            <span className="rounded-xl bg-slate-50 px-3 py-2">Min: <strong className="text-slate-800">{formatCurrency(debt.minimumPayment)}/mo</strong></span>
            <span className="rounded-xl bg-slate-50 px-3 py-2">Due: <strong className="text-slate-800">Day {debt.dueDayOfMonth}</strong></span>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
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
          className="inline-flex min-h-9 items-center justify-center rounded-xl px-3 text-xs font-bold text-[#2b6d91] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] sm:ml-auto"
        >
          Edit
        </Link>
      </div>
    </Card>
  );
}

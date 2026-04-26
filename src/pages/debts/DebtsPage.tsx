import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Loader';
import { StatCard } from '@/components/ui/StatCard';
import { useDebts } from '@/features/debts/hooks';
import { DebtCard } from '@/features/debts/components/DebtCard';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';

export function DebtsPage() {
  const { data: debts, isLoading, isError, error } = useDebts();

  const activeDebts = debts?.filter((d) => !d.isPaid) ?? [];
  const paidDebts = debts?.filter((d) => d.isPaid) ?? [];
  const totalBalance = activeDebts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayments = activeDebts.reduce((sum, d) => sum + d.minimumPayment, 0);

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Debts" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load debts'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="Debts" subtitle="Track and manage your debt payoff" />
        <Link to={`${ROUTES.DEBTS}/add`}>
          <Button size="sm">+ Add debt</Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total balance" value={isLoading ? '—' : formatCurrency(totalBalance)} isLoading={isLoading} />
        <StatCard label="Min. payments/mo" value={isLoading ? '—' : formatCurrency(totalMinPayments)} isLoading={isLoading} />
        <StatCard label="Active debts" value={isLoading ? '—' : String(activeDebts.length)} isLoading={isLoading} />
      </div>

      {/* Active debts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-6">
              <Skeleton className="mb-3 h-5 w-40" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : activeDebts.length === 0 ? (
        <EmptyState
          title="No active debts"
          description="You're debt-free, or add your debts to start tracking your payoff."
          action={
            <Link to={`${ROUTES.DEBTS}/add`}>
              <Button variant="outline">Add your first debt</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {activeDebts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} />
          ))}
        </div>
      )}

      {/* Paid off debts */}
      {paidDebts.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">Paid off</h3>
          <div className="space-y-3">
            {paidDebts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader title="Debts" subtitle="Keep payoff progress, due dates, and monthly minimums in one calmer view." />
        <Link to={`${ROUTES.DEBTS}/add`}>
          <Button className="w-full sm:w-auto" variant="accent">Add debt</Button>
        </Link>
      </div>

      <div className="rounded-[2rem] bg-[#12355b] p-6 text-white shadow-xl shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Payoff snapshot</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">Total balance</p>
            <p className="mt-2 text-2xl font-black tracking-tight">{isLoading ? '—' : formatCurrency(totalBalance)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">Minimums/mo</p>
            <p className="mt-2 text-2xl font-black tracking-tight">{isLoading ? '—' : formatCurrency(totalMinPayments)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">Active debts</p>
            <p className="mt-2 text-2xl font-black tracking-tight">{isLoading ? '—' : String(activeDebts.length)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          description="If you are debt-free, excellent. If not, add your balances and FinCompass will help you keep the path visible."
          action={
            <Link to={`${ROUTES.DEBTS}/add`}>
              <Button variant="accent">Add your first debt</Button>
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
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Paid off</h3>
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

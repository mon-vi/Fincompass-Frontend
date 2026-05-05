import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useBudget } from '@/features/budget/hooks';
import { BudgetCategoryRow, BudgetEditForm } from '@/features/budget/components';
import { formatCurrency, safeFormatDate } from '@/utils/formatters';

export function BudgetPage() {
  const { data: budget, isLoading, isError, error } = useBudget();
  const [isEditing, setIsEditing] = useState(false);

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Budget" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load budget'}</Alert>
      </div>
    );
  }

  const overBudget = budget ? budget.totalSpent > budget.totalBudgeted : false;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Budget"
        subtitle={budget ? `${safeFormatDate(budget.month, { month: 'long', year: 'numeric' }, 'Monthly budget')} - see where your money has room and where it needs a guardrail.` : 'Monthly budget'}
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Monthly overview</CardTitle>
          {budget && (
            <span className="text-sm text-slate-500">
              {formatCurrency(budget.totalSpent)} of {formatCurrency(budget.totalBudgeted)}
            </span>
          )}
        </CardHeader>
        {isLoading ? (
          <Skeleton className="h-4 w-full" />
        ) : budget ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Spent</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(budget.totalSpent)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Budgeted</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(budget.totalBudgeted)}</p>
              </div>
              <div className={overBudget ? 'rounded-2xl bg-red-50 p-4 ring-1 ring-red-100' : 'rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100'}>
                <p className={overBudget ? 'text-xs font-bold uppercase tracking-[0.18em] text-red-700' : 'text-xs font-bold uppercase tracking-[0.18em] text-emerald-700'}>{overBudget ? 'Over by' : 'Room left'}</p>
                <p className={overBudget ? 'mt-2 text-2xl font-black tracking-tight text-red-900' : 'mt-2 text-2xl font-black tracking-tight text-emerald-900'}>{formatCurrency(Math.abs(budget.totalBudgeted - budget.totalSpent))}</p>
              </div>
            </div>
            <ProgressBar
              value={budget.totalSpent}
              max={budget.totalBudgeted}
              showPercent
              variant={overBudget ? 'danger' : budget.totalSpent / budget.totalBudgeted >= 0.85 ? 'warning' : 'success'}
            />
            {overBudget && (
              <p className="text-xs text-red-600">
                You are {formatCurrency(budget.totalSpent - budget.totalBudgeted)} over budget this month. Check the categories below for the pressure point.
              </p>
            )}
          </div>
        ) : null}
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          {budget && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Edit budget
            </button>
          )}
        </CardHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : budget ? (
          isEditing ? (
            <BudgetEditForm budget={budget} onClose={() => setIsEditing(false)} />
          ) : (
            <div className="divide-y divide-slate-100">
              {budget.categories.map((cat) => (
                <BudgetCategoryRow key={cat.id} category={cat} />
              ))}
            </div>
          )
        ) : null}
      </Card>
    </div>
  );
}

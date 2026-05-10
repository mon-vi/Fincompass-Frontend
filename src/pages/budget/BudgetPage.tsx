import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useBudget, useCalculateBudget } from '@/features/budget/hooks';
import { BudgetCategoryRow, BudgetEditForm } from '@/features/budget/components';
import { formatCurrency, safeFormatDate } from '@/utils/formatters';

export function BudgetPage() {
  const { data: budget, isLoading, isError, error } = useBudget();
  const calculate = useCalculateBudget();
  const [isEditing, setIsEditing] = useState(false);

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Budget" />
        <Alert variant="error">
          {(error as Error)?.message ?? 'Failed to load budget. Please try again.'}
        </Alert>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SectionHeader title="Budget" />
        <Card>
          <div className="space-y-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      </div>
    );
  }

  // Budget has not been calculated yet
  if (!budget) {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Budget"
          subtitle="Get a clear picture of where your money is going each month."
        />
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12355b]/10 text-2xl">
            📊
          </div>
          <h2 className="mt-4 text-lg font-black tracking-tight text-slate-950">
            Budget has not been calculated yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            FinCompass will use your income and expenses to compute a monthly budget snapshot.
            Hit the button below to generate it.
          </p>
          {calculate.isError && (
            <Alert variant="error" className="mt-4 text-left">
              {(calculate.error as Error)?.message ?? 'Failed to calculate budget. Please try again.'}
            </Alert>
          )}
          <Button
            className="mt-6"
            isLoading={calculate.isPending}
            onClick={() => calculate.mutate()}
          >
            Calculate budget
          </Button>
        </div>
      </div>
    );
  }

  const overBudget = budget.totalSpent > budget.totalBudgeted;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Budget"
        subtitle={`${safeFormatDate(budget.month, { month: 'long', year: 'numeric' }, 'Monthly budget')} — see where your money has room and where it needs a guardrail.`}
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Monthly overview</CardTitle>
          <span className="text-sm text-slate-500">
            {formatCurrency(budget.totalSpent)} of {formatCurrency(budget.totalBudgeted)}
          </span>
        </CardHeader>
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Edit budget
            </button>
          )}
        </CardHeader>

        {isEditing ? (
          <BudgetEditForm budget={budget} onClose={() => setIsEditing(false)} />
        ) : budget.categories.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {budget.categories.map((cat) => (
              <BudgetCategoryRow key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
            <p className="text-sm text-slate-500">No category breakdown available yet.</p>
            <p className="mt-1 text-xs text-slate-400">Add expenses to populate your budget categories.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

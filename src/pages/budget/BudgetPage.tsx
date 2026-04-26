import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useBudget } from '@/features/budget/hooks';
import { BudgetCategoryRow } from '@/features/budget/components/BudgetCategoryRow';
import { formatCurrency } from '@/utils/formatters';

export function BudgetPage() {
  const { data: budget, isLoading, isError, error } = useBudget();

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
        subtitle={budget ? `${new Date(budget.month + '-01').toLocaleString('en-US', { month: 'long', year: 'numeric' })}` : 'Monthly budget'}
      />

      {/* Overall summary */}
      <Card>
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
          <div className="space-y-2">
            <ProgressBar
              value={budget.totalSpent}
              max={budget.totalBudgeted}
              showPercent
              variant={overBudget ? 'danger' : budget.totalSpent / budget.totalBudgeted >= 0.85 ? 'warning' : 'success'}
            />
            {overBudget && (
              <p className="text-xs text-red-600">
                You're {formatCurrency(budget.totalSpent - budget.totalBudgeted)} over budget this month.
              </p>
            )}
          </div>
        ) : null}
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : budget ? (
          <div className="divide-y divide-slate-100">
            {budget.categories.map((cat) => (
              <BudgetCategoryRow key={cat.id} category={cat} />
            ))}
          </div>
        ) : null}
      </Card>

      <p className="text-center text-xs text-slate-400">
        Budget editing coming in Phase 4. Expense tracking via the Expenses section.
      </p>
    </div>
  );
}

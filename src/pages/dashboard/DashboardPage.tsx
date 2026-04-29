import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useDashboard } from '@/features/dashboard/hooks';
import { useGuidance } from '@/features/guidance/hooks';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loader';
import { GuidanceCard } from '@/features/guidance/components/GuidanceCard';
import { ScoreGauge } from '@/features/health-score/components/ScoreGauge';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, error } = useDashboard();
  const guidance = useGuidance();
  const dashboard = data ?? {
    financialSummary: { monthlyIncome: 0, monthlyExpenses: 0, monthlyDebtPayments: 0, netCashFlow: 0 },
    budgetSnapshot: { totalSpent: 0, totalBudgeted: 0, overBudgetCategories: [] },
    healthScore: { score: 0, grade: 'F' as const, trend: 'stable' as const },
    actionPlan: { total: 0, completed: 0, nextActionTitle: null },
    topGuidance: [],
    dueSoon: [],
  };
  const actionPlanProgress = dashboard.actionPlan.total > 0
    ? (dashboard.actionPlan.completed / dashboard.actionPlan.total) * 100
    : 0;

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Dashboard" subtitle="Your financial overview" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load dashboard'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${user?.firstName ?? 'there'}`}
        subtitle="Here's your financial snapshot"
      />

      {/* Due soon alert */}
      {data?.dueSoon && data.dueSoon.length > 0 && (
        <Alert variant="warning">
          <strong>{data.dueSoon[0].name}</strong> minimum payment of{' '}
          {formatCurrency(data.dueSoon[0].minimumPayment)} is due in{' '}
          {data.dueSoon[0].daysUntilDue} day{data.dueSoon[0].daysUntilDue !== 1 ? 's' : ''}.
        </Alert>
      )}

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Monthly income"
          value={isLoading ? '—' : formatCurrency(dashboard.financialSummary.monthlyIncome)}
          isLoading={isLoading}
          icon={<svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>}
        />
        <StatCard
          label="Monthly expenses"
          value={isLoading ? '—' : formatCurrency(dashboard.financialSummary.monthlyExpenses)}
          isLoading={isLoading}
        />
        <StatCard
          label="Debt payments"
          value={isLoading ? '—' : formatCurrency(dashboard.financialSummary.monthlyDebtPayments)}
          isLoading={isLoading}
        />
        <StatCard
          label="Net cash flow"
          value={isLoading ? '—' : formatCurrency(dashboard.financialSummary.netCashFlow)}
          subtext={dashboard.financialSummary.netCashFlow >= 0 ? 'Positive' : 'Negative'}
          trend={dashboard.financialSummary.netCashFlow >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Health score */}
        <Card className="flex flex-col items-center">
          <CardHeader className="w-full">
            <CardTitle>Financial Health Score</CardTitle>
            <Link to={ROUTES.HEALTH_SCORE} className="text-xs text-indigo-600 hover:underline">Details</Link>
          </CardHeader>
          {isLoading ? (
            <Skeleton className="h-36 w-36 rounded-full" />
          ) : (
            <ScoreGauge score={dashboard.healthScore.score} grade={dashboard.healthScore.grade} trend={dashboard.healthScore.trend} />
          )}
        </Card>

        {/* Budget snapshot */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget Snapshot</CardTitle>
            <Link to={ROUTES.BUDGET} className="text-xs text-indigo-600 hover:underline">See all</Link>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total spent</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(dashboard.budgetSnapshot.totalSpent)}{' '}
                  <span className="font-normal text-slate-400">/ {formatCurrency(dashboard.budgetSnapshot.totalBudgeted)}</span>
                </span>
              </div>
              <ProgressBar
                value={dashboard.budgetSnapshot.totalSpent}
                max={dashboard.budgetSnapshot.totalBudgeted || 1}
                variant={dashboard.budgetSnapshot.totalSpent > dashboard.budgetSnapshot.totalBudgeted ? 'danger' : 'default'}
              />
              {dashboard.budgetSnapshot.overBudgetCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {dashboard.budgetSnapshot.overBudgetCategories.map((cat) => (
                    <Badge key={cat} variant="danger">{cat} over budget</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Action plan preview */}
        <Card>
          <CardHeader>
            <CardTitle>Action Plan</CardTitle>
            <Link to={ROUTES.ACTION_PLAN} className="text-xs text-indigo-600 hover:underline">View all</Link>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${actionPlanProgress}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-slate-500">
                  {dashboard.actionPlan.completed} / {dashboard.actionPlan.total} done
                </span>
              </div>
              {dashboard.actionPlan.nextActionTitle ? (
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Next up</p>
                  <p className="mt-0.5 text-sm text-slate-800">{dashboard.actionPlan.nextActionTitle}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No action plan items yet.</p>
              )}
            </div>
          )}
        </Card>

        {/* Top guidance */}
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          {guidance.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : guidance.data && guidance.data.length > 0 ? (
            <div className="space-y-3">
              {guidance.data.slice(0, 2).map((item) => (
                <GuidanceCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No new insights right now.</p>
          )}
        </Card>
      </div>

      {/* CFO/ARIA tier entry point (placeholder) */}
      <div
        className={cn(
          'rounded-2xl border-2 border-dashed p-6 text-center',
          user?.tier === 'cfo' ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50',
        )}
        aria-label="ARIA AI assistant entry point"
      >
        {user?.tier === 'cfo' ? (
          <>
            <p className="text-sm font-semibold text-indigo-700">ARIA — Your AI Financial Assistant</p>
            <p className="mt-1 text-xs text-indigo-500">Ask ARIA anything about your finances.</p>
            <Link to={ROUTES.ARIA} className="mt-3 inline-block text-xs font-medium text-indigo-600 hover:underline">Open ARIA</Link>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-500">Unlock ARIA with the CFO plan</p>
            <p className="mt-1 text-xs text-slate-400">Get personalized AI-powered financial guidance.</p>
            <Link to={ROUTES.BILLING} className="mt-3 inline-block text-xs font-medium text-indigo-600 hover:underline">Upgrade →</Link>
          </>
        )}
      </div>
    </div>
  );
}

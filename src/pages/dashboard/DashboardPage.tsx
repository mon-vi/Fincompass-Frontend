import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useDashboard } from '@/features/dashboard/hooks';
import { useGuidance } from '@/features/guidance/hooks';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loader';
import { GuidanceCard } from '@/features/guidance/components/GuidanceCard';
import { ScoreGauge } from '@/features/health-score/components/ScoreGauge';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function CardLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-xs font-bold text-[#2b6d91] hover:text-[#12355b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2">
      {children}
      <ArrowIcon />
    </Link>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function MiniMetric({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'warn' | 'bad' }) {
  const toneClasses = {
    default: 'bg-white/10 text-white ring-white/15',
    good: 'bg-emerald-400/15 text-emerald-50 ring-emerald-300/20',
    warn: 'bg-amber-300/15 text-amber-50 ring-amber-300/20',
    bad: 'bg-red-400/15 text-red-50 ring-red-300/20',
  };

  return (
    <div className={cn('rounded-2xl p-4 ring-1', toneClasses[tone])}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-2 text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}

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
    notificationCount: 0,
  };

  const actionPlanProgress = dashboard.actionPlan.total > 0
    ? (dashboard.actionPlan.completed / dashboard.actionPlan.total) * 100
    : 0;
  const obligations = dashboard.financialSummary.monthlyExpenses + dashboard.financialSummary.monthlyDebtPayments;
  const obligationsPct = dashboard.financialSummary.monthlyIncome > 0
    ? Math.min(100, (obligations / dashboard.financialSummary.monthlyIncome) * 100)
    : 0;
  const netCashFlow = dashboard.financialSummary.netCashFlow;
  const stateTone = netCashFlow >= 500 ? 'good' : netCashFlow >= 0 ? 'steady' : 'attention';
  const stateCopy = {
    good: 'You have positive room to work with this month.',
    steady: 'You are balanced, but your next move still matters.',
    attention: 'Your obligations are running ahead of income this month.',
  }[stateTone];
  const hasNoFinancialData = !isLoading
    && dashboard.financialSummary.monthlyIncome === 0
    && dashboard.financialSummary.monthlyExpenses === 0
    && dashboard.financialSummary.monthlyDebtPayments === 0;

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Dashboard</h1>
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load dashboard'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {`Welcome back, ${user?.firstName ?? 'there'}`}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your dashboard highlights where you stand and what needs attention.
        </p>
      </div>

      {hasNoFinancialData && (
        <Alert variant="info" title="Your dashboard is ready for numbers">
          Add income, expenses, or debts to turn this into a personalized command center.
        </Alert>
      )}

      {/* ── Hero financial state card ──────────────────────────────── */}
      <section className="overflow-hidden rounded-[1.75rem] bg-[#12355b] text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem]">
        <div className="p-5 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={stateTone === 'attention' ? 'warning' : 'success'} className="bg-white/10 text-white ring-white/20">
              Financial state
            </Badge>
            {dashboard.notificationCount > 0 && (
              <Badge variant="warning">{dashboard.notificationCount} notification{dashboard.notificationCount === 1 ? '' : 's'}</Badge>
            )}
          </div>

          {/* State copy */}
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">
            {stateCopy}
          </h2>
          <p className="mt-2 text-sm leading-6 text-sky-100 sm:max-w-2xl">
            Start with cash flow, watch due-soon items, then follow the action plan.
          </p>

          {/* Mini metrics – 1 col on small, 3 on sm+ */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniMetric label="Net cash flow" value={isLoading ? '-' : formatCurrency(netCashFlow)} tone={netCashFlow >= 0 ? 'good' : 'bad'} />
            <MiniMetric label="Obligations" value={isLoading ? '-' : formatCurrency(obligations)} tone="default" />
            <MiniMetric label="Due soon" value={isLoading ? '-' : String(dashboard.dueSoon.length)} tone={dashboard.dueSoon.length > 0 ? 'warn' : 'good'} />
          </div>

          {/* Next action */}
          <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">What to do next</p>
            <p className="mt-2 text-lg font-black tracking-tight sm:text-2xl">
              {isLoading
                ? 'Loading your next move'
                : dashboard.actionPlan.nextActionTitle
                  ? `Next: ${dashboard.actionPlan.nextActionTitle}`
                  : dashboard.dueSoon[0]
                    ? `Pay ${dashboard.dueSoon[0].name}`
                    : 'Review your budget'}
            </p>
            <div className="mt-4">
              <ProgressBar value={dashboard.actionPlan.completed} max={dashboard.actionPlan.total || 1} variant="success" />
              <p className="mt-2 text-xs font-medium text-sky-100">
                {dashboard.actionPlan.completed} of {dashboard.actionPlan.total} action items complete
              </p>
            </div>
            <Link
              to={ROUTES.ACTION_PLAN}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#12355b] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12355b] sm:w-auto"
            >
              Open action plan
            </Link>
          </div>
        </div>
      </section>

      {/* ── Due soon alert ─────────────────────────────────────────── */}
      {data?.dueSoon && data.dueSoon.length > 0 && (
        <Alert variant="warning" title="Payment attention">
          Your next minimum payment of {formatCurrency(data.dueSoon[0].minimumPayment)} is due in{' '}
          {data.dueSoon[0].daysUntilDue} day{data.dueSoon[0].daysUntilDue !== 1 ? 's' : ''}.
        </Alert>
      )}

      {/* ── Stat cards – 2 col on mobile, 4 on xl ─────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Monthly income"
          value={isLoading ? '—' : formatCurrency(dashboard.financialSummary.monthlyIncome)}
          isLoading={isLoading}
          icon={<MoneyIcon />}
        />
        <StatCard
          label="Expenses"
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

      {/* ── Health score + Income vs obligations ───────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="flex flex-col items-center xl:row-span-2">
          <CardHeader className="w-full">
            <CardTitle>Health score</CardTitle>
            <CardLink to={ROUTES.HEALTH_SCORE}>Details</CardLink>
          </CardHeader>
          {isLoading ? (
            <Skeleton className="h-36 w-36 rounded-full" />
          ) : (
            <ScoreGauge score={dashboard.healthScore.score} grade={dashboard.healthScore.grade} trend={dashboard.healthScore.trend} />
          )}
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Income vs obligations</CardTitle>
            <CardLink to={ROUTES.BUDGET}>Tune budget</CardLink>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Income</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-emerald-900">{formatCurrency(dashboard.financialSummary.monthlyIncome)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bills + spending</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-slate-950">{formatCurrency(dashboard.financialSummary.monthlyExpenses)}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Debt payments</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-amber-900">{formatCurrency(dashboard.financialSummary.monthlyDebtPayments)}</p>
                </div>
              </div>
              <ProgressBar value={obligationsPct} max={100} showPercent variant={obligationsPct > 90 ? 'danger' : obligationsPct > 75 ? 'warning' : 'success'} label="Income committed to obligations" />
            </div>
          )}
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Budget pulse</CardTitle>
            <CardLink to={ROUTES.BUDGET}>See all</CardLink>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total spent</span>
                <span className="font-semibold text-slate-950">
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {dashboard.budgetSnapshot.overBudgetCategories.map((cat) => (
                    <Badge key={cat} variant="danger">{cat} over budget</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ── Due soon cards ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Due soon</CardTitle>
          <CardLink to={ROUTES.NOTIFICATIONS}>Notifications</CardLink>
        </CardHeader>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-3/4" />
          </div>
        ) : dashboard.dueSoon.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {dashboard.dueSoon.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-amber-950">{item.name}</p>
                    <p className="mt-1 text-xs font-medium text-amber-800">Due in {item.daysUntilDue} day{item.daysUntilDue === 1 ? '' : 's'}</p>
                  </div>
                  <p className="text-sm font-black text-amber-950">{formatCurrency(item.minimumPayment)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">Nothing urgent on the calendar. Nice breathing room.</p>
        )}
      </Card>

      {/* ── Action plan + Guidance – stacked on mobile, side-by-side on lg ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Action plan</CardTitle>
            <CardLink to={ROUTES.ACTION_PLAN}>View all</CardLink>
          </CardHeader>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200">
                  <div className="h-full rounded-full bg-[#2b6d91] transition-all" style={{ width: `${actionPlanProgress}%` }} />
                </div>
                <span className="shrink-0 text-xs text-slate-500">{dashboard.actionPlan.completed} / {dashboard.actionPlan.total} done</span>
              </div>
              {dashboard.actionPlan.nextActionTitle ? (
                <div className="rounded-2xl bg-[#12355b]/5 p-4 ring-1 ring-[#12355b]/10">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2b6d91]">Next up</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{dashboard.actionPlan.nextActionTitle}</p>
                </div>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No action plan items yet.</p>
              )}
            </div>
          )}
        </Card>

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
            <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">No new insights right now. Quiet is good when your plan is steady.</p>
          )}
        </Card>
      </div>

      {/* ── Debt summary ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Debt summary</CardTitle>
          <CardLink to={ROUTES.DEBTS}>Manage debts</CardLink>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black tracking-tight text-slate-950">{formatCurrency(dashboard.financialSummary.monthlyDebtPayments)}</p>
          <p className="mt-2 text-sm text-slate-500">Minimum monthly payments currently in your plan.</p>
        </CardContent>
      </Card>

      {/* ── ARIA entry point ───────────────────────────────────────── */}
      <div
        className={cn(
          'rounded-[1.75rem] border p-5 text-center shadow-sm shadow-slate-900/[0.04] sm:rounded-[2rem] sm:p-6',
          user?.tier === 'cfo' ? 'border-[#12355b]/20 bg-[#12355b]/5' : 'border-slate-200 bg-white/80',
        )}
        aria-label="ARIA AI assistant entry point"
      >
        {user?.tier === 'cfo' ? (
          <>
            <p className="text-sm font-bold text-[#12355b]">ARIA – Your AI Financial Assistant</p>
            <p className="mt-1 text-xs text-slate-500">Ask ARIA anything about your finances.</p>
            <Link to={ROUTES.ARIA} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#12355b] px-4 py-2 text-sm font-bold text-white hover:bg-[#0b2746] sm:w-auto">
              Open ARIA
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-700">ARIA is available with the CFO plan</p>
            <p className="mt-1 text-xs text-slate-500">A natural upgrade when you want personalized AI-powered guidance.</p>
            <Link to={ROUTES.BILLING} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:w-auto">
              See upgrade options
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

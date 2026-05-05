import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { useHealthScore } from '@/features/health-score/hooks';
import { ScoreGauge } from '@/features/health-score/components/ScoreGauge';
import { ScoreBreakdown } from '@/features/health-score/components/ScoreBreakdown';
import { formatDate, safeFormatDate } from '@/utils/formatters';

const trendBadge = { improving: 'success', stable: 'default', declining: 'danger' } as const;

export function HealthScorePage() {
  const { data, isLoading, isError, error } = useHealthScore();

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Financial Health Score" />
        <Alert variant="error" title="Health score did not load">
          {(error as Error)?.message ?? 'We could not load your financial health score. Check your connection and try again.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Financial Health Score"
        subtitle="A focused read on your financial wellness, trend, and highest-impact levers."
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Your score</CardTitle>
          {data && (
            <Badge variant={trendBadge[data.trend]}>
              {data.trend === 'improving' ? '↑ Improving' : data.trend === 'declining' ? '↓ Declining' : '→ Stable'}
            </Badge>
          )}
        </CardHeader>
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-36 w-36 rounded-full" />
          </div>
        ) : data ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-10">
            <ScoreGauge score={data.score} grade={data.grade} trend={data.trend} />
            <div className="flex-1 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Your score of <strong className="text-slate-900">{data.score}/100</strong> puts you in the{' '}
                <strong className="text-slate-900">{data.grade}</strong> range.
              </p>
              <p className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                Your biggest opportunity is improving your <strong>debt-to-income ratio</strong> (currently 31%).
                Paying down your highest-interest debt first will have the largest impact.
              </p>
              <p className="text-xs text-slate-400">
                Last updated {formatDate(data.lastUpdated, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState title="No score yet" description="Your score will appear after FinCompass has enough profile detail to evaluate your current financial picture." />
        )}
      </Card>

      {/* Score breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score breakdown</CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : data ? (
          <ScoreBreakdown breakdown={data.breakdown} />
        ) : (
          <EmptyState title="No breakdown yet" description="Score factors will appear once your health score is generated." />
        )}
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Score history (6 months)</CardTitle>
        </CardHeader>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : data ? (
          <div className="flex items-end justify-between gap-1 h-20">
            {data.history.map((point) => {
              const heightPct = (point.score / 100) * 100;
              return (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-slate-600">{point.score}</span>
                  <div className="w-full rounded-t-sm bg-[#2b6d91]" style={{ height: `${heightPct}%`, minHeight: 4 }} />
                  <span className="text-xs text-slate-400">
                    {safeFormatDate(point.month, { month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No history yet" description="Your score trend will build over time as FinCompass updates your plan." />
        )}
      </Card>
    </div>
  );
}

import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useActionPlan } from '@/features/action-plan/hooks';
import { ActionItemRow } from '@/features/action-plan/components/ActionItemRow';

export function ActionPlanPage() {
  const { data: items, isLoading, isError, error } = useActionPlan();

  const completed = items?.filter((i) => i.isCompleted) ?? [];
  const pending = items?.filter((i) => !i.isCompleted) ?? [];

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Action Plan" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load action plan'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Action Plan"
        subtitle="Personalized steps that turn your financial picture into forward motion."
      />

      {/* Progress bar */}
      {!isLoading && items && items.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{completed.length} of {items.length} complete</span>
          </CardHeader>
          <ProgressBar
            value={completed.length}
            max={items.length}
            showPercent
            variant={completed.length === items.length ? 'success' : 'default'}
          />
        </Card>
      )}

      {/* Pending actions */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : pending.length === 0 && completed.length === 0 ? (
        <EmptyState
          title="No action items yet"
          description="Your action plan will appear once FinCompass has enough profile detail to recommend useful next steps."
        />
      ) : (
        <>
          {pending.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">To do</h3>
              {pending.map((item) => (
                <ActionItemRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Completed</h3>
              {completed.map((item) => (
                <ActionItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

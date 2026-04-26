import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { Input } from '@/components/ui/Input';
import { useTimeline } from '@/features/timeline/hooks';
import { StrategySelector } from '@/features/timeline/components/StrategySelector';
import { PayoffSummary } from '@/features/timeline/components/PayoffSummary';
import { DebtTimelineList } from '@/features/timeline/components/DebtTimelineList';

export function TimelinePage() {
  const { data, isLoading, isError, error, strategy, setStrategy, extraPayment, setExtraPayment } = useTimeline();
  const [extraInput, setExtraInput] = useState('');

  const handleExtraPayment = (val: string) => {
    setExtraInput(val);
    const parsed = Number(val);
    if (!isNaN(parsed) && parsed >= 0) setExtraPayment(parsed);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Debt Timeline" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load timeline'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Debt Timeline"
        subtitle="See when you'll be debt-free and how much interest you'll pay"
      />

      {/* Strategy selector */}
      <Card>
        <CardHeader>
          <CardTitle>Payoff strategy</CardTitle>
        </CardHeader>
        <StrategySelector value={strategy} onChange={setStrategy} />
      </Card>

      {/* Extra payment simulator */}
      <Card>
        <CardHeader>
          <CardTitle>Extra payment simulator</CardTitle>
        </CardHeader>
        <div className="max-w-xs">
          <Input
            label="Extra monthly payment ($)"
            type="number"
            inputMode="numeric"
            min="0"
            step="50"
            placeholder="0"
            value={extraInput}
            onChange={(e) => handleExtraPayment(e.target.value)}
            hint="See how much faster you pay off debt with additional payments"
          />
        </div>
        {extraPayment > 0 && data && (
          <p className="mt-3 text-sm text-emerald-700">
            Adding ${extraPayment}/month saves{' '}
            <strong>
              {(() => {
                const baseMonths = strategy === 'avalanche' ? 36 : strategy === 'snowball' ? 40 : 52;
                return Math.max(0, baseMonths - data.totalMonths);
              })()}
              {' '}months
            </strong>{' '}
            and reduces total interest paid.
          </p>
        )}
      </Card>

      {/* Summary stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : data ? (
        <PayoffSummary timeline={data} />
      ) : null}

      {/* Debt payoff order */}
      <Card>
        <CardHeader>
          <CardTitle>Payoff order</CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : data ? (
          <DebtTimelineList debts={data.debts} />
        ) : null}
      </Card>
    </div>
  );
}

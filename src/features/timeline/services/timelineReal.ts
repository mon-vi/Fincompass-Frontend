import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { Timeline, PayoffStrategy, TimelineApiAdapter } from './timelineApi';

type BackendRecord = Record<string, unknown>;

interface TimelineEnvelope {
  data: BackendRecord[];
  meta?: {
    combined_debt_free_date?: string | null;
    total_interest_at_minimum?: number | string | null;
    total_interest_optimized?: number | string | null;
    total_interest_paid?: number | string | null;
  } | null;
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === 'object' ? value as BackendRecord : {};
}

function mapTimeline(res: TimelineEnvelope, strategy: PayoffStrategy, extraPayment: number): Timeline {
  const snapshots = Array.isArray(res.data) ? res.data.map(asRecord) : [];
  const debts = snapshots.map((snapshot, index) => {
    const timelineData = Array.isArray(snapshot.timeline_data) ? snapshot.timeline_data.map(asRecord) : [];
    const totalPaid = timelineData.reduce((sum, month) => sum + asNumber(month.payment), 0);
    return {
      debtId: String(snapshot.debt_entry_id ?? snapshot.id ?? index),
      debtName: `Debt ${index + 1}`,
      payoffDate: typeof snapshot.projected_payoff_date === 'string' ? snapshot.projected_payoff_date : null,
      payoffMonth: timelineData.length,
      totalPaid,
      interestPaid: asNumber(snapshot.total_interest_paid),
    };
  });
  const totalInterestPaid = asNumber(res.meta?.total_interest_paid ?? res.meta?.total_interest_optimized, debts.reduce((sum, debt) => sum + debt.interestPaid, 0));

  return {
    strategy,
    totalInterestPaid,
    totalPaid: debts.reduce((sum, debt) => sum + debt.totalPaid, 0),
    payoffDate: res.meta?.combined_debt_free_date ?? null,
    totalMonths: Math.max(0, ...debts.map((debt) => debt.payoffMonth)),
    extraPayment,
    debts,
    monthlySnapshots: [],
  };
}

/**
 * Assumption: extraPayment is a query param (not POST body).
 * If the backend requires POST, change to post<LaravelResource<Timeline>>(..., { strategy, extra_payment }).
 */
export const timelineReal: TimelineApiAdapter = {
  async get(strategy: PayoffStrategy, extraPayment = 0): Promise<Timeline> {
    try {
      const params: Record<string, string | number> = { strategy };
      if (extraPayment > 0) params.extra_payment = extraPayment;
      const res = await get<TimelineEnvelope>(apiPath(API.TIMELINE), { params });
      return mapTimeline(res, strategy, extraPayment);
    } catch (err) {
      handleApiError(err);
    }
  },
};

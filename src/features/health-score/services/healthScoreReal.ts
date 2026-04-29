import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { HealthScore, HealthScoreApiAdapter } from './healthScoreApi';

type BackendRecord = Record<string, unknown>;

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function gradeFromScore(score: number): HealthScore['grade'] {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function factor(label: string, value: unknown): HealthScore['breakdown']['debtToIncome'] {
  return { score: asNumber(value), label, value: `${asNumber(value)}%`, weight: 25 };
}

function mapHealthScore(raw: BackendRecord): HealthScore {
  const score = asNumber(raw.score);
  return {
    score,
    grade: gradeFromScore(score),
    trend: 'stable',
    breakdown: {
      debtToIncome: factor('Debt to income', raw.debt_to_income_ratio),
      savingsRate: factor('Savings rate', raw.savings_rate),
      paymentHistory: factor('Payment history', 100),
      budgetAdherence: factor('Expense ratio', raw.expense_ratio),
    },
    lastUpdated: typeof raw.recorded_at === 'string' ? raw.recorded_at : '',
    history: [],
  };
}

/**
 * Assumption: history array is included in GET /api/v1/health-score response.
 * If not, fetch separately from GET /api/v1/health-score/history and merge.
 */
export const healthScoreReal: HealthScoreApiAdapter = {
  async get(): Promise<HealthScore> {
    try {
      const res = await get<LaravelResource<BackendRecord>>(apiPath(API.HEALTH_SCORE.CURRENT));
      return mapHealthScore(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },
};

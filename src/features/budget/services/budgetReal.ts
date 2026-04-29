import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { Budget, UpdateBudgetPayload, BudgetApiAdapter } from './budgetApi';

interface LaravelBudgetSnapshot {
  month?: string | null;
  total_expenses?: number | string;
  total_obligations?: number | string;
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function mapBudget(snapshot: LaravelBudgetSnapshot): Budget {
  const totalSpent = asNumber(snapshot.total_expenses);
  return {
    month: snapshot.month ?? '',
    totalBudgeted: asNumber(snapshot.total_obligations, totalSpent),
    totalSpent,
    categories: [],
  };
}

/**
 * Assumption: GET /api/v1/budget returns current month by default.
 * Pass ?month=YYYY-MM as a query param when fetching specific months.
 */
export const budgetReal: BudgetApiAdapter = {
  async get(): Promise<Budget> {
    try {
      const res = await get<LaravelResource<LaravelBudgetSnapshot>>(apiPath(API.BUDGET));
      return mapBudget(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(payload: UpdateBudgetPayload): Promise<Budget> {
    try {
      const res = await post<LaravelResource<LaravelBudgetSnapshot>>(apiPath(API.BUDGET), payload);
      return mapBudget(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },
};

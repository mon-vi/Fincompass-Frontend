import { get, post } from '@/services/apiClient';
import { handleApiError, ApiError } from '@/services/apiError';
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

export const budgetReal: BudgetApiAdapter = {
  async get(): Promise<Budget | null> {
    try {
      const res = await get<LaravelResource<LaravelBudgetSnapshot | null>>(apiPath(API.BUDGET));
      if (!res.data) return null;
      return mapBudget(res.data);
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) return null;
      handleApiError(err);
    }
  },

  async calculate(): Promise<Budget> {
    try {
      const res = await post<LaravelResource<LaravelBudgetSnapshot>>(apiPath(API.BUDGET_CALCULATE));
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

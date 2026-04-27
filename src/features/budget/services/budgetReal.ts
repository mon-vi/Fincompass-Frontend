import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { Budget, UpdateBudgetPayload, BudgetApiAdapter } from './budgetApi';

/**
 * Assumption: GET /api/v1/budget returns current month by default.
 * Pass ?month=YYYY-MM as a query param when fetching specific months.
 */
export const budgetReal: BudgetApiAdapter = {
  async get(): Promise<Budget> {
    try {
      const res = await get<LaravelResource<Budget>>(apiPath(API.BUDGET));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(payload: UpdateBudgetPayload): Promise<Budget> {
    try {
      const res = await post<LaravelResource<Budget>>(apiPath(API.BUDGET), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

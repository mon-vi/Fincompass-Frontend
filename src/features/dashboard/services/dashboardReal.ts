import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { DashboardApiAdapter, DashboardData } from './dashboardApi';

/**
 * Assumption: GET /api/v1/dashboard returns the DashboardData shape directly
 * (not wrapped in { data: ... }). Confirm with backend.
 * If wrapped, change to: get<LaravelResource<DashboardData>>(...).then(r => r.data)
 */
export const dashboardReal: DashboardApiAdapter = {
  async getDashboard(): Promise<DashboardData> {
    try {
      return await get<DashboardData>(apiPath(API.DASHBOARD));
    } catch (err) {
      handleApiError(err);
    }
  },
};

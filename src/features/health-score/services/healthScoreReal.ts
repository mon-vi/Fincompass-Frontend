import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { HealthScore, HealthScoreApiAdapter } from './healthScoreApi';

/**
 * Assumption: history array is included in GET /api/v1/health-score response.
 * If not, fetch separately from GET /api/v1/health-score/history and merge.
 */
export const healthScoreReal: HealthScoreApiAdapter = {
  async get(): Promise<HealthScore> {
    try {
      const res = await get<LaravelResource<HealthScore>>(apiPath(API.HEALTH_SCORE.CURRENT));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

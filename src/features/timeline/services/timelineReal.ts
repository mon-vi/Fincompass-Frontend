import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { Timeline, PayoffStrategy, TimelineApiAdapter } from './timelineApi';

/**
 * Assumption: extraPayment is a query param (not POST body).
 * If the backend requires POST, change to post<LaravelResource<Timeline>>(..., { strategy, extra_payment }).
 */
export const timelineReal: TimelineApiAdapter = {
  async get(strategy: PayoffStrategy, extraPayment = 0): Promise<Timeline> {
    try {
      const params: Record<string, string | number> = { strategy };
      if (extraPayment > 0) params.extra_payment = extraPayment;
      const res = await get<LaravelResource<Timeline>>(apiPath(API.TIMELINE), { params });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

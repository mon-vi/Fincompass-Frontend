import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { ActionItem, UpdateActionItemPayload, ActionPlanApiAdapter } from './actionPlanApi';

export const actionPlanReal: ActionPlanApiAdapter = {
  async list(): Promise<ActionItem[]> {
    try {
      const res = await get<LaravelCollection<ActionItem>>(apiPath(API.ACTION_PLAN.LIST));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateActionItemPayload): Promise<ActionItem> {
    try {
      const res = await patch<LaravelResource<ActionItem>>(apiPath(API.ACTION_PLAN.DETAIL(id)), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

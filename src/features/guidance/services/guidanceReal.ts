import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection } from '@/services/apiError';
import type { GuidanceItem, GuidanceApiAdapter } from './guidanceApi';

type BackendGuidanceItem = Record<string, unknown>;

function mapGuidanceItem(item: BackendGuidanceItem): GuidanceItem {
  const type = item.type === 'tip' || item.type === 'warning' || item.type === 'insight' ? item.type : 'insight';
  return {
    id: String(item.id ?? ''),
    title: String(item.title ?? 'Insight'),
    body: String(item.body ?? ''),
    type,
    isDismissed: item.is_dismissed === true,
    createdAt: typeof item.created_at === 'string' ? item.created_at : '',
  };
}

/**
 * Assumption: GET /api/v1/guidance filters dismissed items server-side.
 * If it returns all items, add: .filter(i => !i.is_dismissed) and map field name.
 */
export const guidanceReal: GuidanceApiAdapter = {
  async list(): Promise<GuidanceItem[]> {
    try {
      const res = await get<LaravelCollection<BackendGuidanceItem>>(apiPath(API.GUIDANCE.LIST));
      return res.data.map(mapGuidanceItem);
    } catch (err) {
      handleApiError(err);
    }
  },

  async dismiss(id: string): Promise<void> {
    try {
      await patch<void>(apiPath(API.GUIDANCE.DISMISS(id)));
    } catch (err) {
      handleApiError(err);
    }
  },
};

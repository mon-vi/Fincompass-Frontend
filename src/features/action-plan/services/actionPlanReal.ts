import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { ActionItem, UpdateActionItemPayload, ActionPlanApiAdapter } from './actionPlanApi';

type BackendActionItem = Record<string, unknown>;

function mapActionItem(item: BackendActionItem): ActionItem {
  const status = String(item.status ?? 'pending');
  const type = String(item.type ?? 'budget');
  return {
    id: String(item.id ?? ''),
    title: String(item.title ?? 'Action item'),
    description: String(item.description ?? item.text ?? ''),
    category: type === 'debt' || type === 'budget' || type === 'savings' || type === 'income' ? type : 'budget',
    priority: item.priority === 'high' || item.priority === 'medium' || item.priority === 'low' ? item.priority : 'medium',
    isCompleted: status === 'completed' || item.is_completed === true,
    completedAt: typeof item.completed_at === 'string' ? item.completed_at : null,
    dueDate: typeof item.due_date === 'string' ? item.due_date : null,
    createdAt: typeof item.created_at === 'string' ? item.created_at : '',
  };
}

export const actionPlanReal: ActionPlanApiAdapter = {
  async list(): Promise<ActionItem[]> {
    try {
      const res = await get<LaravelCollection<BackendActionItem>>(apiPath(API.ACTION_PLAN.LIST));
      return res.data.map(mapActionItem);
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateActionItemPayload): Promise<ActionItem> {
    try {
      const res = await patch<LaravelResource<BackendActionItem>>(apiPath(API.ACTION_PLAN.DETAIL(id)), {
        status: payload.isCompleted ? 'completed' : 'pending',
      });
      return mapActionItem(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },
};

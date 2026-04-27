import { get, patch, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection } from '@/services/apiError';
import type { Notification, NotificationsApiAdapter } from './notificationsApi';

export const notificationsReal: NotificationsApiAdapter = {
  async list(): Promise<Notification[]> {
    try {
      const res = await get<LaravelCollection<Notification>>(apiPath(API.NOTIFICATIONS.LIST));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async markRead(id: string): Promise<void> {
    try {
      await patch<void>(apiPath(API.NOTIFICATIONS.MARK_READ(id)));
    } catch (err) {
      handleApiError(err);
    }
  },

  async markAllRead(): Promise<void> {
    try {
      await post<void>(apiPath(API.NOTIFICATIONS.MARK_ALL_READ));
    } catch (err) {
      handleApiError(err);
    }
  },
};

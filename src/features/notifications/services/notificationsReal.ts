import { get, patch, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection } from '@/services/apiError';
import type { Notification, NotificationsApiAdapter } from './notificationsApi';

type LaravelNotification = Record<string, unknown>;

function mapNotification(notification: LaravelNotification): Notification {
  const type = String(notification.type ?? 'system');
  return {
    id: String(notification.id ?? ''),
    title: String(notification.title ?? 'Notification'),
    body: String(notification.body ?? notification.message ?? ''),
    type: type === 'payment_due' || type === 'budget_exceeded' || type === 'milestone' || type === 'tip' ? type : 'system',
    isRead: notification.is_read === true || notification.isRead === true || notification.read_at != null,
    createdAt: typeof notification.created_at === 'string'
      ? notification.created_at
      : typeof notification.createdAt === 'string'
        ? notification.createdAt
        : '',
  };
}

export const notificationsReal: NotificationsApiAdapter = {
  async list(): Promise<Notification[]> {
    try {
      const res = await get<LaravelCollection<LaravelNotification>>(apiPath(API.NOTIFICATIONS.LIST));
      return res.data.map(mapNotification);
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

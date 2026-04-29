import { notificationsReal } from './notificationsReal';
import type { NotificationsApiAdapter } from './notificationsApi';

export const notificationsAdapter: NotificationsApiAdapter = notificationsReal;

export type { NotificationsApiAdapter, Notification, NotificationType } from './notificationsApi';

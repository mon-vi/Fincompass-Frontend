import { ENV } from '@/constants/env';
import { notificationsMock } from './notificationsMock';
import { notificationsReal } from './notificationsReal';
import type { NotificationsApiAdapter } from './notificationsApi';

export const notificationsAdapter: NotificationsApiAdapter = ENV.USE_MOCK_API ? notificationsMock : notificationsReal;

export type { NotificationsApiAdapter, Notification, NotificationType } from './notificationsApi';

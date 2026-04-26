export type NotificationType = 'payment_due' | 'budget_exceeded' | 'milestone' | 'tip' | 'system';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsApiAdapter {
  /** GET /api/v1/notifications */
  list(): Promise<Notification[]>;
  /** PATCH /api/v1/notifications/{id}/read */
  markRead(id: string): Promise<void>;
  /** POST /api/v1/notifications/read-all */
  markAllRead(): Promise<void>;
}

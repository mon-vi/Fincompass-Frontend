import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { useMarkNotificationRead } from '../hooks';
import type { Notification, NotificationType } from '../services';

interface NotificationItemProps {
  notification: Notification;
}

const typeIcon: Record<NotificationType, string> = {
  payment_due: '💳',
  budget_exceeded: '📊',
  milestone: '🏆',
  tip: '💡',
  system: '🔔',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const markRead = useMarkNotificationRead();

  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-colors',
        notification.isRead ? 'border-slate-200 bg-white' : 'border-indigo-100 bg-indigo-50',
      )}
      onClick={() => {
        if (!notification.isRead) markRead.mutate(notification.id);
      }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl leading-none" aria-hidden="true">
          {typeIcon[notification.type]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn('text-sm', notification.isRead ? 'font-medium text-slate-700' : 'font-semibold text-slate-900')}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" aria-label="Unread" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{notification.body}</p>
          <p className="mt-1 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
        </div>
      </div>
    </button>
  );
}

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
        'w-full rounded-2xl border p-4 text-left shadow-sm shadow-slate-900/[0.03] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/15',
        notification.isRead ? 'border-slate-200 bg-white hover:bg-slate-50' : 'border-[#2b6d91]/20 bg-[#2b6d91]/5 hover:bg-[#2b6d91]/10',
      )}
      onClick={() => {
        if (!notification.isRead) markRead.mutate(notification.id);
      }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl leading-none ring-1 ring-slate-200" aria-hidden="true">
          {typeIcon[notification.type]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn('text-sm', notification.isRead ? 'font-medium text-slate-700' : 'font-semibold text-slate-900')}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2b6d91]" aria-label="Unread" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{notification.body}</p>
          <p className="mt-1 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
        </div>
      </div>
    </button>
  );
}

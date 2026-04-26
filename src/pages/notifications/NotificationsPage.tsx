import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotifications, useMarkAllNotificationsRead } from '@/features/notifications/hooks';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';

export function NotificationsPage() {
  const { data, isLoading, isError, error, unreadCount } = useNotifications();
  const markAll = useMarkAllNotificationsRead();

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Notifications" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load notifications'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        />
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            isLoading={markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications"
          description="You're all caught up. We'll notify you about payments, budget alerts, and milestones."
        />
      )}
    </div>
  );
}

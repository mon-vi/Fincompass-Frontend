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
        <Alert variant="error" title="Notifications did not load">
          {(error as Error)?.message ?? 'We could not load notifications. Check your connection and try again.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread item${unreadCount === 1 ? '' : 's'} that may need attention.` : 'All caught up. Quiet finances are good finances.'}
        />
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="md"
            isLoading={markAll.isPending}
            onClick={() => markAll.mutate()}
            className="w-full sm:w-auto"
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
          description="You're all caught up. We'll let you know when payments, budget alerts, milestones, or guidance need your attention."
        />
      )}
    </div>
  );
}

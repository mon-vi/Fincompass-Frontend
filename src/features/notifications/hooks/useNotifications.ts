import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAdapter } from '../services';

export const notificationKeys = {
  all: ['notifications'] as const,
};

export function useNotifications() {
  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => notificationsAdapter.list(),
  });

  const unreadCount = query.data?.filter((n) => !n.isRead).length ?? 0;

  return { ...query, unreadCount };
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsAdapter.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsAdapter.markAllRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

import type { Notification, NotificationsApiAdapter } from './notificationsApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Chase Freedom Visa due in 3 days',
    body: 'Your minimum payment of $200 is due on April 15. Autopay is not enabled.',
    type: 'payment_due',
    isRead: false,
    createdAt: '2026-04-12T09:00:00Z',
  },
  {
    id: 'n2',
    title: 'Food budget exceeded',
    body: "You've spent $620 on food this month, $120 over your $500 budget.",
    type: 'budget_exceeded',
    isRead: false,
    createdAt: '2026-04-20T14:30:00Z',
  },
  {
    id: 'n3',
    title: 'Milestone: 6 months on track!',
    body: "Congratulations! You've made on-time payments for 6 consecutive months. Your health score increased by 9 points.",
    type: 'milestone',
    isRead: true,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'n4',
    title: 'Tip: Extra $300 saves $4,650 in interest',
    body: 'Adding $300/month to your Chase card using the avalanche strategy pays it off 14 months sooner.',
    type: 'tip',
    isRead: true,
    createdAt: '2026-03-28T00:00:00Z',
  },
];

export const notificationsMock: NotificationsApiAdapter = {
  async list(): Promise<Notification[]> {
    await delay(400);
    return mockNotifications.map((n) => ({ ...n }));
  },

  async markRead(id: string): Promise<void> {
    await delay(300);
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  },

  async markAllRead(): Promise<void> {
    await delay(400);
    mockNotifications.forEach((n) => { n.isRead = true; });
  },
};

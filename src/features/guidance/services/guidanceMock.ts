import type { GuidanceItem, GuidanceApiAdapter } from './guidanceApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockItems: GuidanceItem[] = [
  {
    id: 'g1',
    title: 'Food spending is over budget',
    body: "You've spent $120 more than budgeted on food this month. Meal prepping 2 days a week typically saves $80-150/month.",
    type: 'warning',
    isDismissed: false,
    createdAt: '2026-04-20T00:00:00Z',
  },
  {
    id: 'g2',
    title: 'Avalanche method could save you $4,650',
    body: 'By targeting your 22.99% APR Chase card first, you eliminate it 14 months sooner and save $4,650 in interest vs. minimum payments.',
    type: 'insight',
    isDismissed: false,
    createdAt: '2026-04-15T00:00:00Z',
  },
  {
    id: 'g3',
    title: 'Your payment history is excellent',
    body: "100% on-time payments across all accounts this year. Keep it up — this factor alone accounts for 35% of your credit score.",
    type: 'tip',
    isDismissed: false,
    createdAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'g4',
    title: 'Chase Visa due in 3 days',
    body: 'Your $200 minimum payment is due on the 15th. Make sure your bank account has sufficient funds.',
    type: 'warning',
    isDismissed: false,
    createdAt: '2026-04-12T00:00:00Z',
  },
];

export const guidanceMock: GuidanceApiAdapter = {
  async list(): Promise<GuidanceItem[]> {
    await delay(400);
    return mockItems.filter((i) => !i.isDismissed).map((i) => ({ ...i }));
  },

  async dismiss(id: string): Promise<void> {
    await delay(300);
    const item = mockItems.find((i) => i.id === id);
    if (item) item.isDismissed = true;
  },
};

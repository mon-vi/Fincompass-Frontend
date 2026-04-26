import type { ActionItem, ActionPlanApiAdapter, UpdateActionItemPayload } from './actionPlanApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockItems: ActionItem[] = [
  {
    id: 'ap-1',
    title: 'Set up automatic minimum payments',
    description: 'Enable autopay for all three debts to avoid late fees and protect your payment history score.',
    category: 'debt',
    priority: 'high',
    isCompleted: true,
    completedAt: '2026-04-10T00:00:00Z',
    dueDate: null,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'ap-2',
    title: 'Open a high-yield savings account',
    description: 'Move your emergency fund to an HYSA earning 4-5% APY instead of a standard checking account.',
    category: 'savings',
    priority: 'high',
    isCompleted: true,
    completedAt: '2026-04-18T00:00:00Z',
    dueDate: null,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'ap-3',
    title: 'Reduce food budget to $500/month',
    description: "You're averaging $620/month on food. Meal prepping 2 days a week could save $100+ monthly.",
    category: 'budget',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    dueDate: '2026-05-01T00:00:00Z',
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'ap-4',
    title: 'Add $300/month extra to Chase Freedom Visa',
    description: 'Avalanche method: putting extra toward your 22.99% APR card saves the most interest long-term.',
    category: 'debt',
    priority: 'medium',
    isCompleted: false,
    completedAt: null,
    dueDate: null,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'ap-5',
    title: 'Build 1-month emergency fund buffer',
    description: 'Aim for $4,500 in liquid savings before accelerating debt payoff.',
    category: 'savings',
    priority: 'medium',
    isCompleted: false,
    completedAt: null,
    dueDate: null,
    createdAt: '2026-04-01T00:00:00Z',
  },
];

export const actionPlanMock: ActionPlanApiAdapter = {
  async list(): Promise<ActionItem[]> {
    await delay(500);
    return mockItems.map((i) => ({ ...i }));
  },

  async update(id: string, payload: UpdateActionItemPayload): Promise<ActionItem> {
    await delay(400);
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Action item not found');
    mockItems[idx] = {
      ...mockItems[idx],
      ...payload,
      completedAt: payload.isCompleted ? new Date().toISOString() : null,
    };
    return { ...mockItems[idx] };
  },
};

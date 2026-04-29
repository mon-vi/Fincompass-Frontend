import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dashboardReal } from './dashboardReal';

const api = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@/services/apiClient', () => ({ get: api.get }));

describe('dashboardReal', () => {
  beforeEach(() => api.get.mockReset());

  it('maps snake_case dashboard aggregate safely', async () => {
    api.get.mockResolvedValue({
      data: {
        budget: { total_income: 5000, total_expenses: 1200, total_debt_payments: 300, net_cashflow: 3500 },
        health_score: { score: 82 },
        income_summary: { total_monthly: 5000 },
        debt_summary: { total_monthly_payments: 300 },
        expense_summary: { total_monthly: 1200 },
        due_soon_debts: [{ id: 'debt-1', name: 'Visa', minimum_payment: 75, due_on: new Date().toISOString().slice(0, 10) }],
        guidance_preview: [{ id: 'g1', title: 'Insight', body: 'Body', type: 'insight' }],
        action_plan_preview: { pending_count: 2, items: [{ title: 'Pay debt' }] },
        notification_count: 4,
      },
    });

    const dashboard = await dashboardReal.getDashboard();

    expect(dashboard.financialSummary.monthlyIncome).toBe(5000);
    expect(dashboard.healthScore.grade).toBe('B');
    expect(dashboard.actionPlan.nextActionTitle).toBe('Pay debt');
    expect(dashboard.dueSoon[0].name).toBe('Visa');
    expect(dashboard.notificationCount).toBe(4);
  });

  it('handles null and partial fields', async () => {
    api.get.mockResolvedValue({ data: { budget: null, health_score: null, due_soon_debts: [{ id: 'debt-1', name: 'Loan', due_on: null }] } });

    const dashboard = await dashboardReal.getDashboard();

    expect(dashboard.financialSummary.monthlyIncome).toBe(0);
    expect(dashboard.dueSoon[0].daysUntilDue).toBe(0);
  });
});

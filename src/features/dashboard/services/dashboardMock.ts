import type { DashboardApiAdapter, DashboardData } from './dashboardApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const MOCK_DASHBOARD: DashboardData = {
  financialSummary: {
    monthlyIncome: 4500,
    monthlyExpenses: 2505,
    monthlyDebtPayments: 700,
    netCashFlow: 1295,
  },
  budgetSnapshot: {
    totalBudgeted: 2650,
    totalSpent: 2505,
    overBudgetCategories: ['Food & Dining'],
  },
  healthScore: {
    score: 64,
    grade: 'C',
    trend: 'improving',
  },
  actionPlan: {
    total: 5,
    completed: 2,
    nextActionTitle: 'Set up automatic minimum payments for all debts',
  },
  topGuidance: [
    {
      id: 'g1',
      title: 'Food spending is over budget',
      body: "You've spent $120 more than budgeted on food this month. Consider meal prepping to reduce restaurant visits.",
      type: 'warning',
    },
    {
      id: 'g2',
      title: 'Avalanche method could save you $4,200',
      body: 'By targeting your 22.99% APR credit card first, you can eliminate it 6 months faster than minimum payments.',
      type: 'insight',
    },
    {
      id: 'g3',
      title: 'Net cash flow looks healthy',
      body: "You have $1,295 left after expenses and debt payments. Consider channeling $500+ toward your credit card balance.",
      type: 'tip',
    },
  ],
  dueSoon: [
    {
      id: 'debt-1',
      name: 'Chase Freedom Visa',
      minimumPayment: 200,
      daysUntilDue: 3,
    },
  ],
};

export const dashboardMock: DashboardApiAdapter = {
  async getDashboard(): Promise<DashboardData> {
    await delay(600);
    return MOCK_DASHBOARD;
  },
};

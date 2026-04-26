import type { HealthScore, HealthScoreApiAdapter } from './healthScoreApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const MOCK_HEALTH_SCORE: HealthScore = {
  score: 64,
  grade: 'C',
  trend: 'improving',
  breakdown: {
    debtToIncome: {
      score: 48,
      label: 'Debt-to-Income Ratio',
      value: '31%',
      weight: 35,
    },
    savingsRate: {
      score: 62,
      label: 'Savings Rate',
      value: '12%',
      weight: 25,
    },
    paymentHistory: {
      score: 90,
      label: 'Payment History',
      value: 'On time',
      weight: 25,
    },
    budgetAdherence: {
      score: 55,
      label: 'Budget Adherence',
      value: '94.5%',
      weight: 15,
    },
  },
  lastUpdated: '2026-04-26T00:00:00Z',
  history: [
    { month: '2025-10', score: 55 },
    { month: '2025-11', score: 57 },
    { month: '2025-12', score: 59 },
    { month: '2026-01', score: 60 },
    { month: '2026-02', score: 62 },
    { month: '2026-03', score: 63 },
    { month: '2026-04', score: 64 },
  ],
};

export const healthScoreMock: HealthScoreApiAdapter = {
  async get(): Promise<HealthScore> {
    await delay(500);
    return MOCK_HEALTH_SCORE;
  },
};

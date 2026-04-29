import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './DashboardPage';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) => selector({ user: { firstName: 'Jane', tier: 'cfo' } }),
}));

vi.mock('@/features/dashboard/hooks', () => ({
  useDashboard: () => ({
    isLoading: false,
    isError: false,
    data: {
      financialSummary: { monthlyIncome: 5000, monthlyExpenses: 2000, monthlyDebtPayments: 500, netCashFlow: 2500 },
      budgetSnapshot: { totalSpent: 1200, totalBudgeted: 2000, overBudgetCategories: [] },
      healthScore: { score: 80, grade: 'B', trend: 'improving' },
      actionPlan: { total: 4, completed: 2, nextActionTitle: 'Pay highest APR card' },
      topGuidance: [],
      dueSoon: [{ id: 'debt-1', name: 'Visa', minimumPayment: 75, daysUntilDue: 2 }],
    },
  }),
}));

vi.mock('@/features/guidance/hooks', () => ({
  useGuidance: () => ({ isLoading: false, data: [] }),
}));

describe('DashboardPage', () => {
  it('renders dashboard data from the backend hook', () => {
    render(<DashboardPage />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Welcome back, Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Visa/)).toBeInTheDocument();
    expect(screen.getByText('Pay highest APR card')).toBeInTheDocument();
    expect(screen.getByText('Open ARIA')).toBeInTheDocument();
  });
});

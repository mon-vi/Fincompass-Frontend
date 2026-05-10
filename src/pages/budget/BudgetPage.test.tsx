import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BudgetPage } from './BudgetPage';

const mocks = vi.hoisted(() => ({
  budget: null as object | null,
  isLoading: false,
  isError: false,
  error: null as Error | null,
  calculate: vi.fn(),
  isPending: false,
  calculateError: null as Error | null,
}));

vi.mock('@/features/budget/hooks', () => ({
  useBudget: () => ({
    data: mocks.budget,
    isLoading: mocks.isLoading,
    isError: mocks.isError,
    error: mocks.error,
  }),
  useCalculateBudget: () => ({
    mutate: mocks.calculate,
    isPending: mocks.isPending,
    isError: !!mocks.calculateError,
    error: mocks.calculateError,
  }),
  useUpdateBudget: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe('BudgetPage', () => {
  beforeEach(() => {
    mocks.budget = null;
    mocks.isLoading = false;
    mocks.isError = false;
    mocks.error = null;
    mocks.calculate = vi.fn();
    mocks.isPending = false;
    mocks.calculateError = null;
  });

  it('shows empty state when budget is null', () => {
    render(<BudgetPage />);

    expect(screen.getByText(/budget has not been calculated yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate budget/i })).toBeInTheDocument();
  });

  it('calls calculate on CTA click', async () => {
    render(<BudgetPage />);

    await userEvent.click(screen.getByRole('button', { name: /calculate budget/i }));

    expect(mocks.calculate).toHaveBeenCalled();
  });

  it('shows loading skeleton while fetching', () => {
    mocks.isLoading = true;
    render(<BudgetPage />);

    expect(screen.queryByText(/calculate budget/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/monthly overview/i)).not.toBeInTheDocument();
  });

  it('shows error alert on fetch failure', () => {
    mocks.isError = true;
    mocks.error = new Error('Network error');
    render(<BudgetPage />);

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('renders budget overview when data is present', () => {
    mocks.budget = {
      month: '2026-05',
      totalBudgeted: 3000,
      totalSpent: 2200,
      categories: [],
    };
    render(<BudgetPage />);

    expect(screen.getByText(/monthly overview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$2,200/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$3,000/).length).toBeGreaterThan(0);
  });

  it('shows over-budget warning when spent exceeds budgeted', () => {
    mocks.budget = {
      month: '2026-05',
      totalBudgeted: 2000,
      totalSpent: 2500,
      categories: [],
    };
    render(<BudgetPage />);

    expect(screen.getByText(/over budget this month/i)).toBeInTheDocument();
  });
});

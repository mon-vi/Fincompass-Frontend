import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnboarding } from './useOnboarding';
import { useOnboardingStore } from '../store/onboardingStore';
import type { ReactNode } from 'react';

const mocks = vi.hoisted(() => ({
  createIncome: vi.fn(),
  createDebt: vi.fn(),
  bulkCreateExpenses: vi.fn(),
  advance: vi.fn(),
  generateArtifacts: vi.fn(),
}));

vi.mock('@/features/income/services', () => ({
  incomeAdapter: { create: mocks.createIncome },
  buildOnboardingIncomePayload: (data: { monthlyIncome: number; incomeType: string }) => ({
    sourceName: 'Primary income',
    type: data.incomeType === 'self_employed' ? 'freelance' : data.incomeType === 'salary' ? 'salary' : 'other',
    amount: data.monthlyIncome,
    frequency: 'monthly',
    isActive: true,
    notes: 'Created during onboarding.',
  }),
}));

vi.mock('@/features/debts/services', () => ({
  debtsAdapter: { create: mocks.createDebt },
  buildOnboardingDebtPayload: (data: { hasDebts: boolean; totalDebtBalance?: number; averageInterestRate?: number; primaryDebtType?: string }) =>
    data.hasDebts
      ? ({
          name: 'Primary onboarding debt',
          type: data.primaryDebtType === 'car_loan' ? 'auto_loan' : data.primaryDebtType,
          balance: data.totalDebtBalance,
          originalBalance: data.totalDebtBalance,
          interestRate: data.averageInterestRate ?? 0,
          minimumPayment: 300,
          dueDayOfMonth: 1,
        })
      : null,
}));

vi.mock('@/features/expenses/services', () => ({
  expensesAdapter: { bulkCreate: mocks.bulkCreateExpenses },
  buildOnboardingExpensePayload: (data: Record<string, number>) => ({
    expenses: Object.entries(data)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({ category, amount, description: category, date: '2026-04-01', isRecurring: true })),
  }),
}));

vi.mock('../services', () => ({
  onboardingAdapter: { advance: mocks.advance },
  generatePostOnboardingArtifacts: mocks.generateArtifacts,
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return (
    <MemoryRouter>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
}

function Harness() {
  const {
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    handleReviewComplete,
    submitError,
  } = useOnboarding();
  return (
    <div>
      {submitError && <p>{submitError.message}</p>}
      <button type="button" onClick={() => handleStep1Complete({ goals: ['pay_off_debt'] })}>
        Continue goals
      </button>
      <button type="button" onClick={() => handleStep2Complete({ monthlyIncome: 3000, incomeType: 'salary' })}>
        Continue income
      </button>
      <button
        type="button"
        onClick={() =>
          handleStep3Complete({ hasDebts: true, totalDebtBalance: 15000, averageInterestRate: 18, primaryDebtType: 'car_loan' })
        }
      >
        Continue debt
      </button>
      <button
        type="button"
        onClick={() => handleStep4Complete({ housing: 1200, transportation: 400, food: 600, utilities: 0, other: 0 })}
      >
        Complete expenses
      </button>
      <button type="button" onClick={handleReviewComplete}>
        Finish review
      </button>
    </div>
  );
}

describe('useOnboarding', () => {
  beforeEach(() => {
    mocks.createIncome.mockReset();
    mocks.createDebt.mockReset();
    mocks.bulkCreateExpenses.mockReset();
    mocks.advance.mockReset();
    mocks.generateArtifacts.mockReset();
    mocks.createIncome.mockResolvedValue({ id: 'income-1' });
    mocks.createDebt.mockResolvedValue({ id: 'debt-1' });
    mocks.bulkCreateExpenses.mockResolvedValue([{ id: 'expense-1' }]);
    mocks.advance.mockResolvedValue({ nextStep: 3, onboardingStatus: 'pending' });
    mocks.generateArtifacts.mockResolvedValue(undefined);
    useOnboardingStore.getState().reset();
    useOnboardingStore.getState().setStep(2);
  });

  it('creates an income source before advancing from step 2', async () => {
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Continue income' }));

    await waitFor(() => expect(mocks.advance).toHaveBeenCalled());
    expect(mocks.createIncome).toHaveBeenCalledWith({
      sourceName: 'Primary income',
      type: 'salary',
      amount: 3000,
      frequency: 'monthly',
      isActive: true,
      notes: 'Created during onboarding.',
    });
    expect(mocks.createIncome.mock.invocationCallOrder[0]).toBeLessThan(mocks.advance.mock.invocationCallOrder[0]);
    expect(screen.queryByText('Please add at least one income source before continuing.')).not.toBeInTheDocument();
  });

  it('advances step 1 goals without calling income/debt/expense endpoints', async () => {
    useOnboardingStore.getState().setStep(1);
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Continue goals' }));

    await waitFor(() => expect(mocks.advance).toHaveBeenCalledWith({ step: 1, data: { goals: ['pay_off_debt'] } }));
    expect(mocks.createIncome).not.toHaveBeenCalled();
    expect(mocks.createDebt).not.toHaveBeenCalled();
    expect(mocks.bulkCreateExpenses).not.toHaveBeenCalled();
  });

  it('creates a debt before advancing from step 3', async () => {
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Continue debt' }));

    await waitFor(() => expect(mocks.advance).toHaveBeenCalled());
    expect(mocks.createDebt).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auto_loan', balance: 15000, minimumPayment: 300 }),
    );
    expect(mocks.createDebt.mock.invocationCallOrder[0]).toBeLessThan(mocks.advance.mock.invocationCallOrder[0]);
  });

  it('saves expenses to backend when completing step 4, without calling advance', async () => {
    useOnboardingStore.getState().setStep(4);
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Complete expenses' }));

    await waitFor(() => expect(mocks.bulkCreateExpenses).toHaveBeenCalled());
    expect(mocks.advance).not.toHaveBeenCalled();
    expect(mocks.generateArtifacts).not.toHaveBeenCalled();
    expect(mocks.bulkCreateExpenses).toHaveBeenCalledWith({
      expenses: [
        expect.objectContaining({ category: 'housing', amount: 1200 }),
        expect.objectContaining({ category: 'transportation', amount: 400 }),
        expect.objectContaining({ category: 'food', amount: 600 }),
      ],
    });
  });

  it('calls advance and triggers artifact generation when user finishes review', async () => {
    useOnboardingStore.getState().saveStep3({ hasDebts: true, totalDebtBalance: 15000, primaryDebtType: 'credit_card' });
    useOnboardingStore.getState().saveStep4({ housing: 1200, transportation: 400, food: 600, utilities: 0, other: 0 });
    mocks.advance.mockResolvedValue({ nextStep: null, onboardingStatus: 'complete' });

    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Finish review' }));

    await waitFor(() => expect(mocks.generateArtifacts).toHaveBeenCalledWith({ hasDebts: true }));
    expect(mocks.advance).toHaveBeenCalledWith({
      step: 4,
      data: expect.objectContaining({ housing: 1200, transportation: 400, food: 600 }),
    });
    expect(mocks.advance.mock.invocationCallOrder[0]).toBeLessThan(mocks.generateArtifacts.mock.invocationCallOrder[0]);
  });

  it('skips debt creation when user declares no debts', async () => {
    function NoDebtHarness() {
      const { handleStep3Complete, submitError } = useOnboarding();
      return (
        <div>
          {submitError && <p>{submitError.message}</p>}
          <button type="button" onClick={() => handleStep3Complete({ hasDebts: false })}>
            Continue no debt
          </button>
        </div>
      );
    }

    render(<NoDebtHarness />, { wrapper });
    await userEvent.click(screen.getByRole('button', { name: 'Continue no debt' }));

    await waitFor(() => expect(mocks.advance).toHaveBeenCalled());
    expect(mocks.createDebt).not.toHaveBeenCalled();
  });

  it('skips bulkCreate when all expense amounts are zero', async () => {
    useOnboardingStore.getState().setStep(4);

    function ZeroExpenseHarness() {
      const { handleStep4Complete, submitError } = useOnboarding();
      return (
        <div>
          {submitError && <p>{submitError.message}</p>}
          <button
            type="button"
            onClick={() => handleStep4Complete({ housing: 0, transportation: 0, food: 0, utilities: 0, other: 0 })}
          >
            Complete zero expenses
          </button>
        </div>
      );
    }

    render(<ZeroExpenseHarness />, { wrapper });
    await userEvent.click(screen.getByRole('button', { name: 'Complete zero expenses' }));

    // Step 4 completes locally without advance — verify bulk create was skipped
    await waitFor(() => expect(useOnboardingStore.getState().step4).toBeDefined());
    expect(mocks.bulkCreateExpenses).not.toHaveBeenCalled();
    expect(mocks.advance).not.toHaveBeenCalled();
  });

  it('dashboard query is invalidated after onboarding completes', async () => {
    useOnboardingStore.getState().saveStep3({ hasDebts: false });
    useOnboardingStore.getState().saveStep4({ housing: 0, transportation: 0, food: 0, utilities: 0, other: 0 });
    mocks.advance.mockResolvedValue({ nextStep: null, onboardingStatus: 'complete' });

    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    function DashboardHarness() {
      const { handleReviewComplete } = useOnboarding();
      return (
        <button type="button" onClick={handleReviewComplete}>
          Finish review
        </button>
      );
    }

    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <DashboardHarness />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Finish review' }));

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['dashboard'] })),
    );
  });
});

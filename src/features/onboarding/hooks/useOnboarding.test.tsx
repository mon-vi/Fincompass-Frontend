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
  buildOnboardingDebtPayload: (data: { hasDebts: boolean; totalDebtBalance?: number; averageInterestRate?: number; primaryDebtType?: string }) => data.hasDebts ? ({
    name: 'Primary onboarding debt',
    type: data.primaryDebtType === 'car_loan' ? 'auto_loan' : data.primaryDebtType,
    balance: data.totalDebtBalance,
    originalBalance: data.totalDebtBalance,
    interestRate: data.averageInterestRate ?? 0,
    minimumPayment: 300,
    dueDayOfMonth: 1,
  }) : null,
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
  const { handleStep2Complete, handleStep3Complete, handleStep4Complete, submitError } = useOnboarding();
  return (
    <div>
      {submitError && <p>{submitError.message}</p>}
      <button type="button" onClick={() => handleStep2Complete({ monthlyIncome: 3000, incomeType: 'salary' })}>
        Continue income
      </button>
      <button type="button" onClick={() => handleStep3Complete({ hasDebts: true, totalDebtBalance: 15000, averageInterestRate: 18, primaryDebtType: 'car_loan' })}>
        Continue debt
      </button>
      <button type="button" onClick={() => handleStep4Complete({ housing: 1200, transportation: 400, food: 600, utilities: 0, other: 0 })}>
        Complete expenses
      </button>
    </div>
  );
}

describe('useOnboarding income step', () => {
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

  it('creates a debt before advancing from step 3', async () => {
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Continue debt' }));

    await waitFor(() => expect(mocks.advance).toHaveBeenCalled());
    expect(mocks.createDebt).toHaveBeenCalledWith(expect.objectContaining({
      type: 'auto_loan',
      balance: 15000,
      minimumPayment: 300,
    }));
    expect(mocks.createDebt.mock.invocationCallOrder[0]).toBeLessThan(mocks.advance.mock.invocationCallOrder[0]);
  });

  it('creates expenses and triggers generators before completing onboarding', async () => {
    useOnboardingStore.getState().saveStep3({ hasDebts: true, totalDebtBalance: 15000, primaryDebtType: 'credit_card' });
    mocks.advance.mockResolvedValue({ nextStep: null, onboardingStatus: 'complete' });
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Complete expenses' }));

    await waitFor(() => expect(mocks.generateArtifacts).toHaveBeenCalledWith({ hasDebts: true }));
    expect(mocks.bulkCreateExpenses).toHaveBeenCalledWith({
      expenses: [
        expect.objectContaining({ category: 'housing', amount: 1200 }),
        expect.objectContaining({ category: 'transportation', amount: 400 }),
        expect.objectContaining({ category: 'food', amount: 600 }),
      ],
    });
    expect(mocks.bulkCreateExpenses.mock.invocationCallOrder[0]).toBeLessThan(mocks.advance.mock.invocationCallOrder[0]);
    expect(mocks.advance.mock.invocationCallOrder[0]).toBeLessThan(mocks.generateArtifacts.mock.invocationCallOrder[0]);
  });
});

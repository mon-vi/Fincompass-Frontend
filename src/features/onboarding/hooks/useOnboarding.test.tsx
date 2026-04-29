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
  advance: vi.fn(),
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

vi.mock('../services', () => ({
  onboardingAdapter: { advance: mocks.advance },
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
  const { handleStep2Complete, submitError } = useOnboarding();
  return (
    <div>
      {submitError && <p>{submitError.message}</p>}
      <button type="button" onClick={() => handleStep2Complete({ monthlyIncome: 3000, incomeType: 'salary' })}>
        Continue
      </button>
    </div>
  );
}

describe('useOnboarding income step', () => {
  beforeEach(() => {
    mocks.createIncome.mockReset();
    mocks.advance.mockReset();
    mocks.createIncome.mockResolvedValue({ id: 'income-1' });
    mocks.advance.mockResolvedValue({ nextStep: 3, onboardingStatus: 'pending' });
    useOnboardingStore.getState().reset();
    useOnboardingStore.getState().setStep(2);
  });

  it('creates an income source before advancing from step 2', async () => {
    render(<Harness />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

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
});

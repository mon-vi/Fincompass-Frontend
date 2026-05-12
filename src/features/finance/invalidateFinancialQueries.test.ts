import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { invalidateFinancialQueries, FINANCIAL_QUERY_KEYS } from './invalidateFinancialQueries';

// ─── Adapter mocks ────────────────────────────────────────────────────────────

const mocks = vi.hoisted(() => ({
  incomeCreate: vi.fn(),
  debtCreate: vi.fn(),
  expenseCreate: vi.fn(),
  ocrConfirm: vi.fn(),
  emailParserApply: vi.fn(),
}));

vi.mock('@/features/income/services', () => ({
  incomeAdapter: { create: mocks.incomeCreate, list: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/features/debts/services', () => ({
  debtsAdapter: { create: mocks.debtCreate, list: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/features/expenses/services', () => ({
  expensesAdapter: { create: mocks.expenseCreate, list: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@/features/ocr/services', () => ({
  ocrAdapter: { confirmSession: mocks.ocrConfirm, getSession: vi.fn() },
}));
vi.mock('@/features/email-parser/services', () => ({
  emailParserAdapter: {
    applyEvent: mocks.emailParserApply,
    listEvents: vi.fn().mockResolvedValue([]),
    getForwardingAddress: vi.fn(),
    getEvent: vi.fn(),
    dismissEvent: vi.fn(),
  },
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
}

function wrapper(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

// ─── invalidateFinancialQueries unit test ─────────────────────────────────────

describe('invalidateFinancialQueries', () => {
  it('invalidates every key in FINANCIAL_QUERY_KEYS', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();

    invalidateFinancialQueries(qc);

    expect(spy).toHaveBeenCalledTimes(FINANCIAL_QUERY_KEYS.length);
    for (const queryKey of FINANCIAL_QUERY_KEYS) {
      expect(spy).toHaveBeenCalledWith({ queryKey });
    }
  });

  it('invalidates dashboard', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();
    invalidateFinancialQueries(qc);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
  });

  it('invalidates budget', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();
    invalidateFinancialQueries(qc);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['budget'] });
  });

  it('invalidates health-score', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();
    invalidateFinancialQueries(qc);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['health-score'] });
  });

  it('invalidates timeline', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();
    invalidateFinancialQueries(qc);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['timeline'] });
  });

  it('invalidates guidance and action-plan', () => {
    const qc = makeClient();
    const spy = vi.spyOn(qc, 'invalidateQueries').mockResolvedValue();
    invalidateFinancialQueries(qc);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['guidance'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['action-plan'] });
  });
});

// ─── Mutation hook integration tests ─────────────────────────────────────────

describe('useCreateIncome invalidation', () => {
  let client: QueryClient;
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mocks.incomeCreate.mockResolvedValue({ id: 'inc-1', monthlyAmount: 3000 });
    client = makeClient();
    spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
  });

  it('invalidates dashboard, budget, and health-score after income is created', async () => {
    const { useCreateIncome } = await import('@/features/income/hooks/useIncome');
    const { result } = renderHook(() => useCreateIncome(), { wrapper: wrapper(client) });

    result.current.mutate({
      sourceName: 'Job', type: 'salary', amount: 3000, frequency: 'monthly', isActive: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['budget'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['health-score'] });
  });
});

describe('useCreateDebt invalidation', () => {
  let client: QueryClient;
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mocks.debtCreate.mockResolvedValue({ id: 'debt-1', name: 'Car', balance: 10000 });
    client = makeClient();
    spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
  });

  it('invalidates dashboard, timeline, and guidance/action-plan after debt is created', async () => {
    const { useCreateDebt } = await import('@/features/debts/hooks/useDebts');
    const { result } = renderHook(() => useCreateDebt(), { wrapper: wrapper(client) });

    result.current.mutate({
      name: 'Car', type: 'auto_loan', balance: 10000, originalBalance: 10000,
      interestRate: 5, minimumPayment: 200, dueDayOfMonth: 1,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['timeline'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['guidance'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['action-plan'] });
  });
});

describe('useCreateExpense invalidation', () => {
  let client: QueryClient;
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mocks.expenseCreate.mockResolvedValue({ id: 'exp-1', amount: 50 });
    client = makeClient();
    spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
  });

  it('invalidates dashboard and budget after expense is created', async () => {
    const { useCreateExpense } = await import('@/features/expenses/hooks/useExpenses');
    const { result } = renderHook(() => useCreateExpense(), { wrapper: wrapper(client) });

    result.current.mutate({
      amount: 50, category: 'food', description: 'Lunch', date: '2026-05-01', isRecurring: false,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['budget'] });
  });
});

describe('useOcrConfirm invalidation', () => {
  let client: QueryClient;
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mocks.ocrConfirm.mockResolvedValue({ sessionId: 's1', status: 'confirmed' });
    client = makeClient();
    spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
  });

  it('invalidates all financial queries after OCR session is confirmed', async () => {
    const { useOcrConfirm } = await import('@/features/ocr/hooks/useOcr');
    const { result } = renderHook(() => useOcrConfirm('s1'), { wrapper: wrapper(client) });

    result.current.mutate({ items: [] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    for (const queryKey of FINANCIAL_QUERY_KEYS) {
      expect(spy).toHaveBeenCalledWith({ queryKey });
    }
  });
});

describe('useApplyEmailParserEvent invalidation', () => {
  let client: QueryClient;
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mocks.emailParserApply.mockResolvedValue({ id: 'ev1', status: 'applied' });
    client = makeClient();
    spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
  });

  it('invalidates email-parser events and all financial queries after event is applied', async () => {
    const { useApplyEmailParserEvent } = await import('@/features/email-parser/hooks/useEmailParser');
    const { result } = renderHook(() => useApplyEmailParserEvent(), { wrapper: wrapper(client) });

    result.current.mutate({ id: 'ev1' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(spy).toHaveBeenCalledWith({ queryKey: ['email-parser', 'events'] });
    for (const queryKey of FINANCIAL_QUERY_KEYS) {
      expect(spy).toHaveBeenCalledWith({ queryKey });
    }
  });
});

import type { Debt, CreateDebtPayload, UpdateDebtPayload, DebtsApiAdapter } from './debtsApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockDebts: Debt[] = [
  {
    id: 'debt-1',
    name: 'Chase Freedom Visa',
    type: 'credit_card',
    balance: 8500,
    originalBalance: 11000,
    interestRate: 22.99,
    minimumPayment: 200,
    dueDayOfMonth: 15,
    isPaid: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'debt-2',
    name: 'Toyota Auto Loan',
    type: 'auto_loan',
    balance: 12000,
    originalBalance: 18000,
    interestRate: 6.9,
    minimumPayment: 285,
    dueDayOfMonth: 22,
    isPaid: false,
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'debt-3',
    name: 'Federal Student Loan',
    type: 'student_loan',
    balance: 23000,
    originalBalance: 28000,
    interestRate: 5.5,
    minimumPayment: 215,
    dueDayOfMonth: 1,
    isPaid: false,
    createdAt: '2020-09-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z',
  },
];

let nextId = 4;

export const debtsMock: DebtsApiAdapter = {
  async list(): Promise<Debt[]> {
    await delay(500);
    return [...mockDebts];
  },

  async get(id: string): Promise<Debt> {
    await delay(300);
    const debt = mockDebts.find((d) => d.id === id);
    if (!debt) throw new Error('Debt not found');
    return { ...debt };
  },

  async create(payload: CreateDebtPayload): Promise<Debt> {
    await delay(700);
    const newDebt: Debt = {
      ...payload,
      id: `debt-${nextId++}`,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDebts.push(newDebt);
    return { ...newDebt };
  },

  async update(id: string, payload: UpdateDebtPayload): Promise<Debt> {
    await delay(600);
    const idx = mockDebts.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Debt not found');
    mockDebts[idx] = { ...mockDebts[idx], ...payload, updatedAt: new Date().toISOString() };
    return { ...mockDebts[idx] };
  },

  async remove(id: string): Promise<void> {
    await delay(600);
    const idx = mockDebts.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Debt not found');
    mockDebts.splice(idx, 1);
  },

  async markPaid(id: string): Promise<Debt> {
    await delay(500);
    const idx = mockDebts.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Debt not found');
    mockDebts[idx] = { ...mockDebts[idx], isPaid: true, balance: 0, updatedAt: new Date().toISOString() };
    return { ...mockDebts[idx] };
  },
};

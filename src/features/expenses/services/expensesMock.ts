import type { Expense, CreateExpensePayload, UpdateExpensePayload, BulkCreateExpensePayload, ExpensesApiAdapter } from './expensesApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockExpenses: Expense[] = [
  { id: 'exp-1', amount: 1200, category: 'housing', description: 'Rent', date: '2026-04-01', isRecurring: true, source: 'manual', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: 'exp-2', amount: 85, category: 'transportation', description: 'Monthly subway pass', date: '2026-04-01', isRecurring: true, source: 'manual', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: 'exp-3', amount: 620, category: 'food', description: 'Groceries & restaurants', date: '2026-04-20', isRecurring: false, source: 'manual', createdAt: '2026-04-20T00:00:00Z', updatedAt: '2026-04-20T00:00:00Z' },
  { id: 'exp-4', amount: 140, category: 'utilities', description: 'Electric + internet', date: '2026-04-05', isRecurring: true, source: 'manual', createdAt: '2026-04-05T00:00:00Z', updatedAt: '2026-04-05T00:00:00Z' },
  { id: 'exp-5', amount: 45, category: 'entertainment', description: 'Netflix + Spotify', date: '2026-04-03', isRecurring: true, source: 'manual', createdAt: '2026-04-03T00:00:00Z', updatedAt: '2026-04-03T00:00:00Z' },
  { id: 'exp-6', amount: 120, category: 'other', description: 'Misc purchases', date: '2026-04-18', isRecurring: false, source: 'manual', createdAt: '2026-04-18T00:00:00Z', updatedAt: '2026-04-18T00:00:00Z' },
  { id: 'exp-7', amount: 295, category: 'transportation', description: 'Gas for the month', date: '2026-04-15', isRecurring: false, source: 'manual', createdAt: '2026-04-15T00:00:00Z', updatedAt: '2026-04-15T00:00:00Z' },
];

let nextId = 8;

export const expensesMock: ExpensesApiAdapter = {
  async list(_params): Promise<Expense[]> {
    await delay(450);
    return mockExpenses.map((e) => ({ ...e }));
  },

  async create(payload: CreateExpensePayload): Promise<Expense> {
    await delay(600);
    const expense: Expense = {
      ...payload,
      id: `exp-${nextId++}`,
      isRecurring: payload.isRecurring ?? false,
      source: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockExpenses.push(expense);
    return { ...expense };
  },

  async update(id: string, payload: UpdateExpensePayload): Promise<Expense> {
    await delay(500);
    const idx = mockExpenses.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Expense not found');
    mockExpenses[idx] = { ...mockExpenses[idx], ...payload, updatedAt: new Date().toISOString() };
    return { ...mockExpenses[idx] };
  },

  async remove(id: string): Promise<void> {
    await delay(400);
    const idx = mockExpenses.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Expense not found');
    mockExpenses.splice(idx, 1);
  },

  async bulkCreate(payload: BulkCreateExpensePayload): Promise<Expense[]> {
    await delay(700);
    return payload.expenses.map((p) => {
      const expense: Expense = {
        ...p,
        id: `exp-${nextId++}`,
        isRecurring: p.isRecurring ?? false,
        source: 'ocr',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockExpenses.push(expense);
      return { ...expense };
    });
  },
};

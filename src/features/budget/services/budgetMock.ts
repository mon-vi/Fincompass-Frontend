import type { Budget, BudgetApiAdapter, UpdateBudgetPayload } from './budgetApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

let mockBudget: Budget = {
  month: '2026-04',
  totalBudgeted: 2650,
  totalSpent: 2505,
  categories: [
    { id: 'cat-1', name: 'Housing', budgeted: 1200, spent: 1200, icon: '🏠' },
    { id: 'cat-2', name: 'Transportation', budgeted: 400, spent: 380, icon: '🚗' },
    { id: 'cat-3', name: 'Food & Dining', budgeted: 500, spent: 620, icon: '🍽️' },
    { id: 'cat-4', name: 'Utilities', budgeted: 150, spent: 140, icon: '💡' },
    { id: 'cat-5', name: 'Entertainment', budgeted: 100, spent: 45, icon: '🎬' },
    { id: 'cat-6', name: 'Other', budgeted: 300, spent: 120, icon: '📦' },
  ],
};

export const budgetMock: BudgetApiAdapter = {
  async get(): Promise<Budget> {
    await delay(500);
    return { ...mockBudget, categories: mockBudget.categories.map((c) => ({ ...c })) };
  },

  async update(payload: UpdateBudgetPayload): Promise<Budget> {
    await delay(700);
    const updatedCategories = mockBudget.categories.map((cat) => {
      const update = payload.categories.find((u) => u.id === cat.id);
      return update ? { ...cat, budgeted: update.budgeted } : cat;
    });
    const totalBudgeted = updatedCategories.reduce((sum, c) => sum + c.budgeted, 0);
    mockBudget = { ...mockBudget, categories: updatedCategories, totalBudgeted };
    return { ...mockBudget, categories: mockBudget.categories.map((c) => ({ ...c })) };
  },
};

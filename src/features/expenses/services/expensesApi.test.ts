import { describe, expect, it } from 'vitest';
import { buildOnboardingExpensePayload } from './expensesApi';

describe('expense onboarding mapping', () => {
  it('builds recurring monthly expense payloads and skips zero amounts', () => {
    const payload = buildOnboardingExpensePayload({ housing: 1200, transportation: 400, food: 0, utilities: 150, other: 0 });

    expect(payload.expenses).toEqual([
      expect.objectContaining({ category: 'housing', amount: 1200, description: 'Housing', isRecurring: true }),
      expect.objectContaining({ category: 'transportation', amount: 400, description: 'Transportation', isRecurring: true }),
      expect.objectContaining({ category: 'utilities', amount: 150, description: 'Utilities & subscriptions', isRecurring: true }),
    ]);
  });
});

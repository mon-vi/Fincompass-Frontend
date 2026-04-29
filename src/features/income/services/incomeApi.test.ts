import { describe, expect, it } from 'vitest';
import { buildOnboardingIncomePayload, mapOnboardingIncomeType } from './incomeApi';

describe('income onboarding mapping', () => {
  it('maps frontend income types to backend income types', () => {
    expect(mapOnboardingIncomeType('salary')).toBe('salary');
    expect(mapOnboardingIncomeType('self_employed')).toBe('freelance');
    expect(mapOnboardingIncomeType('mixed')).toBe('other');
  });

  it('builds a valid monthly income source payload', () => {
    expect(buildOnboardingIncomePayload({ monthlyIncome: 4500, incomeType: 'mixed' })).toEqual({
      sourceName: 'Primary income',
      type: 'other',
      amount: 4500,
      frequency: 'monthly',
      isActive: true,
      notes: 'Created during onboarding.',
    });
  });
});

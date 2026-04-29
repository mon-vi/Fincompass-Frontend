import { describe, expect, it } from 'vitest';
import { buildOnboardingDebtPayload, mapOnboardingDebtType } from './debtsApi';

describe('debt onboarding mapping', () => {
  it('maps onboarding debt type to backend debt type', () => {
    expect(mapOnboardingDebtType('car_loan')).toBe('auto_loan');
    expect(mapOnboardingDebtType('credit_card')).toBe('credit_card');
    expect(mapOnboardingDebtType('unknown')).toBe('other');
  });

  it('builds an aggregate debt payload when user has debts', () => {
    expect(buildOnboardingDebtPayload({ hasDebts: true, totalDebtBalance: 10000, averageInterestRate: 20, primaryDebtType: 'credit_card' })).toEqual({
      name: 'Primary onboarding debt',
      type: 'credit_card',
      balance: 10000,
      originalBalance: 10000,
      interestRate: 20,
      minimumPayment: 200,
      dueDayOfMonth: 1,
    });
  });

  it('does not create a debt payload when user has no debts', () => {
    expect(buildOnboardingDebtPayload({ hasDebts: false })).toBeNull();
  });
});

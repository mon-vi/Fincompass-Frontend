import type { IncomeType } from '@/features/onboarding/validation';

export type BackendIncomeType = 'salary' | 'freelance' | 'rental' | 'investment' | 'pension' | 'other';
export type IncomeFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

export interface IncomeRecord {
  id: string;
  sourceName: string;
  type: BackendIncomeType;
  amount: number;
  frequency: IncomeFrequency;
  monthlyAmount: number;
  isActive: boolean;
}

export interface CreateIncomePayload {
  sourceName: string;
  type: BackendIncomeType;
  amount: number;
  frequency: IncomeFrequency;
  isActive?: boolean;
  notes?: string;
}

export interface IncomeApiAdapter {
  create(payload: CreateIncomePayload): Promise<IncomeRecord>;
}

export function mapOnboardingIncomeType(type: IncomeType): BackendIncomeType {
  if (type === 'salary') return 'salary';
  if (type === 'self_employed') return 'freelance';
  return 'other';
}

export function buildOnboardingIncomePayload(data: { monthlyIncome: number; incomeType: IncomeType }): CreateIncomePayload {
  return {
    sourceName: 'Primary income',
    type: mapOnboardingIncomeType(data.incomeType),
    amount: data.monthlyIncome,
    frequency: 'monthly',
    isActive: true,
    notes: 'Created during onboarding.',
  };
}

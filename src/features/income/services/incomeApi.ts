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

export interface UpdateIncomePayload {
  sourceName?: string;
  type?: BackendIncomeType;
  amount?: number;
  frequency?: IncomeFrequency;
  isActive?: boolean;
  notes?: string;
}

export interface IncomeApiAdapter {
  list(): Promise<IncomeRecord[]>;
  create(payload: CreateIncomePayload): Promise<IncomeRecord>;
  update(id: string, payload: UpdateIncomePayload): Promise<IncomeRecord>;
  remove(id: string): Promise<void>;
}

export const INCOME_TYPE_LABELS: Record<BackendIncomeType, string> = {
  salary: 'Salary',
  freelance: 'Freelance / Self-employed',
  rental: 'Rental income',
  investment: 'Investment returns',
  pension: 'Pension',
  other: 'Other',
};

export const INCOME_FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
  one_time: 'One-time',
};

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

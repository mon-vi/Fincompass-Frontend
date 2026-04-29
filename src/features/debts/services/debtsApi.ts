export type DebtType =
  | 'credit_card'
  | 'student_loan'
  | 'personal_loan'
  | 'auto_loan'
  | 'mortgage'
  | 'medical'
  | 'other';

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDayOfMonth: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDebtPayload {
  name: string;
  type: DebtType;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDayOfMonth: number;
}

export type UpdateDebtPayload = Partial<CreateDebtPayload>;

export interface DebtsApiAdapter {
  /** GET /api/v1/debts */
  list(): Promise<Debt[]>;
  /** GET /api/v1/debts/{id} */
  get(id: string): Promise<Debt>;
  /** POST /api/v1/debts */
  create(payload: CreateDebtPayload): Promise<Debt>;
  /** PATCH /api/v1/debts/{id} */
  update(id: string, payload: UpdateDebtPayload): Promise<Debt>;
  /** DELETE /api/v1/debts/{id} */
  remove(id: string): Promise<void>;
  /** POST /api/v1/debts/{id}/mark-paid */
  markPaid(id: string): Promise<Debt>;
}

export function mapOnboardingDebtType(type: string): DebtType {
  if (type === 'car_loan') return 'auto_loan';
  if (
    type === 'credit_card'
    || type === 'student_loan'
    || type === 'personal_loan'
    || type === 'auto_loan'
    || type === 'mortgage'
    || type === 'medical'
    || type === 'other'
  ) return type;
  return 'other';
}

export function buildOnboardingDebtPayload(data: {
  hasDebts: boolean;
  totalDebtBalance?: number;
  averageInterestRate?: number;
  primaryDebtType?: string;
}): CreateDebtPayload | null {
  if (!data.hasDebts || !data.totalDebtBalance || data.totalDebtBalance <= 0) return null;

  const balance = data.totalDebtBalance;
  return {
    name: 'Primary onboarding debt',
    type: mapOnboardingDebtType(data.primaryDebtType ?? 'other'),
    balance,
    originalBalance: balance,
    interestRate: data.averageInterestRate ?? 0,
    minimumPayment: Math.round(Math.max(25, balance * 0.02)),
    dueDayOfMonth: 1,
  };
}

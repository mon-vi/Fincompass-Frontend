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

import { z } from 'zod';

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['credit_card', 'student_loan', 'personal_loan', 'auto_loan', 'mortgage', 'medical', 'other']),
  balance: z.coerce.number({ error: 'Enter a valid amount' }).min(1, 'Balance must be greater than 0'),
  originalBalance: z.coerce.number({ error: 'Enter a valid amount' }).min(1, 'Original balance must be greater than 0'),
  interestRate: z.coerce.number({ error: 'Enter a valid rate' }).min(0).max(100),
  minimumPayment: z.coerce.number({ error: 'Enter a valid amount' }).min(1, 'Minimum payment must be greater than 0'),
  dueDayOfMonth: z.coerce.number().min(1).max(31),
});

export type DebtFormData = z.infer<typeof debtSchema>;

import type { Debt } from '../services/debtsApi';

export function debtToFormDefaults(debt: Debt): DebtFormData {
  return {
    name: debt.name,
    type: debt.type,
    balance: debt.balance,
    originalBalance: debt.originalBalance,
    interestRate: debt.interestRate,
    minimumPayment: debt.minimumPayment,
    dueDayOfMonth: debt.dueDayOfMonth,
  };
}

export const DEBT_TYPE_LABELS: Record<string, string> = {
  credit_card: 'Credit Card',
  student_loan: 'Student Loan',
  personal_loan: 'Personal Loan',
  auto_loan: 'Auto Loan',
  mortgage: 'Mortgage',
  medical: 'Medical',
  other: 'Other',
};

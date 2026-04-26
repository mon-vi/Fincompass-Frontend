import { z } from 'zod';

// ─── Goal Selection (Step 1) ────────────────────────────────────────────────

export const GOAL_OPTIONS = [
  {
    value: 'pay_off_debt' as const,
    label: 'Pay off debt',
    description: 'Eliminate credit cards, loans, and other outstanding balances',
  },
  {
    value: 'emergency_fund' as const,
    label: 'Build emergency fund',
    description: 'Set aside 3–6 months of living expenses for peace of mind',
  },
  {
    value: 'save_for_purchase' as const,
    label: 'Save for a purchase',
    description: 'House, car, vacation, or another major upcoming expense',
  },
  {
    value: 'grow_wealth' as const,
    label: 'Grow wealth',
    description: 'Invest and build long-term financial security',
  },
  {
    value: 'improve_cash_flow' as const,
    label: 'Improve cash flow',
    description: 'Have more money left over at the end of each month',
  },
] as const;

const GOAL_VALUES = GOAL_OPTIONS.map((g) => g.value) as [string, ...string[]];

export type GoalType = (typeof GOAL_OPTIONS)[number]['value'];

export const step1Schema = z.object({
  goals: z
    .array(z.enum(GOAL_VALUES as [GoalType, ...GoalType[]]))
    .min(1, 'Select at least one goal to continue'),
});

export type Step1Data = z.infer<typeof step1Schema>;

// ─── Income Setup (Step 2) ──────────────────────────────────────────────────

export const INCOME_TYPE_OPTIONS = [
  {
    value: 'salary' as const,
    label: 'Salary / employed',
    description: 'Fixed regular income from an employer',
  },
  {
    value: 'self_employed' as const,
    label: 'Self-employed',
    description: 'Freelance, business owner, or contract income',
  },
  {
    value: 'mixed' as const,
    label: 'Mixed income',
    description: 'Combination of salary and variable or side income',
  },
] as const;

export type IncomeType = (typeof INCOME_TYPE_OPTIONS)[number]['value'];

export const step2Schema = z.object({
  monthlyIncome: z.coerce
    .number()
    .refine((n) => n > 0, { message: 'Income must be greater than 0' }),
  incomeType: z.enum(
    INCOME_TYPE_OPTIONS.map((o) => o.value) as [IncomeType, ...IncomeType[]],
    { error: 'Select your income type' },
  ),
});

export type Step2Data = z.infer<typeof step2Schema>;

// ─── Debt Setup (Step 3) ────────────────────────────────────────────────────

export const DEBT_TYPE_OPTIONS = [
  { value: 'credit_card' as const, label: 'Credit card' },
  { value: 'student_loan' as const, label: 'Student loan' },
  { value: 'car_loan' as const, label: 'Car loan' },
  { value: 'mortgage' as const, label: 'Mortgage' },
  { value: 'personal_loan' as const, label: 'Personal loan' },
  { value: 'other' as const, label: 'Other' },
] as const;

export type DebtType = (typeof DEBT_TYPE_OPTIONS)[number]['value'];

export const step3Schema = z
  .object({
    hasDebts: z.boolean(),
    totalDebtBalance: z.coerce.number().min(0).optional(),
    averageInterestRate: z.coerce.number().min(0).max(100).optional(),
    primaryDebtType: z
      .enum(
        DEBT_TYPE_OPTIONS.map((o) => o.value) as [DebtType, ...DebtType[]],
      )
      .optional(),
  })
  .refine(
    (d) => !d.hasDebts || (d.totalDebtBalance != null && d.totalDebtBalance > 0),
    { message: 'Enter your total debt balance', path: ['totalDebtBalance'] },
  )
  .refine(
    (d) => !d.hasDebts || d.primaryDebtType != null,
    { message: 'Select your primary debt type', path: ['primaryDebtType'] },
  );

export type Step3Data = z.infer<typeof step3Schema>;

// ─── Expense Setup (Step 4) ─────────────────────────────────────────────────

export const EXPENSE_FIELDS = [
  { name: 'housing' as const, label: 'Housing (rent / mortgage)', placeholder: '1,200' },
  { name: 'transportation' as const, label: 'Transportation', placeholder: '400' },
  { name: 'food' as const, label: 'Food & groceries', placeholder: '600' },
  { name: 'utilities' as const, label: 'Utilities & subscriptions', placeholder: '200' },
  { name: 'other' as const, label: 'Other monthly expenses', placeholder: '300' },
] as const;

export const step4Schema = z.object({
  housing: z.coerce.number().min(0, 'Amount cannot be negative'),
  transportation: z.coerce.number().min(0, 'Amount cannot be negative'),
  food: z.coerce.number().min(0, 'Amount cannot be negative'),
  utilities: z.coerce.number().min(0, 'Amount cannot be negative'),
  other: z.coerce.number().min(0, 'Amount cannot be negative'),
});

export type Step4Data = z.infer<typeof step4Schema>;

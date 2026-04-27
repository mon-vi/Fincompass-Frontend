import { z } from 'zod';

const EXPENSE_CATEGORIES = [
  'housing', 'transportation', 'food', 'utilities',
  'entertainment', 'healthcare', 'personal', 'education', 'other',
] as const;

export const expenseSchema = z.object({
  amount: z.coerce.number({ error: 'Enter a valid amount' }).min(0.01, 'Amount must be greater than 0'),
  category: z.enum(EXPENSE_CATEGORIES, { error: 'Select a category' }),
  description: z.string().min(1, 'Description is required').max(200),
  date: z.string().min(1, 'Date is required'),
  isRecurring: z.boolean().default(false),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

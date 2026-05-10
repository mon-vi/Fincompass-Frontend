import { z } from 'zod';

const INCOME_TYPES = ['salary', 'freelance', 'rental', 'investment', 'pension', 'other'] as const;
const FREQUENCIES = ['weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'one_time'] as const;

export const incomeSchema = z.object({
  sourceName: z.string().min(1, 'Source name is required').max(100),
  type: z.enum(INCOME_TYPES, { error: 'Select a type' }),
  amount: z.coerce.number({ error: 'Enter a valid amount' }).min(0.01, 'Amount must be greater than 0'),
  frequency: z.enum(FREQUENCIES, { error: 'Select a frequency' }),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

import { ENV } from '@/constants/env';
import { expensesMock } from './expensesMock';
import { expensesReal } from './expensesReal';
import type { ExpensesApiAdapter } from './expensesApi';

export const expensesAdapter: ExpensesApiAdapter = ENV.USE_MOCK_API ? expensesMock : expensesReal;

export type {
  ExpensesApiAdapter,
  Expense,
  ExpenseCategory,
  ExpenseSource,
  CreateExpensePayload,
  UpdateExpensePayload,
  BulkCreateExpensePayload,
} from './expensesApi';

export { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS } from './expensesApi';

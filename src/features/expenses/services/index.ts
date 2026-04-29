import { expensesReal } from './expensesReal';
import type { ExpensesApiAdapter } from './expensesApi';

export const expensesAdapter: ExpensesApiAdapter = expensesReal;

export type {
  ExpensesApiAdapter,
  Expense,
  ExpenseCategory,
  ExpenseSource,
  CreateExpensePayload,
  UpdateExpensePayload,
  BulkCreateExpensePayload,
} from './expensesApi';

export { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS, buildOnboardingExpensePayload } from './expensesApi';

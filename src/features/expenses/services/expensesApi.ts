export type ExpenseCategory =
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'personal'
  | 'education'
  | 'other';

export type ExpenseSource = 'manual' | 'ocr' | 'email_parser';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  isRecurring: boolean;
  source: ExpenseSource;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  isRecurring?: boolean;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export interface BulkCreateExpensePayload {
  expenses: CreateExpensePayload[];
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  housing: 'Housing',
  transportation: 'Transportation',
  food: 'Food & Dining',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  healthcare: 'Healthcare',
  personal: 'Personal',
  education: 'Education',
  other: 'Other',
};

export const EXPENSE_CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  housing: '🏠',
  transportation: '🚗',
  food: '🍽️',
  utilities: '💡',
  entertainment: '🎬',
  healthcare: '🏥',
  personal: '👤',
  education: '📚',
  other: '📦',
};

export interface ExpensesApiAdapter {
  /** GET /api/v1/expenses?month=YYYY-MM */
  list(params?: { month?: string }): Promise<Expense[]>;
  /** POST /api/v1/expenses */
  create(payload: CreateExpensePayload): Promise<Expense>;
  /** PATCH /api/v1/expenses/{id} */
  update(id: string, payload: UpdateExpensePayload): Promise<Expense>;
  /** DELETE /api/v1/expenses/{id} */
  remove(id: string): Promise<void>;
  /** POST /api/v1/expenses/bulk */
  bulkCreate(payload: BulkCreateExpensePayload): Promise<Expense[]>;
}

export function buildOnboardingExpensePayload(data: Record<string, number>): BulkCreateExpensePayload {
  const names: Record<string, string> = {
    housing: 'Housing',
    transportation: 'Transportation',
    food: 'Food & groceries',
    utilities: 'Utilities & subscriptions',
    other: 'Other monthly expenses',
  };

  return {
    expenses: Object.entries(data)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        amount,
        category: category as ExpenseCategory,
        description: names[category] ?? 'Monthly expense',
        date: new Date().toISOString().slice(0, 10),
        isRecurring: true,
      })),
  };
}

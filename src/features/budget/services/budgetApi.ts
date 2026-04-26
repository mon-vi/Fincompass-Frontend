export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: string;
}

export interface Budget {
  month: string;
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export interface UpdateBudgetPayload {
  month: string;
  categories: Array<{ id: string; budgeted: number }>;
}

export interface BudgetApiAdapter {
  /** GET /api/v1/budget */
  get(): Promise<Budget>;
  /** POST /api/v1/budget */
  update(payload: UpdateBudgetPayload): Promise<Budget>;
}

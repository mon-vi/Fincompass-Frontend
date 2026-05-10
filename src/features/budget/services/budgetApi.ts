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
  /** GET /api/v1/budget — returns null when no budget has been calculated yet */
  get(): Promise<Budget | null>;
  /** POST /api/v1/budget/calculate — triggers budget calculation */
  calculate(): Promise<Budget>;
  /** POST /api/v1/budget */
  update(payload: UpdateBudgetPayload): Promise<Budget>;
}

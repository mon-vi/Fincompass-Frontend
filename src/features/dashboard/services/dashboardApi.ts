export interface FinancialSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyDebtPayments: number;
  netCashFlow: number;
}

export interface BudgetSnapshot {
  totalBudgeted: number;
  totalSpent: number;
  overBudgetCategories: string[];
}

export interface HealthScoreSummary {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  trend: 'improving' | 'stable' | 'declining';
}

export interface ActionPlanSummary {
  total: number;
  completed: number;
  nextActionTitle: string | null;
}

export interface GuidanceSummary {
  id: string;
  title: string;
  body: string;
  type: 'tip' | 'warning' | 'insight';
}

export interface DueSoonDebt {
  id: string;
  name: string;
  minimumPayment: number;
  daysUntilDue: number;
}

export interface DashboardData {
  financialSummary: FinancialSummary;
  budgetSnapshot: BudgetSnapshot;
  healthScore: HealthScoreSummary;
  actionPlan: ActionPlanSummary;
  topGuidance: GuidanceSummary[];
  dueSoon: DueSoonDebt[];
}

export interface DashboardApiAdapter {
  /** GET /api/v1/dashboard */
  getDashboard(): Promise<DashboardData>;
}

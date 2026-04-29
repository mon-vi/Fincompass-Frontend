import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { DashboardApiAdapter, DashboardData, GuidanceSummary } from './dashboardApi';

type BackendRecord = Record<string, unknown>;

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === 'object' ? value as BackendRecord : {};
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function gradeFromScore(score: number): DashboardData['healthScore']['grade'] {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function daysUntil(date: unknown): number {
  if (typeof date !== 'string') return 0;
  const due = new Date(`${date}T00:00:00`);
  if (Number.isNaN(due.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((due.getTime() - today.getTime()) / 86_400_000));
}

function mapGuidance(items: unknown): GuidanceSummary[] {
  return Array.isArray(items)
    ? items.map((item) => asRecord(item)).map((item) => ({
      id: String(item.id ?? ''),
      title: String(item.title ?? 'Insight'),
      body: String(item.body ?? ''),
      type: item.type === 'warning' || item.type === 'insight' || item.type === 'tip' ? item.type : 'insight',
    }))
    : [];
}

function mapDashboard(raw: BackendRecord): DashboardData {
  const budget = asRecord(raw.budget);
  const healthScore = asRecord(raw.health_score);
  const incomeSummary = asRecord(raw.income_summary);
  const debtSummary = asRecord(raw.debt_summary);
  const expenseSummary = asRecord(raw.expense_summary);
  const actionPlan = asRecord(raw.action_plan_preview ?? raw.action_plan);
  const actionItems = Array.isArray(actionPlan.items) ? actionPlan.items.map(asRecord) : [];
  const score = asNumber(healthScore.score);
  const monthlyIncome = asNumber(incomeSummary.total_monthly ?? budget.total_income);
  const monthlyExpenses = asNumber(expenseSummary.total_monthly ?? budget.total_expenses);
  const monthlyDebtPayments = asNumber(debtSummary.total_monthly_payments ?? budget.total_debt_payments);

  return {
    financialSummary: {
      monthlyIncome,
      monthlyExpenses,
      monthlyDebtPayments,
      netCashFlow: asNumber(budget.net_cashflow, monthlyIncome - monthlyExpenses - monthlyDebtPayments),
    },
    budgetSnapshot: {
      totalBudgeted: asNumber(budget.total_expenses, monthlyExpenses),
      totalSpent: monthlyExpenses,
      overBudgetCategories: [],
    },
    healthScore: {
      score,
      grade: gradeFromScore(score),
      trend: 'stable',
    },
    actionPlan: {
      total: asNumber(actionPlan.pending_count, actionItems.length),
      completed: 0,
      nextActionTitle: typeof actionItems[0]?.title === 'string' ? actionItems[0].title : null,
    },
    topGuidance: mapGuidance(raw.guidance_preview),
    dueSoon: Array.isArray(raw.due_soon_debts)
      ? raw.due_soon_debts.map(asRecord).map((debt) => ({
        id: String(debt.id ?? ''),
        name: String(debt.name ?? 'Debt payment'),
        minimumPayment: asNumber(debt.minimum_payment),
        daysUntilDue: daysUntil(debt.due_on),
      }))
      : [],
    notificationCount: asNumber(raw.notification_count),
  };
}

export const dashboardReal: DashboardApiAdapter = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await get<LaravelResource<BackendRecord> | BackendRecord>(apiPath(API.DASHBOARD));
      const raw = Object.prototype.hasOwnProperty.call(res, 'data')
        ? (res as LaravelResource<BackendRecord>).data
        : (res as BackendRecord);
      return mapDashboard(asRecord(raw));
    } catch (err) {
      handleApiError(err);
    }
  },
};

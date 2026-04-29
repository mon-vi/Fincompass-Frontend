import { get } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { DashboardApiAdapter, DashboardData } from './dashboardApi';

type PartialDashboard = Partial<DashboardData> & Record<string, unknown>;

const EMPTY_DASHBOARD: DashboardData = {
  financialSummary: { monthlyIncome: 0, monthlyExpenses: 0, monthlyDebtPayments: 0, netCashFlow: 0 },
  budgetSnapshot: { totalBudgeted: 0, totalSpent: 0, overBudgetCategories: [] },
  healthScore: { score: 0, grade: 'F', trend: 'stable' },
  actionPlan: { total: 0, completed: 0, nextActionTitle: null },
  topGuidance: [],
  dueSoon: [],
};

function mapDashboard(raw: PartialDashboard): DashboardData {
  return {
    financialSummary: raw.financialSummary ?? EMPTY_DASHBOARD.financialSummary,
    budgetSnapshot: raw.budgetSnapshot ?? EMPTY_DASHBOARD.budgetSnapshot,
    healthScore: raw.healthScore ?? EMPTY_DASHBOARD.healthScore,
    actionPlan: raw.actionPlan ?? EMPTY_DASHBOARD.actionPlan,
    topGuidance: raw.topGuidance ?? [],
    dueSoon: raw.dueSoon ?? [],
  };
}

export const dashboardReal: DashboardApiAdapter = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await get<LaravelResource<PartialDashboard> | PartialDashboard>(apiPath(API.DASHBOARD));
      const raw = Object.prototype.hasOwnProperty.call(res, 'data')
        ? (res as LaravelResource<PartialDashboard>).data
        : (res as PartialDashboard);
      return mapDashboard(raw);
    } catch (err) {
      handleApiError(err);
    }
  },
};

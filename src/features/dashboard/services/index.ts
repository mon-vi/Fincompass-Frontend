import { dashboardReal } from './dashboardReal';
import type { DashboardApiAdapter } from './dashboardApi';

export const dashboardAdapter: DashboardApiAdapter = dashboardReal;

export type { DashboardApiAdapter, DashboardData, FinancialSummary, BudgetSnapshot, HealthScoreSummary, ActionPlanSummary, GuidanceSummary, DueSoonDebt } from './dashboardApi';

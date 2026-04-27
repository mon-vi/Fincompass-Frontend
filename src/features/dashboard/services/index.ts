import { ENV } from '@/constants/env';
import { dashboardMock } from './dashboardMock';
import { dashboardReal } from './dashboardReal';
import type { DashboardApiAdapter } from './dashboardApi';

export const dashboardAdapter: DashboardApiAdapter = ENV.USE_MOCK_API ? dashboardMock : dashboardReal;

export type { DashboardApiAdapter, DashboardData, FinancialSummary, BudgetSnapshot, HealthScoreSummary, ActionPlanSummary, GuidanceSummary, DueSoonDebt } from './dashboardApi';

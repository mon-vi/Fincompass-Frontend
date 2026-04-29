import { budgetReal } from './budgetReal';
import type { BudgetApiAdapter } from './budgetApi';

export const budgetAdapter: BudgetApiAdapter = budgetReal;

export type { BudgetApiAdapter, Budget, BudgetCategory, UpdateBudgetPayload } from './budgetApi';

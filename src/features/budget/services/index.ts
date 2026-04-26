import { ENV } from '@/constants/env';
import { budgetMock } from './budgetMock';
import type { BudgetApiAdapter } from './budgetApi';

export const budgetAdapter: BudgetApiAdapter = ENV.USE_MOCK_API ? budgetMock : budgetMock;

export type { BudgetApiAdapter, Budget, BudgetCategory, UpdateBudgetPayload } from './budgetApi';

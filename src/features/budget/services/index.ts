import { ENV } from '@/constants/env';
import { budgetMock } from './budgetMock';
import { budgetReal } from './budgetReal';
import type { BudgetApiAdapter } from './budgetApi';

export const budgetAdapter: BudgetApiAdapter = ENV.USE_MOCK_API ? budgetMock : budgetReal;

export type { BudgetApiAdapter, Budget, BudgetCategory, UpdateBudgetPayload } from './budgetApi';

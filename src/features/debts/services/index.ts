import { ENV } from '@/constants/env';
import { debtsMock } from './debtsMock';
import { debtsReal } from './debtsReal';
import type { DebtsApiAdapter } from './debtsApi';

export const debtsAdapter: DebtsApiAdapter = ENV.USE_MOCK_API ? debtsMock : debtsReal;

export type { DebtsApiAdapter, Debt, DebtType, CreateDebtPayload, UpdateDebtPayload } from './debtsApi';

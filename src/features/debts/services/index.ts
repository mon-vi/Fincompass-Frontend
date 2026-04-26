import { ENV } from '@/constants/env';
import { debtsMock } from './debtsMock';
import type { DebtsApiAdapter } from './debtsApi';

export const debtsAdapter: DebtsApiAdapter = ENV.USE_MOCK_API ? debtsMock : debtsMock;

export type { DebtsApiAdapter, Debt, DebtType, CreateDebtPayload, UpdateDebtPayload } from './debtsApi';

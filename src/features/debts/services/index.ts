import { debtsReal } from './debtsReal';
import type { DebtsApiAdapter } from './debtsApi';

export const debtsAdapter: DebtsApiAdapter = debtsReal;

export type { DebtsApiAdapter, Debt, DebtType, CreateDebtPayload, UpdateDebtPayload } from './debtsApi';

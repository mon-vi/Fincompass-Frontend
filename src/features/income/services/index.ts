import { incomeReal } from './incomeReal';
import type { IncomeApiAdapter } from './incomeApi';

export const incomeAdapter: IncomeApiAdapter = incomeReal;

export { buildOnboardingIncomePayload, mapOnboardingIncomeType } from './incomeApi';
export type { BackendIncomeType, CreateIncomePayload, IncomeApiAdapter, IncomeFrequency, IncomeRecord } from './incomeApi';

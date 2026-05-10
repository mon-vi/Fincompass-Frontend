import { incomeReal } from './incomeReal';
import type { IncomeApiAdapter } from './incomeApi';

export const incomeAdapter: IncomeApiAdapter = incomeReal;

export { buildOnboardingIncomePayload, mapOnboardingIncomeType, INCOME_TYPE_LABELS, INCOME_FREQUENCY_LABELS } from './incomeApi';
export type {
  BackendIncomeType,
  CreateIncomePayload,
  UpdateIncomePayload,
  IncomeApiAdapter,
  IncomeFrequency,
  IncomeRecord,
} from './incomeApi';

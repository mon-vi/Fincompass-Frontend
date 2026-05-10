import { get, post, patch, del } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type {
  CreateIncomePayload,
  IncomeApiAdapter,
  IncomeRecord,
  UpdateIncomePayload,
} from './incomeApi';

interface LaravelIncomeRecord {
  id: string | number;
  source_name?: string;
  type: IncomeRecord['type'];
  amount: number | string;
  frequency: IncomeRecord['frequency'];
  monthly_amount?: number | string;
  is_active?: boolean;
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function mapIncome(record: LaravelIncomeRecord): IncomeRecord {
  return {
    id: String(record.id),
    sourceName: record.source_name ?? 'Income',
    type: record.type,
    amount: asNumber(record.amount),
    frequency: record.frequency,
    monthlyAmount: asNumber(record.monthly_amount, asNumber(record.amount)),
    isActive: record.is_active ?? true,
  };
}

export const incomeReal: IncomeApiAdapter = {
  async list(): Promise<IncomeRecord[]> {
    try {
      const res = await get<LaravelCollection<LaravelIncomeRecord>>(apiPath(API.INCOME.LIST));
      return res.data.map(mapIncome);
    } catch (err) {
      handleApiError(err);
    }
  },

  async create(payload: CreateIncomePayload): Promise<IncomeRecord> {
    try {
      const res = await post<LaravelResource<LaravelIncomeRecord>>(apiPath(API.INCOME.LIST), {
        source_name: payload.sourceName,
        type: payload.type,
        amount: payload.amount,
        frequency: payload.frequency,
        is_active: payload.isActive ?? true,
        notes: payload.notes,
      });
      return mapIncome(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateIncomePayload): Promise<IncomeRecord> {
    try {
      const body: Record<string, unknown> = {};
      if (payload.sourceName !== undefined) body.source_name = payload.sourceName;
      if (payload.type !== undefined) body.type = payload.type;
      if (payload.amount !== undefined) body.amount = payload.amount;
      if (payload.frequency !== undefined) body.frequency = payload.frequency;
      if (payload.isActive !== undefined) body.is_active = payload.isActive;
      if (payload.notes !== undefined) body.notes = payload.notes;

      const res = await patch<LaravelResource<LaravelIncomeRecord>>(apiPath(API.INCOME.DETAIL(id)), body);
      return mapIncome(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await del<void>(apiPath(API.INCOME.DETAIL(id)));
    } catch (err) {
      handleApiError(err);
    }
  },
};

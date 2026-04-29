import { post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { CreateIncomePayload, IncomeApiAdapter, IncomeRecord } from './incomeApi';

interface LaravelIncomeRecord {
  id: string;
  source_name: string;
  type: IncomeRecord['type'];
  amount: number;
  frequency: IncomeRecord['frequency'];
  monthly_amount: number;
  is_active: boolean;
}

function mapIncome(record: LaravelIncomeRecord): IncomeRecord {
  return {
    id: record.id,
    sourceName: record.source_name,
    type: record.type,
    amount: record.amount,
    frequency: record.frequency,
    monthlyAmount: record.monthly_amount,
    isActive: record.is_active,
  };
}

export const incomeReal: IncomeApiAdapter = {
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
};

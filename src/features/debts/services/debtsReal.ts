import { get, post, patch, del } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { Debt, CreateDebtPayload, UpdateDebtPayload, DebtsApiAdapter } from './debtsApi';

export const debtsReal: DebtsApiAdapter = {
  async list(): Promise<Debt[]> {
    try {
      const res = await get<LaravelCollection<Debt>>(apiPath(API.DEBTS.LIST));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async get(id: string): Promise<Debt> {
    try {
      const res = await get<LaravelResource<Debt>>(apiPath(API.DEBTS.DETAIL(id)));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async create(payload: CreateDebtPayload): Promise<Debt> {
    try {
      const res = await post<LaravelResource<Debt>>(apiPath(API.DEBTS.LIST), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateDebtPayload): Promise<Debt> {
    try {
      const res = await patch<LaravelResource<Debt>>(apiPath(API.DEBTS.DETAIL(id)), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await del<void>(apiPath(API.DEBTS.DETAIL(id)));
    } catch (err) {
      handleApiError(err);
    }
  },

  async markPaid(id: string): Promise<Debt> {
    try {
      const res = await post<LaravelResource<Debt>>(apiPath(API.DEBTS.MARK_PAID(id)));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

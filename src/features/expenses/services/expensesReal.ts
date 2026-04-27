import { get, post, patch, del } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { Expense, CreateExpensePayload, UpdateExpensePayload, BulkCreateExpensePayload, ExpensesApiAdapter } from './expensesApi';

export const expensesReal: ExpensesApiAdapter = {
  async list(params): Promise<Expense[]> {
    try {
      const res = await get<LaravelCollection<Expense>>(apiPath(API.EXPENSES.LIST), { params });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async create(payload: CreateExpensePayload): Promise<Expense> {
    try {
      const res = await post<LaravelResource<Expense>>(apiPath(API.EXPENSES.LIST), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateExpensePayload): Promise<Expense> {
    try {
      const res = await patch<LaravelResource<Expense>>(apiPath(API.EXPENSES.DETAIL(id)), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await del<void>(apiPath(API.EXPENSES.DETAIL(id)));
    } catch (err) {
      handleApiError(err);
    }
  },

  async bulkCreate(payload: BulkCreateExpensePayload): Promise<Expense[]> {
    try {
      const res = await post<LaravelCollection<Expense>>(apiPath(API.EXPENSES.BULK), payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};

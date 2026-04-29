import { get, post, patch, del } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { Expense, ExpenseCategory, CreateExpensePayload, UpdateExpensePayload, BulkCreateExpensePayload, ExpensesApiAdapter } from './expensesApi';

interface LaravelExpense {
  id: string | number;
  name?: string;
  category?: ExpenseCategory | 'transport';
  amount?: number | string;
  frequency?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface LaravelExpensePayload {
  name?: string;
  category?: string;
  amount?: number;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  is_essential?: boolean;
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function toFrontendCategory(category: ExpenseCategory | 'transport' | undefined): ExpenseCategory {
  if (category === 'transport') return 'transportation';
  return category ?? 'other';
}

function toBackendCategory(category: ExpenseCategory | undefined): string | undefined {
  if (category === 'transportation') return 'transport';
  return category;
}

function mapExpense(expense: LaravelExpense): Expense {
  return {
    id: String(expense.id),
    amount: asNumber(expense.amount),
    category: toFrontendCategory(expense.category),
    description: expense.name ?? 'Expense',
    date: expense.created_at ?? '',
    isRecurring: expense.frequency === 'monthly',
    source: 'manual',
    createdAt: expense.created_at ?? '',
    updatedAt: expense.updated_at ?? expense.created_at ?? '',
  };
}

function isEssential(category: ExpenseCategory | undefined): boolean {
  return category === 'housing' || category === 'food' || category === 'utilities' || category === 'healthcare';
}

function toBackendPayload(payload: UpdateExpensePayload): LaravelExpensePayload {
  const next: LaravelExpensePayload = {};
  if (payload.description !== undefined) next.name = payload.description;
  if (payload.category !== undefined) {
    next.category = toBackendCategory(payload.category);
    next.is_essential = isEssential(payload.category);
  }
  if (payload.amount !== undefined) next.amount = payload.amount;
  if (payload.isRecurring !== undefined) next.frequency = payload.isRecurring ? 'monthly' : 'one_time';
  return next;
}

function toBackendCreatePayload(payload: CreateExpensePayload): LaravelExpensePayload {
  return {
    ...toBackendPayload(payload),
    frequency: payload.isRecurring === false ? 'one_time' : 'monthly',
  };
}

export const expensesReal: ExpensesApiAdapter = {
  async list(params): Promise<Expense[]> {
    try {
      const res = await get<LaravelCollection<LaravelExpense>>(apiPath(API.EXPENSES.LIST), { params });
      return res.data.map(mapExpense);
    } catch (err) {
      handleApiError(err);
    }
  },

  async create(payload: CreateExpensePayload): Promise<Expense> {
    try {
      const res = await post<LaravelResource<LaravelExpense>>(apiPath(API.EXPENSES.LIST), toBackendCreatePayload(payload));
      return mapExpense(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateExpensePayload): Promise<Expense> {
    try {
      const res = await patch<LaravelResource<LaravelExpense>>(apiPath(API.EXPENSES.DETAIL(id)), toBackendPayload(payload));
      return mapExpense(res.data);
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
      const res = await post<LaravelCollection<LaravelExpense>>(apiPath(API.EXPENSES.BULK), {
        expenses: payload.expenses.map(toBackendCreatePayload),
      });
      return res.data.map(mapExpense);
    } catch (err) {
      handleApiError(err);
    }
  },
};

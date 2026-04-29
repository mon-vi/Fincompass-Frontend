import { get, post, patch, del } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { Debt, CreateDebtPayload, UpdateDebtPayload, DebtsApiAdapter } from './debtsApi';

interface LaravelDebt {
  id: string | number;
  name?: string;
  type?: Debt['type'];
  original_balance?: number | string | null;
  current_balance?: number | string;
  interest_rate?: number | string;
  minimum_payment?: number | string;
  payment_due_day?: number | null;
  is_paid_off?: boolean;
  created_at?: string;
  updated_at?: string;
}

type LaravelDebtPayload = {
  name?: string;
  type?: Debt['type'];
  original_balance?: number;
  current_balance?: number;
  interest_rate?: number;
  minimum_payment?: number;
  payment_due_day?: number;
};

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function mapDebt(debt: LaravelDebt): Debt {
  const balance = asNumber(debt.current_balance);
  return {
    id: String(debt.id),
    name: debt.name ?? 'Debt',
    type: debt.type ?? 'other',
    balance,
    originalBalance: asNumber(debt.original_balance, balance),
    interestRate: asNumber(debt.interest_rate),
    minimumPayment: asNumber(debt.minimum_payment),
    dueDayOfMonth: debt.payment_due_day ?? 1,
    isPaid: debt.is_paid_off ?? false,
    createdAt: debt.created_at ?? '',
    updatedAt: debt.updated_at ?? debt.created_at ?? '',
  };
}

function toBackendPayload(payload: UpdateDebtPayload): LaravelDebtPayload {
  return {
    name: payload.name,
    type: payload.type,
    original_balance: payload.originalBalance,
    current_balance: payload.balance,
    interest_rate: payload.interestRate,
    minimum_payment: payload.minimumPayment,
    payment_due_day: payload.dueDayOfMonth,
  };
}

export const debtsReal: DebtsApiAdapter = {
  async list(): Promise<Debt[]> {
    try {
      const res = await get<LaravelCollection<LaravelDebt>>(apiPath(API.DEBTS.LIST));
      return res.data.map(mapDebt);
    } catch (err) {
      handleApiError(err);
    }
  },

  async get(id: string): Promise<Debt> {
    try {
      const res = await get<LaravelResource<LaravelDebt>>(apiPath(API.DEBTS.DETAIL(id)));
      return mapDebt(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async create(payload: CreateDebtPayload): Promise<Debt> {
    try {
      const res = await post<LaravelResource<LaravelDebt>>(apiPath(API.DEBTS.LIST), toBackendPayload(payload));
      return mapDebt(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async update(id: string, payload: UpdateDebtPayload): Promise<Debt> {
    try {
      const res = await patch<LaravelResource<LaravelDebt>>(apiPath(API.DEBTS.DETAIL(id)), toBackendPayload(payload));
      return mapDebt(res.data);
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
      const res = await post<LaravelResource<LaravelDebt>>(apiPath(API.DEBTS.MARK_PAID(id)));
      return mapDebt(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },
};

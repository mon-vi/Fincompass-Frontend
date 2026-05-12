import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesAdapter } from '../services';
import { invalidateFinancialQueries } from '@/features/finance/invalidateFinancialQueries';
import type { CreateExpensePayload, UpdateExpensePayload, BulkCreateExpensePayload } from '../services';

export const expenseKeys = {
  all: ['expenses'] as const,
  byMonth: (month: string) => ['expenses', month] as const,
};

export function useExpenses(month?: string) {
  return useQuery({
    queryKey: month ? expenseKeys.byMonth(month) : expenseKeys.all,
    queryFn: () => expensesAdapter.list(month ? { month } : undefined),
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => expensesAdapter.create(payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensePayload }) =>
      expensesAdapter.update(id, payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesAdapter.remove(id),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useBulkCreateExpenses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkCreateExpensePayload) => expensesAdapter.bulkCreate(payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

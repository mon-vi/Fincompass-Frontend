import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeAdapter } from '../services';
import { invalidateFinancialQueries } from '@/features/finance/invalidateFinancialQueries';
import type { CreateIncomePayload, UpdateIncomePayload } from '../services';

export const incomeKeys = {
  all: ['income'] as const,
};

export function useIncome() {
  return useQuery({
    queryKey: incomeKeys.all,
    queryFn: () => incomeAdapter.list(),
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIncomePayload) => incomeAdapter.create(payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateIncomePayload }) =>
      incomeAdapter.update(id, payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeAdapter.remove(id),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

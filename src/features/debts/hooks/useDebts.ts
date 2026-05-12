import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsAdapter } from '../services';
import { invalidateFinancialQueries } from '@/features/finance/invalidateFinancialQueries';
import type { CreateDebtPayload, UpdateDebtPayload } from '../services';

export const debtKeys = {
  all: ['debts'] as const,
  detail: (id: string) => ['debts', id] as const,
};

export function useDebts() {
  return useQuery({
    queryKey: debtKeys.all,
    queryFn: () => debtsAdapter.list(),
  });
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: debtKeys.detail(id),
    queryFn: () => debtsAdapter.get(id),
    enabled: !!id,
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDebtPayload) => debtsAdapter.create(payload),
    onSuccess: () => { invalidateFinancialQueries(qc); },
  });
}

export function useUpdateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDebtPayload }) =>
      debtsAdapter.update(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(debtKeys.detail(updated.id), updated);
      invalidateFinancialQueries(qc);
    },
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsAdapter.remove(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: debtKeys.detail(id) });
      invalidateFinancialQueries(qc);
    },
  });
}

export function useMarkDebtPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsAdapter.markPaid(id),
    onSuccess: (updated) => {
      qc.setQueryData(debtKeys.detail(updated.id), updated);
      invalidateFinancialQueries(qc);
    },
  });
}

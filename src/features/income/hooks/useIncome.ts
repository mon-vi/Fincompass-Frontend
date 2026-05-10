import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeAdapter } from '../services';
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
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: incomeKeys.all });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateIncomePayload }) =>
      incomeAdapter.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: incomeKeys.all });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeAdapter.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: incomeKeys.all });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { dashboardAdapter } from '../services';

export const dashboardKeys = {
  all: ['dashboard'] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: () => dashboardAdapter.getDashboard(),
    staleTime: 30_000,
  });
}

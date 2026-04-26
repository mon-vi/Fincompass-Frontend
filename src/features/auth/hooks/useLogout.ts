import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { authAdapter } from '../services';

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useCallback(async () => {
    try {
      await authAdapter.logout();
    } finally {
      clearAuth();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate, clearAuth]);
}

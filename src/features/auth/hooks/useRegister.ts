import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { authAdapter } from '../services';
import type { RegisterPayload } from '@/types/auth';

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authAdapter.register(payload),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      navigate(ROUTES.ONBOARDING, { replace: true });
    },
  });
}

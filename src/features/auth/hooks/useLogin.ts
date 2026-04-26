import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { authAdapter } from '../services';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authAdapter.login(payload),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      const destination =
        user.onboardingStatus === 'complete' ? ROUTES.DASHBOARD : ROUTES.ONBOARDING;
      navigate(destination, { replace: true });
    },
  });
}

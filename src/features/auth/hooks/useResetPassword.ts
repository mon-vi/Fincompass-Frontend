import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { authAdapter } from '../services';

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordPayload) =>
      authAdapter.resetPassword(token, password),
    onSuccess: () => {
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { authAdapter } from '../services';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authAdapter.forgotPassword(email),
  });
}

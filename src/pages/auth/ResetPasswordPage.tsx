import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validation/auth';
import { ROUTES } from '@/constants/routes';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormValues) =>
    resetMutation.mutate({ token, password: data.password });

  if (!token) {
    return (
      <Card padded={false} className="p-6 sm:p-8">
        <div className="space-y-6">
          <Alert variant="error" title="Invalid reset link">
            This link is missing a reset token. Please request a new password reset.
          </Alert>
          <div className="text-center">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padded={false} className="p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password for your FinCompass account.
          </p>
        </div>

        {resetMutation.isError && (
          <Alert variant="error">
            {resetMutation.error instanceof Error
              ? resetMutation.error.message
              : 'Something went wrong. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            hint="At least 8 characters, 1 uppercase letter, 1 number"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={resetMutation.isPending}
            size="lg"
          >
            Reset password
          </Button>
        </form>

        <div className="text-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </Card>
  );
}

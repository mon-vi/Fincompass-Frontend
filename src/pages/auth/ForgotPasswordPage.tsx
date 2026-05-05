import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validation/auth';
import { ROUTES } from '@/constants/routes';

export function ForgotPasswordPage() {
  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormValues) =>
    forgotMutation.mutate(data.email);

  return (
    <Card padded={false} className="p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email and we'll send a reset link if an account exists.
          </p>
        </div>

        {forgotMutation.isError && (
          <Alert variant="error">
            {forgotMutation.error instanceof Error
              ? forgotMutation.error.message
              : 'Something went wrong. Please try again.'}
          </Alert>
        )}

        {forgotMutation.isSuccess ? (
          <Alert variant="success" title="Check your email">
            {forgotMutation.data.message}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={forgotMutation.isPending}
              size="lg"
            >
              Send reset link
            </Button>
          </form>
        )}

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

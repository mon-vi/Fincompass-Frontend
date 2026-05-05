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
    <Card padded={false} className="p-5 sm:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email and we'll send a reset link if an account exists.
          </p>
        </div>

        {forgotMutation.isError && (
          <Alert variant="error">
            {forgotMutation.error instanceof Error
              ? forgotMutation.error.message
              : 'We could not send a reset link. Check your connection and try again.'}
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
            className="text-sm font-semibold text-[#2b6d91] hover:text-[#12355b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </Card>
  );
}

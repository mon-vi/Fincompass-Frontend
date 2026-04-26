import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/validation/auth';
import { ROUTES } from '@/constants/routes';

export function LoginPage() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <Card padded={false} className="p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sign in to your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign up free
            </Link>
          </p>
        </div>

        {loginMutation.isError && (
          <Alert variant="error">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : 'Something went wrong. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={loginMutation.isPending} size="lg">
            Sign in
          </Button>
        </form>

        <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-400">
          Demo: <span className="font-mono">demo@fincompass.app</span> /{' '}
          <span className="font-mono">Password1</span>
        </p>
      </div>
    </Card>
  );
}

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '@/validation/auth';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/services/apiError';

export function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  return (
    <Card padded={false} className="p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        {registerMutation.isError && (
          <Alert variant="error">
            <span>
              {registerMutation.error instanceof Error
                ? registerMutation.error.message
                : 'Something went wrong. Please try again.'}
            </span>
            {registerMutation.error instanceof ApiError &&
              registerMutation.error.fieldErrors &&
              Object.values(registerMutation.error.fieldErrors).flat().length > 0 && (
                <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs">
                  {Object.values(registerMutation.error.fieldErrors)
                    .flat()
                    .map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                </ul>
              )}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              autoComplete="given-name"
              placeholder="Jane"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last name"
              autoComplete="family-name"
              placeholder="Smith"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Password"
            autoComplete="new-password"
            hint="At least 8 characters, 1 uppercase letter, 1 number"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={registerMutation.isPending}
            size="lg"
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </Card>
  );
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';

/**
 * Redirects authenticated users with incomplete onboarding to the onboarding flow.
 * Place this inside RequireAuth so auth is always checked first.
 */
export function RequireOnboarding() {
  const user = useAuthStore((s) => s.user);

  if (user?.onboardingStatus === 'pending') {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return <Outlet />;
}

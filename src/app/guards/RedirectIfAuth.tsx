import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';

/**
 * Prevents authenticated users from accessing public-only routes (e.g. login, register).
 * Redirects to the dashboard if already logged in.
 */
export function RedirectIfAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}

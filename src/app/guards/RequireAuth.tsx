import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';

interface RequireAuthProps {
  /** Redirect here if not authenticated. Defaults to /login. */
  redirectTo?: string;
}

/**
 * Protects routes that require authentication.
 * Preserves the attempted URL via router state so login can redirect back after success.
 *
 * Note: Zustand persist rehydrates synchronously on first render, so there is no
 * async hydration flash to guard against here. If SSR is ever added, revisit this.
 */
export function RequireAuth({ redirectTo = ROUTES.LOGIN }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

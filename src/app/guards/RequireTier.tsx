import { Outlet, Navigate } from 'react-router-dom';
import { useTierAccess } from '@/hooks/useTierAccess';
import { ROUTES } from '@/constants/routes';
import type { UserTier } from '@/types/auth';

interface RequireTierProps {
  required: UserTier | UserTier[];
}

/**
 * Full-page tier guard. Redirects to /billing when the user's tier is
 * below the required tier. Use FeatureGate for inline feature locks.
 * Renders <Outlet /> so it can be used as a layout route in react-router.
 */
export function RequireTier({ required }: RequireTierProps) {
  const allowed = useTierAccess(required);
  if (!allowed) return <Navigate to={ROUTES.BILLING} replace />;
  return <Outlet />;
}

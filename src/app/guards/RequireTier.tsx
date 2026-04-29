import { Outlet } from 'react-router-dom';
import { useTierAccess } from '@/hooks/useTierAccess';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import type { UserTier } from '@/types/auth';

interface RequireTierProps {
  required: UserTier | UserTier[];
  feature?: string;
}

/**
 * Full-page tier guard. Shows an upgrade prompt when the user's tier is
 * below the required tier. Use FeatureGate for inline feature locks.
 * Renders <Outlet /> so it can be used as a layout route in react-router.
 */
export function RequireTier({ required, feature }: RequireTierProps) {
  const allowed = useTierAccess(required);
  const requiredTier = Array.isArray(required) ? required[0] : required;
  if (!allowed) return <UpgradePrompt requiredTier={requiredTier} feature={feature} />;
  return <Outlet />;
}

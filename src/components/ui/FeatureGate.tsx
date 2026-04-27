import type { ReactNode } from 'react';
import { useTierAccess } from '@/hooks/useTierAccess';
import { LockedCard } from './LockedCard';
import type { UserTier } from '@/types/auth';

interface FeatureGateProps {
  /** Minimum tier required to see the children. */
  requiredTier: UserTier;
  children: ReactNode;
  /** Custom fallback; defaults to <LockedCard>. */
  fallback?: ReactNode;
  feature?: string;
  description?: string;
}

/**
 * Wraps any content and hides it behind a tier check.
 * Show the real UI to users who qualify; show a locked state to everyone else.
 */
export function FeatureGate({
  requiredTier,
  children,
  fallback,
  feature,
  description,
}: FeatureGateProps) {
  const allowed = useTierAccess(requiredTier);
  if (allowed) return <>{children}</>;
  return (
    <>
      {fallback ?? (
        <LockedCard requiredTier={requiredTier} feature={feature} description={description} />
      )}
    </>
  );
}

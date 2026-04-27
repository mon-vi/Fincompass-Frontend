import { useAuthStore } from '@/stores/authStore';
import type { UserTier } from '@/types/auth';

const TIER_RANK: Record<UserTier, number> = {
  compass: 0,
  navigator: 1,
  cfo: 2,
};

/**
 * Returns true when the current user's tier meets or exceeds the required tier.
 * Accepts a single tier or an array (any match grants access).
 */
export function hasAccess(userTier: UserTier, required: UserTier | UserTier[]): boolean {
  const rank = TIER_RANK[userTier];
  return Array.isArray(required)
    ? required.some((r) => rank >= TIER_RANK[r])
    : rank >= TIER_RANK[required];
}

export function useTierAccess(required: UserTier | UserTier[]): boolean {
  const tier = useAuthStore((s) => s.user?.tier ?? 'compass');
  return hasAccess(tier, required);
}

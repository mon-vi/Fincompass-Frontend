import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { ROUTES } from '@/constants/routes';
import type { UserTier } from '@/types/auth';

const TIER_LABELS: Record<UserTier, string> = {
  compass: 'Compass',
  navigator: 'Navigator',
  cfo: 'CFO',
};

interface UpgradePromptProps {
  requiredTier: UserTier;
  feature?: string;
  compact?: boolean;
  className?: string;
}

export function UpgradePrompt({ requiredTier, feature, compact = false, className }: UpgradePromptProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs text-slate-500">
          {feature ? `${feature} requires` : 'Requires'} {TIER_LABELS[requiredTier]} plan
        </span>
        <Link to={ROUTES.BILLING}>
          <Button size="sm" variant="outline">Upgrade</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-6 text-center', className)}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-indigo-600">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-indigo-900">
        {feature ? `${feature} is a ` : 'This is a '}
        <span className="text-indigo-600">{TIER_LABELS[requiredTier]}</span> feature
      </p>
      <p className="mt-1 text-xs text-indigo-600">
        Upgrade your plan to unlock this and more.
      </p>
      <Link to={ROUTES.BILLING} className="mt-4 inline-block">
        <Button size="sm">Upgrade to {TIER_LABELS[requiredTier]}</Button>
      </Link>
    </div>
  );
}

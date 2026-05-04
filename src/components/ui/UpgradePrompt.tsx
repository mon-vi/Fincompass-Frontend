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
      <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
        <span className="text-xs font-medium text-slate-500">
          {feature ? `${feature} requires` : 'Requires'} {TIER_LABELS[requiredTier]} plan
        </span>
        <Link to={ROUTES.BILLING}>
          <Button size="sm" variant="outline">Upgrade</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('rounded-3xl border border-[#12355b]/15 bg-gradient-to-br from-white to-[#f7fbfc] p-6 text-center shadow-sm shadow-slate-900/[0.04]', className)}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#12355b]/10">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-[#12355b]">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-950">
        {feature ? `${feature} is a ` : 'This is a '}
        <span className="text-[#12355b]">{TIER_LABELS[requiredTier]}</span> feature
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Unlock it when you are ready. No pressure, just more guidance.
      </p>
      <Link to={ROUTES.BILLING} className="mt-4 inline-block">
        <Button size="sm" variant="accent">Upgrade to {TIER_LABELS[requiredTier]}</Button>
      </Link>
    </div>
  );
}

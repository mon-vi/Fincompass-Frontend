import { cn } from '@/utils/cn';
import { UpgradePrompt } from './UpgradePrompt';
import type { UserTier } from '@/types/auth';

interface LockedCardProps {
  requiredTier: UserTier;
  feature?: string;
  description?: string;
  className?: string;
}

export function LockedCard({ requiredTier, feature, description, className }: LockedCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      {/* blurred content silhouette */}
      <div className="pointer-events-none select-none space-y-3 p-6 opacity-30 blur-sm" aria-hidden>
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-10 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>
      {/* lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 p-4 backdrop-blur-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-slate-500">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
        </div>
        {description && (
          <p className="mb-3 text-center text-xs text-slate-500">{description}</p>
        )}
        <UpgradePrompt requiredTier={requiredTier} feature={feature} compact />
      </div>
    </div>
  );
}

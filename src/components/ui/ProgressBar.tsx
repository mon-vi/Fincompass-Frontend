import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantTrack: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  default: 'bg-[#2b6d91]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const sizeClasses: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-slate-700">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/80', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', variantTrack[variant])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

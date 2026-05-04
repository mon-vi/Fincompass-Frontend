import { cn } from '@/utils/cn';
import type { PayoffStrategy } from '../services';

interface StrategySelectorProps {
  value: PayoffStrategy;
  onChange: (strategy: PayoffStrategy) => void;
}

const strategies: Array<{ value: PayoffStrategy; label: string; description: string }> = [
  {
    value: 'avalanche',
    label: 'Avalanche',
    description: 'Target highest APR first — saves the most interest',
  },
  {
    value: 'snowball',
    label: 'Snowball',
    description: 'Target smallest balance first — builds momentum',
  },
  {
    value: 'minimum',
    label: 'Minimum only',
    description: 'Minimum payments only — baseline comparison',
  },
];

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {strategies.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={cn(
            'min-h-32 rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6d91]/15',
            value === s.value
              ? 'border-[#12355b]/40 bg-[#12355b]/5 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
          )}
        >
          <p className={cn('text-base font-black tracking-tight', value === s.value ? 'text-[#12355b]' : 'text-slate-950')}>
            {s.label}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{s.description}</p>
        </button>
      ))}
    </div>
  );
}

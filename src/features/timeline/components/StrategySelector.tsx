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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {strategies.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={cn(
            'rounded-xl border p-3 text-left transition-colors',
            value === s.value
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 bg-white hover:bg-slate-50',
          )}
        >
          <p className={cn('text-sm font-semibold', value === s.value ? 'text-indigo-700' : 'text-slate-900')}>
            {s.label}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{s.description}</p>
        </button>
      ))}
    </div>
  );
}

import { cn } from '@/utils/cn';
import type { HealthGrade, HealthTrend } from '../services';

interface ScoreGaugeProps {
  score: number;
  grade: HealthGrade;
  trend: HealthTrend;
}

const gradeColors: Record<HealthGrade, string> = {
  A: 'text-emerald-600',
  B: 'text-teal-600',
  C: 'text-amber-500',
  D: 'text-amber-700',
  F: 'text-red-600',
};

const gradeRingColors: Record<HealthGrade, string> = {
  A: 'stroke-emerald-500',
  B: 'stroke-teal-500',
  C: 'stroke-amber-400',
  D: 'stroke-amber-600',
  F: 'stroke-red-500',
};

const trendLabels: Record<HealthTrend, string> = {
  improving: '↑ Improving',
  stable: '→ Stable',
  declining: '↓ Declining',
};

const trendColors: Record<HealthTrend, string> = {
  improving: 'text-emerald-600',
  stable: 'text-slate-500',
  declining: 'text-red-500',
};

export function ScoreGauge({ score, grade, trend }: ScoreGaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-full bg-slate-50 p-3 ring-1 ring-slate-200/70">
        <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`Health score: ${score}`}>
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            className={gradeRingColors[grade]}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-4xl font-black tracking-tight', gradeColors[grade])}>{score}</span>
          <span className={cn('text-lg font-black', gradeColors[grade])}>{grade}</span>
        </div>
      </div>
      <span className={cn('text-sm font-medium', trendColors[trend])}>{trendLabels[trend]}</span>
    </div>
  );
}

import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';

/** Placeholder — full implementation in Phase 3 (Dashboard feature). */
export function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Your financial overview" />
      <Card>
        <p className="text-sm text-slate-500">Dashboard widgets — Phase 3</p>
      </Card>
    </div>
  );
}

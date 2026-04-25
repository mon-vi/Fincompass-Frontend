import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/ui';

/**
 * Main authenticated app shell.
 * Wraps all protected routes with nav + sidebar (to be built in Phase 2).
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav placeholder — Phase 2 */}
      <header className="border-b border-slate-200 bg-white">
        <PageContainer>
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">FinCompass</span>
            <span className="text-xs text-slate-400">Nav — Phase 2</span>
          </div>
        </PageContainer>
      </header>

      <main className="py-8">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}

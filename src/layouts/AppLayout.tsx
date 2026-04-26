import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/stores/authStore';

export function AppLayout() {
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <PageContainer>
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">FinCompass</span>
            <div className="flex items-center gap-3">
              {user && (
                <span className="hidden text-sm text-slate-500 sm:block">
                  {user.firstName} {user.lastName}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={() => void logout()}>
                Sign out
              </Button>
            </div>
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

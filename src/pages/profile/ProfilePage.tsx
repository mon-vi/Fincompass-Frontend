import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const tierLabels: Record<string, string> = {
  compass: 'Compass',
  navigator: 'Navigator',
  cfo: 'CFO',
};

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeader title="Profile & Settings" subtitle="Manage your account, plan, and session access." />

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <Badge variant="tier">{tierLabels[user?.tier ?? 'compass']} plan</Badge>
        </CardHeader>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-500">Name</span>
            <span className="font-medium text-slate-900">{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-100 py-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-500">Email</span>
            <span className="break-all font-medium text-slate-900">{user?.email}</span>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-100 py-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-500">Member since</span>
            <span className="font-medium text-slate-900">
              {user?.createdAt ? formatDate(user.createdAt, { month: 'long', year: 'numeric' }) : '—'}
            </span>
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">{tierLabels[user?.tier ?? 'compass']} plan</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.tier === 'cfo' ? 'Full access including ARIA AI assistant' : 'Upgrade to unlock more features'}
            </p>
          </div>
          <Link to={ROUTES.BILLING} className="w-full sm:w-auto">
            <Button variant="outline" size="sm">
              {user?.tier === 'cfo' ? 'Manage' : 'Upgrade'}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Preferences (Phase 4) */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-500">
          Notification preferences and display settings — coming in Phase 4.
        </p>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <Button
          variant="danger"
          fullWidth
          onClick={() => void logout()}
        >
          Sign out
        </Button>
      </Card>
    </div>
  );
}

import { useState, type ReactElement } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useNotifications } from '@/features/notifications/hooks';
import { useTierAccess } from '@/hooks';

interface NavItem {
  to: string;
  label: string;
  icon: ReactElement;
}

function DashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
    </svg>
  );
}

function DebtsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zM4.75 9.172A5.5 5.5 0 019.5 4.56V10H4.56a5.501 5.501 0 01.19-.828zM4.56 11.5H9.5v4.94a5.501 5.501 0 01-4.94-4.94zM11 15.44V11.5h4.94A5.5 5.5 0 0111 15.44zM15.44 10H11V4.56a5.5 5.5 0 014.44 5.44z" clipRule="evenodd" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.009C4.907 12.586 3 10.615 3 8a5 5 0 0110 0c0 2.615-1.907 4.586-2.885 5.211a22.042 22.042 0 01-2.582 2.009 20.757 20.757 0 01-1.181.692zM10 3a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14.75z" clipRule="evenodd" />
    </svg>
  );
}

function BellIcon({ count }: { count?: number }) {
  return (
    <span className="relative">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
      </svg>
      {count !== undefined && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </span>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 9zm.75 2.75a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" clipRule="evenodd" />
    </svg>
  );
}

function ExpensesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm2 3a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0zm-5 0a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
      <path d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
  );
}

function AriaIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M10 3a7 7 0 100 14A7 7 0 0010 3zM2 10a8 8 0 1116 0A8 8 0 012 10zm9-3a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" clipRule="evenodd" />
    </svg>
  );
}

function SidebarLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        )
      }
    >
      {item.icon}
      {item.label}
    </NavLink>
  );
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const hasNavigatorAccess = useTierAccess('navigator');
  const hasCfoAccess = useTierAccess('cfo');

  const mainNav: NavItem[] = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: <DashIcon /> },
    { to: ROUTES.DEBTS, label: 'Debts', icon: <DebtsIcon /> },
    { to: ROUTES.BUDGET, label: 'Budget', icon: <BudgetIcon /> },
    { to: ROUTES.EXPENSES, label: 'Expenses', icon: <ExpensesIcon /> },
    ...(hasNavigatorAccess ? [{ to: ROUTES.EMAIL_PARSER, label: 'Email Parser', icon: <ReceiptIcon /> }] : []),
    { to: ROUTES.HEALTH_SCORE, label: 'Health Score', icon: <HeartIcon /> },
    { to: ROUTES.TIMELINE, label: 'Timeline', icon: <CalendarIcon /> },
    { to: ROUTES.ACTION_PLAN, label: 'Action Plan', icon: <ListIcon /> },
    { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: <BellIcon count={unreadCount} /> },
    ...(hasCfoAccess ? [{ to: ROUTES.ARIA, label: 'ARIA', icon: <AriaIcon /> }] : []),
  ];

  const accountNav: NavItem[] = [
    { to: ROUTES.PROFILE, label: 'Profile', icon: <UserIcon /> },
    { to: ROUTES.BILLING, label: 'Billing', icon: <ReceiptIcon /> },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="text-lg font-bold text-indigo-600">FinCompass</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-4">
        {mainNav.map((item) => (
          <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
        <div className="my-3 border-t border-slate-200" />
        {accountNav.map((item) => (
          <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="mb-2 px-1">
          <p className="text-xs font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.tier} plan</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-56 lg:flex-col border-r border-slate-200 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-56">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="font-bold text-indigo-600">FinCompass</span>
          <button
            type="button"
            aria-label="Notifications"
            className="relative ml-auto rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            onClick={() => { setSidebarOpen(false); navigate(ROUTES.NOTIFICATIONS); }}
          >
            <BellIcon count={unreadCount} />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { type ReactElement } from 'react';
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
  mobileIcon?: ReactElement;
}

/* ─── Icons ───────────────────────────────────────────────────────────── */

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

function PlanIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14.75z" clipRule="evenodd" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
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

function IncomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
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

function LogoMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#12355b] text-sm font-black text-white shadow-sm shadow-slate-900/20">
      FC
    </span>
  );
}

/* ─── Sidebar nav link ─────────────────────────────────────────────────── */

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2',
          isActive
            ? 'bg-[#12355b] text-white shadow-sm shadow-slate-900/10'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
        )
      }
    >
      {item.icon}
      {item.label}
    </NavLink>
  );
}

/* ─── Bottom tab link ──────────────────────────────────────────────────── */

function BottomTabLink({ to, label, icon, badge }: { to: string; label: string; icon: ReactElement; badge?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors focus-visible:outline-none',
          isActive ? 'text-[#12355b]' : 'text-slate-500',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn('relative flex h-7 w-7 items-center justify-center rounded-xl transition-colors', isActive && 'bg-[#12355b]/10')}>
            {icon}
            {badge !== undefined && badge > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

/* ─── AppLayout ────────────────────────────────────────────────────────── */

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const hasNavigatorAccess = useTierAccess('navigator');
  const hasCfoAccess = useTierAccess('cfo');

  const mainNav: NavItem[] = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: <DashIcon /> },
    { to: ROUTES.INCOME, label: 'Income', icon: <IncomeIcon /> },
    { to: ROUTES.DEBTS, label: 'Debts', icon: <DebtsIcon /> },
    { to: ROUTES.BUDGET, label: 'Budget', icon: <BudgetIcon /> },
    { to: ROUTES.EXPENSES, label: 'Expenses', icon: <ExpensesIcon /> },
    ...(hasNavigatorAccess ? [{ to: ROUTES.EMAIL_PARSER, label: 'Email Parser', icon: <ReceiptIcon /> }] : []),
    { to: ROUTES.HEALTH_SCORE, label: 'Health Score', icon: <HeartIcon /> },
    { to: ROUTES.TIMELINE, label: 'Timeline', icon: <CalendarIcon /> },
    { to: ROUTES.ACTION_PLAN, label: 'Action Plan', icon: <PlanIcon /> },
    { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: <BellIcon count={unreadCount} /> },
    ...(hasCfoAccess ? [{ to: ROUTES.ARIA, label: 'ARIA', icon: <AriaIcon /> }] : []),
  ];

  const accountNav: NavItem[] = [
    { to: ROUTES.PROFILE, label: 'Profile', icon: <ProfileIcon /> },
    { to: ROUTES.BILLING, label: 'Billing', icon: <ReceiptIcon /> },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-5">
        <LogoMark />
        <div className="min-w-0">
          <span className="block text-lg font-black tracking-tight text-slate-950">FinCompass</span>
          <span className="block text-xs font-medium text-slate-500">Money clarity, calmly.</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-4">
        {mainNav.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
        <div className="my-4 border-t border-slate-200" />
        {accountNav.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
          <p className="truncate text-sm font-semibold text-slate-950">{user?.firstName} {user?.lastName}</p>
          <p className="mt-0.5 text-xs font-medium capitalize text-slate-500">{user?.tier} plan</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="min-h-10 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Desktop sidebar – hidden on mobile */}
      <aside
        data-testid="desktop-sidebar"
        className="hidden border-r border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/[0.03] backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col"
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-black tracking-tight text-slate-950">FinCompass</span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]"
            onClick={() => { navigate(ROUTES.NOTIFICATIONS); }}
          >
            <BellIcon count={unreadCount} />
          </button>
        </header>

        {/* Page content – extra bottom padding on mobile for tab bar */}
        <main className="flex-1 px-4 py-6 pb-safe-bottom sm:px-6 sm:py-8 lg:px-10 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        data-testid="mobile-bottom-nav"
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200/80 bg-white/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <BottomTabLink to={ROUTES.DASHBOARD} label="Dashboard" icon={<DashIcon />} />
        <BottomTabLink to={ROUTES.INCOME} label="Income" icon={<IncomeIcon />} />
        <BottomTabLink to={ROUTES.DEBTS} label="Debts" icon={<DebtsIcon />} />
        <BottomTabLink to={ROUTES.BUDGET} label="Budget" icon={<BudgetIcon />} />
        <BottomTabLink to={ROUTES.PROFILE} label="Profile" icon={<ProfileIcon />} badge={unreadCount} />
      </nav>
    </div>
  );
}

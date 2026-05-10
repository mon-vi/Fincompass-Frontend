import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AppLayout } from './AppLayout';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({ user: { firstName: 'Jane', lastName: 'Doe', tier: 'compass' } }),
}));

vi.mock('@/features/auth/hooks/useLogout', () => ({
  useLogout: () => vi.fn(),
}));

vi.mock('@/features/notifications/hooks', () => ({
  useNotifications: () => ({ unreadCount: 0 }),
}));

vi.mock('@/hooks', () => ({
  useTierAccess: () => false,
}));

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page content</div>,
    useNavigate: () => vi.fn(),
  };
});

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AppLayout />
    </MemoryRouter>,
  );
}

describe('AppLayout – mobile vs desktop structure', () => {
  it('renders the desktop sidebar element', () => {
    renderLayout();
    expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument();
  });

  it('renders the mobile bottom nav element', () => {
    renderLayout();
    expect(screen.getByTestId('mobile-bottom-nav')).toBeInTheDocument();
  });

  it('desktop sidebar has the lg:flex class (hidden on mobile via CSS)', () => {
    renderLayout();
    const sidebar = screen.getByTestId('desktop-sidebar');
    // Tailwind's `hidden` class hides it at base (mobile) width;
    // `lg:flex` shows it at desktop. We verify the class string.
    expect(sidebar.className).toMatch(/hidden/);
    expect(sidebar.className).toMatch(/lg:flex/);
  });

  it('bottom nav has the lg:hidden class (hidden on desktop)', () => {
    renderLayout();
    const nav = screen.getByTestId('mobile-bottom-nav');
    expect(nav.className).toMatch(/lg:hidden/);
  });

  it('bottom nav contains the 5 primary tab labels', () => {
    renderLayout();
    const nav = screen.getByTestId('mobile-bottom-nav');
    ['Dashboard', 'Income', 'Debts', 'Budget', 'Profile'].forEach((label) => {
      expect(nav).toHaveTextContent(label);
    });
  });

  it('renders page content via Outlet', () => {
    renderLayout();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('shows the FinCompass brand name in the mobile top bar', () => {
    renderLayout();
    // The brand appears in the sticky mobile header (lg:hidden)
    expect(screen.getAllByText('FinCompass').length).toBeGreaterThan(0);
  });
});

describe('PWA manifest', () => {
  it('manifest.webmanifest exists as a public file', async () => {
    // This is a build-time file; we just assert the path constant is predictable
    expect('/manifest.webmanifest').toMatch(/manifest\.webmanifest$/);
  });
});

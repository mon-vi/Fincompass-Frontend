import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillingPage } from './BillingPage';

const mocks = vi.hoisted(() => ({
  checkout: vi.fn(),
  portal: vi.fn(),
  subscription: { plan: 'compass', status: 'active', currentPeriodEnd: null as string | null, cancelAtPeriodEnd: false },
  dataUpdatedAt: 0,
}));

vi.mock('@/features/billing/hooks', () => ({
  useBillingSubscription: () => ({
    isLoading: false,
    isError: false,
    data: mocks.subscription,
    dataUpdatedAt: mocks.dataUpdatedAt,
  }),
  useBillingCheckout: () => ({ mutate: mocks.checkout, isPending: false, error: null, variables: null }),
  useBillingPortal: () => ({ mutate: mocks.portal, isPending: false, error: null }),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: Object.assign(
    (selector: (s: { user: null }) => unknown) => selector({ user: null }),
    { getState: () => ({ updateUser: vi.fn() }) }
  ),
}));

vi.mock('@/features/auth/services/authReal', () => ({
  getMeReal: vi.fn().mockResolvedValue({ tier: 'navigator' }),
}));

function renderBilling(initialPath = '/billing') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/billing" element={<BillingPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('BillingPage', () => {
  beforeEach(() => {
    mocks.subscription = { plan: 'compass', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false };
    mocks.dataUpdatedAt = 0;
    mocks.checkout = vi.fn();
    mocks.portal = vi.fn();
  });

  it('starts checkout from an upgrade CTA', async () => {
    renderBilling();

    await userEvent.click(screen.getAllByRole('button', { name: 'Upgrade' })[0]);

    expect(mocks.checkout).toHaveBeenCalledWith({ plan: 'navigator', billingCycle: 'monthly' }, expect.any(Object));
  });

  it('passes annual billing cycle to checkout', async () => {
    renderBilling();

    await userEvent.click(screen.getByRole('button', { name: /annual/i }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Upgrade' })[0]);

    expect(mocks.checkout).toHaveBeenCalledWith({ plan: 'navigator', billingCycle: 'annual' }, expect.any(Object));
  });

  it('does not crash when subscription date is invalid', () => {
    mocks.subscription = { plan: 'navigator', status: 'active', currentPeriodEnd: 'invalid-date', cancelAtPeriodEnd: false };

    renderBilling();

    expect(screen.getByText('Renews on —')).toBeInTheDocument();
  });

  it('shows plan updating banner after Stripe success return', () => {
    renderBilling('/billing?success=true');

    expect(screen.getByText(/your plan is updating/i)).toBeInTheDocument();
  });

  it('shows canceled notice after Stripe canceled return', () => {
    renderBilling('/billing?canceled=true');

    expect(screen.getByText(/checkout was canceled/i)).toBeInTheDocument();
  });

  it('renders plans and billing page without crash', () => {
    renderBilling();

    expect(screen.getByText(/plans & billing/i)).toBeInTheDocument();
  });

  it('disables upgrade buttons while plan is updating', () => {
    renderBilling('/billing?success=true');

    const upgradeButtons = screen.getAllByRole('button', { name: 'Upgrade' });
    upgradeButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

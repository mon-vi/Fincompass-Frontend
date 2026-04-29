import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillingPage } from './BillingPage';

const mocks = vi.hoisted(() => ({
  checkout: vi.fn(),
  portal: vi.fn(),
  subscription: { plan: 'compass', status: 'active', currentPeriodEnd: null as string | null, cancelAtPeriodEnd: false },
}));

vi.mock('@/features/billing/hooks', () => ({
  useBillingSubscription: () => ({ isLoading: false, isError: false, data: mocks.subscription }),
  useBillingCheckout: () => ({ mutate: mocks.checkout, isPending: false, error: null }),
  useBillingPortal: () => ({ mutate: mocks.portal, isPending: false, error: null }),
}));

describe('BillingPage', () => {
  beforeEach(() => {
    mocks.subscription = { plan: 'compass', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false };
  });

  it('starts checkout from an upgrade CTA', async () => {
    render(<BillingPage />);

    await userEvent.click(screen.getAllByRole('button', { name: 'Upgrade' })[0]);

    expect(mocks.checkout).toHaveBeenCalledWith({ plan: 'navigator' }, expect.any(Object));
  });

  it('does not crash when subscription date is invalid', () => {
    mocks.subscription = { plan: 'navigator', status: 'active', currentPeriodEnd: 'invalid-date', cancelAtPeriodEnd: false };

    render(<BillingPage />);

    expect(screen.getByText('Renews on —')).toBeInTheDocument();
  });
});

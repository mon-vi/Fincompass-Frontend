import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BillingPage } from './BillingPage';

const mocks = vi.hoisted(() => ({
  checkout: vi.fn(),
  portal: vi.fn(),
}));

vi.mock('@/features/billing/hooks', () => ({
  useBillingSubscription: () => ({ isLoading: false, isError: false, data: { plan: 'compass', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false } }),
  useBillingCheckout: () => ({ mutate: mocks.checkout, isPending: false, error: null }),
  useBillingPortal: () => ({ mutate: mocks.portal, isPending: false, error: null }),
}));

describe('BillingPage', () => {
  it('starts checkout from an upgrade CTA', async () => {
    render(<BillingPage />);

    await userEvent.click(screen.getAllByRole('button', { name: 'Upgrade' })[0]);

    expect(mocks.checkout).toHaveBeenCalledWith({ plan: 'navigator' }, expect.any(Object));
  });
});

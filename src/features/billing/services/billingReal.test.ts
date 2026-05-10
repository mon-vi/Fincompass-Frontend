import { beforeEach, describe, expect, it, vi } from 'vitest';
import { billingReal } from './billingReal';

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock('@/services/apiClient', () => ({ get: api.get, post: api.post }));

describe('billingReal', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
  });

  it('sends checkout tier and billing cycle', async () => {
    api.post.mockResolvedValue({ data: { url: 'https://checkout.example' } });

    await billingReal.createCheckout({ plan: 'cfo' });

    expect(api.post).toHaveBeenCalledWith('/api/v1/billing/checkout', { tier: 'cfo', billing_cycle: 'monthly' });
  });

  it('uses annual billing cycle when provided', async () => {
    api.post.mockResolvedValue({ data: { checkout_url: 'https://checkout.stripe.test' } });

    const result = await billingReal.createCheckout({ plan: 'navigator', billingCycle: 'annual' });

    expect(api.post).toHaveBeenCalledWith('/api/v1/billing/checkout', { tier: 'navigator', billing_cycle: 'annual' });
    expect(result.url).toBe('https://checkout.stripe.test');
  });

  it('handles null subscription safely', async () => {
    api.get.mockResolvedValue({ data: null });

    await expect(billingReal.getSubscription()).resolves.toBeNull();
  });

  it('maps current period end from backend field', async () => {
    api.get.mockResolvedValue({ data: { tier: 'navigator', status: 'active', current_period_ends_at: '2026-05-01T00:00:00Z' } });

    const subscription = await billingReal.getSubscription();

    expect(subscription?.currentPeriodEnd).toBe('2026-05-01T00:00:00Z');
  });

  it('drops invalid subscription dates', async () => {
    api.get.mockResolvedValue({ data: { tier: 'navigator', status: 'active', current_period_ends_at: 'not-a-date' } });

    const subscription = await billingReal.getSubscription();

    expect(subscription?.currentPeriodEnd).toBeNull();
  });
});

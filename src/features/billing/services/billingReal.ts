import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import { toValidDate } from '@/utils/formatters';
import type { LaravelResource } from '@/services/apiError';
import type { UserTier } from '@/types/auth';
import type { BillingApiAdapter, BillingRedirect, BillingSubscription, CheckoutPayload } from './billingApi';

interface LaravelBillingSubscription {
  plan?: UserTier;
  tier?: UserTier;
  status?: BillingSubscription['status'];
  current_period_ends_at?: string | null;
  cancel_at_period_end?: boolean;
}

function mapSubscription(subscription: LaravelBillingSubscription): BillingSubscription {
  const periodEnd = toValidDate(subscription.current_period_ends_at) ? subscription.current_period_ends_at! : null;
  return {
    plan: subscription.plan ?? subscription.tier ?? 'compass',
    status: subscription.status ?? 'none',
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
  };
}

export const billingReal: BillingApiAdapter = {
  async getSubscription(): Promise<BillingSubscription | null> {
    try {
      const res = await get<LaravelResource<LaravelBillingSubscription | null> | LaravelBillingSubscription | null>(apiPath(API.BILLING.SUBSCRIPTION));
      if (!res) return null;
      const subscription = 'data' in res ? res.data : res;
      return subscription ? mapSubscription(subscription) : null;
    } catch (err) {
      handleApiError(err);
    }
  },

  async createCheckout(payload: CheckoutPayload): Promise<BillingRedirect> {
    try {
      const res = await post<LaravelResource<{ url: string }>>(apiPath(API.BILLING.CHECKOUT), {
        tier: payload.plan,
        billing_cycle: payload.billingCycle ?? 'monthly',
      });
      return { url: res.data.url };
    } catch (err) {
      handleApiError(err);
    }
  },

  async createPortal(): Promise<BillingRedirect> {
    try {
      const res = await post<LaravelResource<{ url: string }>>(apiPath(API.BILLING.PORTAL));
      return { url: res.data.url };
    } catch (err) {
      handleApiError(err);
    }
  },
};

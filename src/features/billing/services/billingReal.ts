import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { UserTier } from '@/types/auth';
import type { BillingApiAdapter, BillingRedirect, BillingSubscription, CheckoutPayload } from './billingApi';

interface LaravelBillingSubscription {
  plan?: UserTier;
  tier?: UserTier;
  status?: BillingSubscription['status'];
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
}

function mapSubscription(subscription: LaravelBillingSubscription): BillingSubscription {
  return {
    plan: subscription.plan ?? subscription.tier ?? 'compass',
    status: subscription.status ?? 'none',
    currentPeriodEnd: subscription.current_period_end ?? null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
  };
}

export const billingReal: BillingApiAdapter = {
  async getSubscription(): Promise<BillingSubscription> {
    try {
      const res = await get<LaravelResource<LaravelBillingSubscription>>(apiPath(API.BILLING.SUBSCRIPTION));
      return mapSubscription(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async createCheckout(payload: CheckoutPayload): Promise<BillingRedirect> {
    try {
      const res = await post<LaravelResource<{ url: string }>>(apiPath(API.BILLING.CHECKOUT), { plan: payload.plan });
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

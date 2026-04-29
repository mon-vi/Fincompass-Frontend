import type { UserTier } from '@/types/auth';

export interface BillingSubscription {
  plan: UserTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'none';
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutPayload {
  plan: UserTier;
}

export interface BillingRedirect {
  url: string;
}

export interface BillingApiAdapter {
  getSubscription(): Promise<BillingSubscription>;
  createCheckout(payload: CheckoutPayload): Promise<BillingRedirect>;
  createPortal(): Promise<BillingRedirect>;
}

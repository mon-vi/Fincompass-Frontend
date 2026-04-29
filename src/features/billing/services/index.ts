import { billingReal } from './billingReal';
import type { BillingApiAdapter } from './billingApi';

export const billingAdapter: BillingApiAdapter = billingReal;

export type { BillingApiAdapter, BillingSubscription, BillingRedirect, CheckoutPayload } from './billingApi';

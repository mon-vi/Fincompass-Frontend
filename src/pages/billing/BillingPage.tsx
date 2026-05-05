import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
import { Skeleton } from '@/components/ui/Loader';
import { useBillingCheckout, useBillingPortal, useBillingSubscription } from '@/features/billing/hooks';
import { safeFormatDate } from '@/utils/formatters';
import type { UserTier } from '@/types/auth';

const plans = [
  {
    id: 'compass',
    name: 'Compass',
    price: '$0',
    period: 'forever',
    description: 'Get started with debt tracking and basic budgeting.',
    features: ['Debt tracking', 'Budget overview', 'Basic health score', 'Action plan'],
    bestFor: 'Getting organized',
  },
  {
    id: 'navigator',
    name: 'Navigator',
    price: '$9',
    period: 'per month',
    description: 'Advanced tools for serious debt payoff.',
    features: ['Everything in Compass', 'Payoff timeline & strategies', 'Guidance insights', 'OCR/email imports'],
    bestFor: 'Building momentum',
    recommended: true,
  },
  {
    id: 'cfo',
    name: 'CFO',
    price: '$19',
    period: 'per month',
    description: 'AI-powered financial coaching.',
    features: ['Everything in Navigator', 'ARIA AI assistant', 'Document vault', 'Personalized projections'],
    bestFor: 'Personalized guidance',
  },
];

export function BillingPage() {
  const subscription = useBillingSubscription();
  const checkout = useBillingCheckout();
  const portal = useBillingPortal();

  const currentPlan = subscription.data?.plan ?? 'compass';

  const redirectTo = (url: string) => {
    window.location.assign(url);
  };

  const handleCheckout = (plan: UserTier) => {
    checkout.mutate({ plan }, { onSuccess: ({ url }) => redirectTo(url) });
  };

  const handlePortal = () => {
    portal.mutate(undefined, { onSuccess: ({ url }) => redirectTo(url) });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-[#12355b] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-100">Plans & billing</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Upgrade when the next layer is useful.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100">
          FinCompass starts simple. Navigator adds import and strategy tools. CFO adds ARIA for deeper guidance when you want it.
        </p>
      </div>

      {subscription.isError && (
        <Alert variant="error" title="Billing details did not load">
          {(subscription.error as Error)?.message ?? 'We could not load subscription details. Check your connection and try again.'}
        </Alert>
      )}

      {(checkout.isError || portal.isError) && (
        <PremiumErrorAlert message={(checkout.error as Error)?.message ?? (portal.error as Error)?.message ?? 'Billing request failed. Please try again.'} />
      )}

      {subscription.isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-72 w-full" />)}
        </div>
      )}

      {!subscription.isLoading && <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card
              key={plan.id}
              className={plan.recommended ? 'relative overflow-hidden ring-4 ring-[#d97735]/15 border-[#d97735]/30' : 'relative overflow-hidden'}
            >
              {plan.recommended && <div className="absolute inset-x-0 top-0 h-1.5 bg-[#d97735]" />}
              <CardHeader>
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{plan.bestFor}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {plan.recommended && <Badge variant="tier">Popular</Badge>}
                  {isCurrent && <Badge variant="success">Current plan</Badge>}
                </div>
              </CardHeader>
              <div className="mb-4">
                <span className="text-4xl font-black tracking-tight text-slate-950">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-slate-500">{plan.period}</span>
              </div>
              <p className="mb-5 text-sm leading-6 text-slate-600">{plan.description}</p>
              <ul className="mb-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-600">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                variant={isCurrent ? 'secondary' : plan.recommended ? 'accent' : 'outline'}
                disabled={isCurrent || checkout.isPending || portal.isPending}
                isLoading={checkout.isPending && checkout.variables?.plan === plan.id}
                onClick={() => plan.id === 'compass' ? handlePortal() : handleCheckout(plan.id as UserTier)}
              >
                {isCurrent ? 'Current plan' : plan.id === 'compass' ? 'Manage downgrade' : 'Upgrade'}
              </Button>
            </Card>
          );
        })}
      </div>}

      <Card className="bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Billing details</CardTitle>
        </CardHeader>
        {subscription.data ? (
          <div className="grid gap-4 text-sm text-slate-600 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 sm:grid-cols-2">
              <p className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
                Current plan: <span className="font-bold capitalize text-slate-950">{subscription.data.plan}</span>
              </p>
              <p className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
                Status: <span className="font-bold capitalize text-slate-950">{subscription.data.status.replaceAll('_', ' ')}</span>
              </p>
            {subscription.data.currentPeriodEnd && (
                <p className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 sm:col-span-2">Renews on {safeFormatDate(subscription.data.currentPeriodEnd, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            )}
            </div>
            <Button variant="outline" onClick={handlePortal} isLoading={portal.isPending} className="w-full sm:w-auto">
              Manage subscription
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Subscription details are unavailable.</p>
        )}
      </Card>
    </div>
  );
}

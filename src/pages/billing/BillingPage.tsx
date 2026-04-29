import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { useBillingCheckout, useBillingPortal, useBillingSubscription } from '@/features/billing/hooks';
import type { UserTier } from '@/types/auth';

const plans = [
  {
    id: 'compass',
    name: 'Compass',
    price: '$0',
    period: 'forever',
    description: 'Get started with debt tracking and basic budgeting.',
    features: ['Debt tracking', 'Budget overview', 'Basic health score', 'Action plan'],
  },
  {
    id: 'navigator',
    name: 'Navigator',
    price: '$9',
    period: 'per month',
    description: 'Advanced tools for serious debt payoff.',
    features: ['Everything in Compass', 'Payoff timeline & strategies', 'Guidance insights', 'Priority support'],
    recommended: true,
  },
  {
    id: 'cfo',
    name: 'CFO',
    price: '$19',
    period: 'per month',
    description: 'AI-powered financial coaching.',
    features: ['Everything in Navigator', 'ARIA AI assistant', 'Document vault', 'Personalized projections'],
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
      <SectionHeader
        title="Billing & Subscription"
        subtitle="Choose the plan that fits your financial journey"
      />

      {subscription.isError && (
        <Alert variant="error">{(subscription.error as Error)?.message ?? 'Failed to load subscription details.'}</Alert>
      )}

      {(checkout.isError || portal.isError) && (
        <Alert variant="error">
          {(checkout.error as Error)?.message ?? (portal.error as Error)?.message ?? 'Billing request failed. Please try again.'}
        </Alert>
      )}

      {subscription.isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-72 w-full" />)}
        </div>
      )}

      {!subscription.isLoading && <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card
              key={plan.id}
              className={plan.recommended ? 'ring-2 ring-indigo-500' : ''}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                {plan.recommended && <Badge variant="tier">Popular</Badge>}
                {isCurrent && <Badge variant="success">Current plan</Badge>}
              </CardHeader>
              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500 ml-1">{plan.period}</span>
              </div>
              <p className="mb-4 text-sm text-slate-600">{plan.description}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-500">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                variant={isCurrent ? 'secondary' : plan.recommended ? 'primary' : 'outline'}
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

      <Card>
        <CardHeader>
          <CardTitle>Billing details</CardTitle>
        </CardHeader>
        {subscription.data ? (
          <div className="space-y-4 text-sm text-slate-600">
            <p>
              Current plan: <span className="font-semibold capitalize text-slate-900">{subscription.data.plan}</span>
            </p>
            <p>
              Status: <span className="font-semibold capitalize text-slate-900">{subscription.data.status.replaceAll('_', ' ')}</span>
            </p>
            {subscription.data.currentPeriodEnd && (
              <p>Renews on {new Date(subscription.data.currentPeriodEnd).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            )}
            <Button variant="outline" onClick={handlePortal} isLoading={portal.isPending}>
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

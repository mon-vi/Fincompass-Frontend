import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'The page could not finish loading.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12">
      <section className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 text-center shadow-xl shadow-slate-900/[0.06]">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2b6d91]">FinCompass</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">We hit a temporary snag</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account is safe. Try reloading, or return to your dashboard and continue from there.
        </p>
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}>
            Return to dashboard
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </section>
    </main>
  );
}

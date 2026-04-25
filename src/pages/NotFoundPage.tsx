import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-slate-200">404</h1>
      <p className="text-xl font-semibold text-slate-700">Page not found</p>
      <p className="text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

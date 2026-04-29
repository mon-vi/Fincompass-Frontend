import { Link } from 'react-router-dom';
import { Alert } from './Alert';
import { Button } from './Button';
import { ROUTES } from '@/constants/routes';

interface PremiumErrorAlertProps {
  message: string;
  className?: string;
}

function isTierMessage(message: string): boolean {
  return /subscription|upgrade|tier|plan|navigator|cfo/i.test(message);
}

export function PremiumErrorAlert({ message, className }: PremiumErrorAlertProps) {
  return (
    <Alert variant="error" className={className}>
      <div className="space-y-3">
        <p>{message}</p>
        {isTierMessage(message) && (
          <Link to={ROUTES.BILLING}>
            <Button size="sm" variant="outline">View upgrade options</Button>
          </Link>
        )}
      </div>
    </Alert>
  );
}

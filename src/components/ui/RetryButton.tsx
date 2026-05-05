import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Alert } from './Alert';

interface RetryButtonProps {
  error: Error | null | undefined;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

/**
 * Error state with a retry CTA. Drop-in replacement for the plain <Alert>
 * on any screen that supports manual refetch.
 */
export function RetryButton({ error, onRetry, isRetrying, className }: RetryButtonProps) {
  if (!error) return null;
  return (
    <div className={cn('space-y-3', className)}>
      <Alert variant="error" title="That did not load">{error.message ?? 'Check your connection and try again.'}</Alert>
      <Button variant="outline" size="sm" isLoading={isRetrying} onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

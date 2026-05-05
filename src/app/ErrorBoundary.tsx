import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary.
 * Catches unhandled render errors and shows a recovery UI.
 * Wrap individual features in their own boundaries as the app grows.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with proper error reporting (e.g. Sentry) in production
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4">
            <Alert variant="error" title="We hit a temporary snag">
              {this.state.error?.message ?? 'Your account is safe. Try again to continue.'}
            </Alert>
            <Button variant="secondary" onClick={this.handleReset} fullWidth>
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Button } from '@/components/ui/Button';

interface StepNavigationProps {
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function StepNavigation({ onBack, isSubmitting, isLastStep }: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isSubmitting}
        >
          ← Back
        </Button>
      ) : (
        <div />
      )}

      <Button type="submit" isLoading={isSubmitting}>
        {isLastStep ? 'Complete setup' : 'Continue →'}
      </Button>
    </div>
  );
}

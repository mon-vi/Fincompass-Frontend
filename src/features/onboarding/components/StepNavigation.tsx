import { Button } from '@/components/ui/Button';

interface StepNavigationProps {
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function StepNavigation({ onBack, isSubmitting, isLastStep }: StepNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}

      <Button type="submit" isLoading={isSubmitting} variant={isLastStep ? 'accent' : 'primary'} className="w-full sm:w-auto">
        {isLastStep ? 'Complete setup' : 'Save and continue'}
      </Button>
    </div>
  );
}

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function PageContainer({ narrow = false, className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-2xl' : 'max-w-7xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

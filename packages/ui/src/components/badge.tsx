import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brand-blue text-white',
        secondary: 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning-dark border border-warning/20',
        danger: 'bg-danger/10 text-danger border border-danger/20',
        info: 'bg-info/10 text-info-dark border border-info/20',
        outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
        accent: 'bg-brand-orange text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };



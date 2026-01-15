'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'white';
  rounded?: '1rem' | '1.25rem' | '1.75rem';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', rounded = '1rem', ...props }, ref) => {
    const roundedClassMap = {
      '1rem': 'rounded-[1rem]',
      '1.25rem': 'rounded-[1.25rem]',
      '1.75rem': 'rounded-[1.75rem]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border border-[#CDD0D5] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]',
          roundedClassMap[rounded],
          variant === 'default' && 'bg-[#FDFDFD]',
          variant === 'white' && 'bg-[#FFFFFF]',
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-[1.25rem]', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('text-[1.125rem]', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-end justify-between', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardTitle, CardFooter };


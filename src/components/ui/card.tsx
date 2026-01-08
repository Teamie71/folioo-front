'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]',
      className,
    )}
    {...props}
  />
));
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


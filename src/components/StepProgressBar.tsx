'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/Progress';
import { StepNumberCircleIcon } from '@/components/icons/StepNumberCircleIcon';
import { cn } from '@/utils/utils';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
  className?: string;
  hideLabels?: boolean;
}

export function StepProgressBar({
  steps,
  currentStep,
  className,
  hideLabels = false,
}: StepProgressBarProps) {
  const totalSteps = steps.length;

  const targetProgress = (currentStep / totalSteps) * 100;
  const prevProgress = ((currentStep - 1) / totalSteps) * 100;
  const [progressValue, setProgressValue] = React.useState(
    Math.max(0, prevProgress),
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        !hideLabels && 'gap-[0.875rem]',
        className,
      )}
    >
      <Progress
        value={progressValue}
        className={cn(
          'h-[0.375rem] rounded-[1.25rem] bg-gray3',
          '[&>*]:bg-gradient-to-b [&>*]:from-[#93B3F4] [&>*]:to-main',
          '[&>*]:transition-all [&>*]:duration-500 [&>*]:ease-out',
        )}
      />

      {!hideLabels && (
        <div className='flex'>
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum <= currentStep;

            return (
              <div
                key={index}
                className='flex flex-1 items-center gap-[0.5rem] transition-colors duration-300'
              >
                <StepNumberCircleIcon
                  number={stepNum}
                  className={cn(
                    'transition-colors duration-300',
                    stepNum > 3
                      ? isActive
                        ? 'bg-main'
                        : 'bg-gray4'
                      : isActive
                        ? 'text-main'
                        : 'text-gray4',
                  )}
                />

                <span
                  className={cn(
                    'transition-colors duration-300',
                    isActive
                      ? 'typo-nav-select text-main'
                      : 'typo-nav-default text-gray5',
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

type Step = 'information' | 'portfolio' | 'analysis' | 'result';
type Status = 'DRAFT' | 'ANALYZING' | 'DONE';

interface CorrectionProgressBarProps {
  step: Step;
  status?: Status;
  className?: string;
}

interface StepItem {
  number: number;
  label: string;
  isActive: (step: Step, status?: Status) => boolean;
}

const steps: StepItem[] = [
  {
    number: 1,
    label: '지원 정보',
    isActive: (step) =>
      step === 'information' || step === 'portfolio' || step === 'analysis',
  },
  {
    number: 2,
    label: '포트폴리오 선택',
    isActive: (step) => step === 'portfolio' || step === 'analysis',
  },
  {
    number: 3,
    label: '기업 분석',
    isActive: (step) => step === 'analysis',
  },
  {
    number: 4,
    label: '첨삭 결과',
    isActive: (step, status) => status === 'ANALYZING',
  },
];

const getProgressWidth = (step: Step, status?: Status): string => {
  if (status === 'ANALYZING') {
    return '100%';
  }
  
  switch (step) {
    case 'result':
      return '0%';
    case 'information':
      return '25%';
    case 'portfolio':
      return '50%';
    case 'analysis':
      return '75%';
    default:
      return '100%';
  }
};

export function CorrectionProgressBar({
  step,
  status,
  className,
}: CorrectionProgressBarProps) {
  return (
    <div className={cn('flex flex-col gap-[0.75rem] pb-[72px]', className)}>
      {/* 프로그레스 바 */}
      <div className='relative h-[0.25rem] w-full overflow-hidden rounded-[1.25rem] bg-[#E9EAEC]'>
        <div
          className='h-full rounded-[1.25rem] transition-all duration-300'
          style={{
            width: getProgressWidth(step, status),
            background: 'linear-gradient(to bottom, #93B3F4, #5060C5)',
          }}
        />
      </div>

      {/* 단계 라벨들 */}
      {step !== 'result' && (
        <div className='grid grid-cols-4 items-center'>
          {steps.map((stepItem) => {
            const isActive = stepItem.isActive(step, status);

            return (
              <div key={stepItem.number} className='flex items-center gap-[0.5rem]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <circle
                    cx='10'
                    cy='10'
                    r='10'
                    fill={isActive ? '#5060C5' : '#CDD0D5'}
                  />
                  <text
                    x='10'
                    y='14.5'
                    textAnchor='middle'
                    fontSize='14'
                    fontWeight='bold'
                    fill='white'
                    fontFamily='Arial, sans-serif'
                  >
                    {stepItem.number}
                  </text>
                </svg>
                <span
                  className={cn(
                    'text-[1rem]',
                    isActive
                      ? 'font-bold text-[#5060C5]'
                      : 'font-regular text-[#9EA4A9]',
                  )}
                >
                  {stepItem.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

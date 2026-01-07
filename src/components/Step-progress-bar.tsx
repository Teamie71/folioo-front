'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/utils';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepProgressBar({
  steps,
  currentStep,
  className,
}: StepProgressBarProps) {
  const totalSteps = steps.length;
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('flex w-full flex-col gap-[0.625rem]', className)}>
      {/* 상단 프로그레스 바 */}
      <Progress
        value={progressValue}
        className='h-[0.3rem] rounded-[1.25rem] bg-[#E9EAEC] [&>*]:bg-gradient-to-b [&>*]:from-[#93B3F4] [&>*]:to-[#5060C5]'
      />

      {/* 하단 단계 라벨 영역 */}
      <div className='flex'>
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum <= currentStep;

          return (
            <div
              key={index}
              className={cn(
                'flex flex-1 items-center gap-[0.5rem] transition-colors duration-300',
                // 텍스트 라벨 색상도 활성화 여부에 따라 변경
                isActive ? 'font-medium text-[#5060C5]' : 'text-[#9EA4A9]',
              )}
            >
              {/* 원형 숫자 뱃지 */}
              <div
                className={cn(
                  'flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full text-[16px] leading-none transition-all duration-300',
                  isActive
                    ? 'bg-[#5060C5] text-[#ffffff]' // 활성
                    : 'bg-[#CDD0D5] text-[#ffffff]', // 비활성
                )}
              >
                {stepNum}
              </div>

              {/* 단계 이름 */}
              <span className='text-[1rem]'>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

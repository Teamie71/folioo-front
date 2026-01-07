'use client';

import * as React from 'react';
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

  // 목표 지점 계산
  const targetProgress = (currentStep / totalSteps) * 100;

  // 시작 지점 계산 (이전 단계의 퍼센트)
  // 1단계일 때는 0, 2단계일 때는 1단계의 지점이 되도록
  const prevProgress = ((currentStep - 1) / totalSteps) * 100;

  // state 초기값을 '이전 단계 지점'으로 설정
  // Math.max(0, ...)을 써서 1단계일 때 음수가 나오지 않도록
  const [progressValue, setProgressValue] = React.useState(
    Math.max(0, prevProgress),
  );

  React.useEffect(() => {
    // 컴포넌트 마운트 후 아주 짧은 시간 뒤에 목표 지점으로 변경
    // -> 이전 지점부터 목표 지점까지 차오르는 애니메이션 발생
    const timer = setTimeout(() => {
      setProgressValue(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <div className={cn('flex w-full flex-col gap-[0.625rem]', className)}>
      {/* 상단 프로그레스 바 */}
      <Progress
        value={progressValue}
        className={cn(
          'h-[0.3rem] rounded-[1.25rem] bg-[#E9EAEC]',
          // 자식 요소 스타일링
          '[&>*]:bg-gradient-to-b [&>*]:from-[#93B3F4] [&>*]:to-[#5060C5]',
          // 0.5초동안 부드럽게 이동
          '[&>*]:transition-all [&>*]:duration-500 [&>*]:ease-out',
        )}
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
                isActive ? 'font-medium text-[#5060C5]' : 'text-[#9EA4A9]',
              )}
            >
              {/* 원형 숫자 뱃지 */}
              <div
                className={cn(
                  'flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full text-[16px] leading-none transition-all duration-300',
                  isActive
                    ? 'bg-[#5060C5] text-[#ffffff]'
                    : 'bg-[#CDD0D5] text-[#ffffff]',
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

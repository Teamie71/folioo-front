'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/utils';
import { ModifyIcon } from '@/components/icons/ModifyIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { ModifyButton } from './ModifyButton';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { useProgressDrag } from '../hooks/useProgressDrag';
import { useContributionInput } from '../hooks/useContributionInput';

// 기여도 프로그레스 바
interface ContributionSectionProps {
  initialValue?: number;
  className?: string;
  duration?: number;
}

export function ContributionSection({
  initialValue = 0,
  className,
  duration = 1000,
}: ContributionSectionProps) {
  const [value, setValue] = React.useState(initialValue);
  const safeValue = Math.min(100, Math.max(0, value));
  const progressRef = React.useRef<HTMLDivElement>(null);

  // 드래그 관련 로직: useProgressDrag hook
  const { isDragging, handleProgressClick, handleMouseDown } = useProgressDrag(
    progressRef,
    setValue,
  );

  // 입력 편집 관련 로직: useContributionInput hook
  const {
    isEditing,
    setIsEditing,
    inputValue,
    handleInputChange,
    handleInputSubmit,
    handleKeyDown,
  } = useContributionInput(safeValue, setValue);

  // 드래그 중일 때는 애니메이션 없이 즉시 반응: useAnimatedNumber hook
  const effectiveDuration = isDragging ? 0 : duration;
  const animatedValue = useAnimatedNumber(safeValue, effectiveDuration);

  return (
    <div className={cn('flex w-auto items-center gap-[1.5rem]', className)}>
      <p className='text-[1.125rem] font-bold text-[#1A1A1A]'>기여도</p>

      <div
        ref={progressRef}
        onClick={isEditing ? handleProgressClick : undefined}
        onMouseDown={isEditing ? handleMouseDown : undefined}
        className={cn(
          'relative select-none',
          isEditing && 'cursor-pointer',
          isDragging && 'cursor-grabbing',
        )}
      >
        <Progress
          value={safeValue}
          className={cn(
            // Track
            'h-[0.625rem] w-[21.25rem] rounded-[1.25rem] bg-[#E9EAEC]',

            // Indicator
            '[&>*]:rounded-[1.25rem] [&>*]:bg-gradient-to-r [&>*]:from-[#5060C5] [&>*]:to-[#7EA1E8]',

            // 드래그 중에는 transition 제거하여 즉시 반응
            isDragging && '[&>*]:transition-none',
          )}
        />

        {/* 편집 모드일 때 Indicator 핸들 */}
        {isEditing && (
          <div
            className='absolute top-1/2 flex -translate-y-1/2 items-center justify-center'
            style={{
              left: `calc(${safeValue}% - 0.75rem)`,
            }}
          >
            {/* 외부 원 */}
            <div className='flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full bg-[#5060C5]'>
              {/* 내부 원 */}
              <div className='h-[0.75rem] w-[0.75rem] rounded-full bg-[#ffffff]' />
            </div>
          </div>
        )}
      </div>

      {/* 퍼센트 텍스트 - 편집 가능 */}
      {isEditing ? (
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className='h-[2rem] w-[2.875rem] rounded border border-[#000000] px-1 text-center text-[1rem] font-bold text-[#1A1A1A] outline-none'
        />
      ) : (
        <span
          className={cn(
            'flex h-[2rem] w-[2.875rem] items-center justify-center text-center text-[1rem] font-bold text-[#1A1A1A]',
          )}
        >
          {/* 드래그 중에는 실제 값을, 아닐 때는 애니메이션 값을 표시 */}
          {Math.round(isDragging ? safeValue : animatedValue)}%
        </span>
      )}

      <div className='flex items-center text-center'>
        <ModifyButton
          isModifying={isEditing}
          onClick={() => {
            if (isEditing) {
              handleInputSubmit();
            } else {
              setIsEditing(true);
            }
          }}
        />
      </div>
    </div>
  );
}

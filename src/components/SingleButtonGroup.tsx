'use client';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { cn } from '@/utils/utils';

interface Option {
  label: string;
  icon?: React.ReactNode; // label 왼쪽에 표시될 아이콘
}

// 컴포넌트 속성
interface SingleButtonGroupProps {
  options: readonly Option[];
  className?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

export function SingleButtonGroup({
  options,
  className,
  onValueChange,
  defaultValue,
  value,
}: SingleButtonGroupProps) {
  // 선택 해제 방지: 빈 값이 들어오면 콜백 호출하지 않음
  const handleValueChange = (newValue: string) => {
    if (newValue && onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <>
      {/* 미선택 아이콘 #74777D, 선택 시 #5060C5 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          span svg {
            width: auto;
            height: auto;
          }
          [data-state='off'] span svg path[fill],
          [data-state='off'] span svg g path[fill] {
            fill: #74777D !important;
          }
          [data-state='off'] span svg path[stroke],
          [data-state='off'] span svg g path[stroke] {
            stroke: #74777D !important;
          }
          [data-state='on'] span svg path[fill],
          [data-state='on'] span svg g path[fill] {
            fill: #5060C5 !important;
          }
          [data-state='on'] span svg path[stroke],
          [data-state='on'] span svg g path[stroke] {
            stroke: #5060C5 !important;
          }
        `,
        }}
      />
      <ToggleGroup
        type='single' // 하나만 선택 가능
        className={cn('flex items-center gap-[1.25rem]', className)}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        value={value}
      >
        {options.map((option) => {
          return (
            <ToggleGroupItem
              key={option.label}
              value={option.label}
              className={cn(
                // 기본 스타일링
                'font-regular flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border-[0.0625rem] border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.625rem] text-[1rem] text-[#1A1A1A]',

                // 선택된 상태 효과
                'data-[state=on]:border-[0.125rem] data-[state=on]:border-[#5060C5] data-[state=on]:bg-[#F6F5FF] data-[state=on]:px-[1.4375rem] data-[state=on]:py-[0.5rem] data-[state=on]:font-semibold data-[state=on]:text-[#5060C5]',
              )}
              style={
                {
                  // 선택된 상태에서 border가 두꺼워져도 버튼 크기가 변하지 않도록 처리
                  boxSizing: 'border-box',
                } as React.CSSProperties & { '--border-diff': string }
              }
            >
              {option.icon && <span className='shrink-0'>{option.icon}</span>}
              {option.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </>
  );
}

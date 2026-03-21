'use client';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { cn } from '@/utils/utils';

export type LogContentType = 'create' | 'list';

interface LogContentToggleProps {
  value: LogContentType;
  onValueChange: (value: LogContentType) => void;
  className?: string;
}

export function LogContentToggle({
  value,
  onValueChange,
  className,
}: LogContentToggleProps) {
  return (
    <ToggleGroup
      type='single'
      value={value}
      onValueChange={(val) => {
        if (val) onValueChange(val as LogContentType);
      }}
      className={cn('flex w-full bg-white', className)}
    >
      <ToggleGroupItem
        value='create'
        className={cn(
          'h-[3.5rem] flex-1 rounded-none border-b-2 bg-transparent transition-all hover:bg-transparent data-[state=on]:bg-transparent',
          value === 'create'
            ? 'typo-b2-b border-main text-main'
            : 'typo-b2 text-gray5 border-transparent',
        )}
      >
        새로운 로그 작성
      </ToggleGroupItem>

      {/* 구분선 */}
      <div className='h-[1.5rem] w-[1px] bg-[#E5E7EB]' />

      <ToggleGroupItem
        value='list'
        className={cn(
          'h-[3.5rem] flex-1 rounded-none border-b-2 bg-transparent transition-all hover:bg-transparent data-[state=on]:bg-transparent',
          value === 'list'
            ? 'typo-b2-b border-main text-main'
            : 'typo-b2 text-gray5 border-transparent',
        )}
      >
        나의 로그
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

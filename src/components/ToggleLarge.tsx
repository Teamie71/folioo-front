'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { Toggle, ToggleProps } from './ui/CustomToggle';

export function ToggleLarge<T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleProps<T>) {
  return (
    <div
      className={cn(
        'flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]',
        className,
      )}
    >
      <Toggle.Root value={value} onChange={onChange} className="flex gap-[0.25rem]">
        {options.map((option, index) => (
          <Toggle.Item
            key={option.value}
            value={option.value}
            activeClassName="border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]"
            inactiveClassName="border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]"
            buttonClassName={cn(
              'h-[40px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap',
              index === 0 ? 'w-[211px]' : 'w-[212px]',
            )}
          >
            {option.label}
          </Toggle.Item>
        ))}
      </Toggle.Root>
    </div>
  );
}

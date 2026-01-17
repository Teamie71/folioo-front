'use client';

import * as React from 'react';
import { Toggle, ToggleProps } from './ui/CustomToggle';

export function ToggleSmall<T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleProps<T>) {
  const handleChange = (newValue: string) => {
    onChange(newValue as T);
  };

  return (
    <Toggle.Root value={value} onChange={handleChange} className={className}>
      {options.map((option) => (
        <Toggle.Item
          key={option.value}
          value={option.value}
          activeClassName="bg-[#5060C5] text-[#FFFFFF]"
          inactiveClassName="bg-[#E9EAEC] text-[#74777D]"
          buttonClassName="h-[29px] w-[77px] rounded-[0.25rem] text-[0.875rem]"
        >
          {option.label}
        </Toggle.Item>
      ))}
    </Toggle.Root>
  );
}

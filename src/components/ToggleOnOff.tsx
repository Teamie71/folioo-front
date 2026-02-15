'use client';

import { useState } from 'react';
import { cn } from '@/utils/utils';

interface ToggleOnOffProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleOnOff({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
}: ToggleOnOffProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : uncontrolled;

  const handleClick = () => {
    const next = !isOn;
    if (!isControlled) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type='button'
      role='switch'
      aria-checked={isOn}
      onClick={handleClick}
      className={cn(
        'relative flex h-[1.75rem] w-[3.375rem] cursor-pointer items-center rounded-[2.5rem] p-[0.25rem] transition-colors duration-200 ease-in-out',
        isOn ? 'bg-[#5060C5]' : 'bg-[#CDD0D5]',
        className,
      )}
    >
      <span
        className={cn(
          'h-[1.25rem] w-[1.25rem] shrink-0 rounded-full bg-white transition-transform duration-200 ease-in-out',
          isOn && 'translate-x-[1.625rem]',
        )}
      />
    </button>
  );
}

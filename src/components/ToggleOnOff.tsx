'use client';

import { useState } from 'react';
import { cn } from '@/utils/utils';
import Image from 'next/image';

interface ToggleOnOffProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  variant?: 'default' | 'mobile';
  'aria-label'?: string;
}

export function ToggleOnOff({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  variant = 'default',
  'aria-label': ariaLabel,
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
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        'relative flex h-[1.75rem] w-[3.375rem] cursor-pointer items-center rounded-[2.5rem] p-[0.25rem] transition-colors duration-200 ease-in-out',
        isOn ? 'bg-[#5060C5]' : 'bg-[#CDD0D5]',
        variant === 'mobile' && 'w-[53px]',
        className,
      )}
    >
      {variant === 'mobile' && !isOn ? (
        <Image
          src='/mobile/switch-off.svg'
          alt=''
          width={53}
          height={28}
          className='absolute top-0 left-0 max-w-none'
        />
      ) : (
        <span
          className={cn(
            'h-[1.25rem] w-[1.25rem] shrink-0 rounded-full bg-white transition-transform duration-200 ease-in-out',
            isOn &&
              (variant === 'mobile'
                ? 'translate-x-[25px]'
                : 'translate-x-[1.625rem]'),
          )}
        />
      )}
    </button>
  );
}

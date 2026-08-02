'use client';

import { cn } from '@/utils/utils';

type ViewMode = 'map' | 'list';

type Props = {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
};

const OPTIONS = [
  { label: '맵 뷰', value: 'map' as const },
  { label: '리스트 뷰', value: 'list' as const },
];

export function ExperienceListViewSwitchToggle({
  value,
  onValueChange,
}: Props) {
  return (
    <div
      role='tablist'
      aria-label='뷰 전환'
      className='bg-gray3 relative flex h-[29px] w-[158px] shrink-0 rounded-[6px]'
    >
      <div
        aria-hidden
        className={cn(
          'bg-main pointer-events-none absolute inset-y-0 left-0 w-[79px] rounded-[6px] transition-transform duration-200 ease-in-out',
          value === 'map' ? 'translate-x-0' : 'translate-x-full',
        )}
      />
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type='button'
            role='tab'
            aria-selected={selected}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'typo-c1-b relative z-10 flex h-[29px] w-[79px] cursor-pointer items-center justify-center rounded-[6px] px-[20px] py-[4px] transition-colors',
              selected ? 'text-white' : 'text-gray6',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

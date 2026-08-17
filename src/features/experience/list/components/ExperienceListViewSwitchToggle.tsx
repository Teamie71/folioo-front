'use client';

import { cn } from '@/utils/utils';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';

type Props = {
  value: WorkspaceView;
  onValueChange: (value: WorkspaceView) => void;
  /** hover/focus 등 "곧 누를 것 같은" 시점. 번들 preload 트리거로 쓴다. */
  onOptionIntent?: (value: WorkspaceView) => void;
};

const OPTIONS: Array<{ label: string; value: WorkspaceView }> = [
  { label: '맵 뷰', value: 'map' },
  { label: '리스트 뷰', value: 'list' },
];

export function ExperienceListViewSwitchToggle({
  value,
  onValueChange,
  onOptionIntent,
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
            onPointerEnter={() => onOptionIntent?.(option.value)}
            onFocus={() => onOptionIntent?.(option.value)}
            className={cn(
              'typo-c1-b relative z-10 flex h-[29px] w-[79px] cursor-pointer items-center justify-center rounded-[6px] px-[8px] py-[4px] whitespace-nowrap transition-colors',
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

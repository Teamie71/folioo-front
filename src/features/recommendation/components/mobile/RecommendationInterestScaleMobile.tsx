'use client';

import { InterestLikertIcon } from '@/components/icons/InterestLikertIcon';
import type { InterestLikertValue } from '@/features/recommendation/constants';

const LIKERT_MOBILE_LAYOUT = [
  { value: 1 as const, tone: 'agree' as const, size: 44, left: 0, top: 0 },
  { value: 2 as const, tone: 'agree' as const, size: 36, left: 60, top: 4 },
  { value: 3 as const, tone: 'agree' as const, size: 30, left: 112, top: 7 },
  { value: 4 as const, tone: 'disagree' as const, size: 30, left: 158, top: 7 },
  { value: 5 as const, tone: 'disagree' as const, size: 36, left: 204, top: 4 },
  { value: 6 as const, tone: 'disagree' as const, size: 44, left: 256, top: 0 },
] as const;

interface RecommendationInterestScaleMobileProps {
  name: string;
  value?: InterestLikertValue;
  onChange: (value: InterestLikertValue) => void;
}

export function RecommendationInterestScaleMobile({
  name,
  value,
  onChange,
}: RecommendationInterestScaleMobileProps) {
  return (
    <div
      className='relative h-[4.25rem] w-[18.75rem] shrink-0'
      role='radiogroup'
      aria-label={name}
      data-likert-circles
    >
      {LIKERT_MOBILE_LAYOUT.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={selected}
            aria-label={
              option.tone === 'agree'
                ? `그렇다 ${option.value}`
                : `그렇지 않다 ${option.value}`
            }
            onClick={() => onChange(option.value)}
            className='absolute flex cursor-pointer items-center justify-center border-none bg-transparent p-0'
            style={{
              left: option.left,
              top: option.top,
              width: option.size,
              height: option.size,
            }}
          >
            <InterestLikertIcon
              tone={option.tone}
              selected={selected}
              size={option.size}
            />
          </button>
        );
      })}

      <span className='absolute top-[3.25rem] left-[0.5625rem] text-[0.625rem] leading-[150%] text-gray9'>
        그렇다
      </span>
      <span className='absolute top-[3.25rem] right-0 text-[0.625rem] leading-[150%] text-gray9'>
        그렇지 않다
      </span>
    </div>
  );
}

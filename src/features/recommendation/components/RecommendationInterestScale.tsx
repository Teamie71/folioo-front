'use client';

import { InterestLikertIcon } from '@/components/icons/InterestLikertIcon';
import {
  INTEREST_LIKERT_OPTIONS,
  type InterestLikertValue,
} from '@/features/recommendation/constants';

interface RecommendationInterestScaleProps {
  name: string;
  value?: InterestLikertValue;
  onChange: (value: InterestLikertValue) => void;
}

export function RecommendationInterestScale({
  name,
  value,
  onChange,
}: RecommendationInterestScaleProps) {
  return (
    <div className='flex w-[380px] flex-col gap-[8px]'>
      <div
        className='flex items-center gap-[32px]'
        role='radiogroup'
        aria-label={name}
        data-likert-circles
      >
        {INTEREST_LIKERT_OPTIONS.map((option) => {
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
              className='flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0'
              style={{ width: option.size, height: option.size }}
            >
              <span
                className='overflow-hidden'
                style={{ width: option.size, height: option.size }}
              >
                <InterestLikertIcon
                  tone={option.tone}
                  selected={selected}
                  size={option.size}
                />
              </span>
            </button>
          );
        })}
      </div>
      <div className='flex justify-between'>
        <span className='text-gray9 text-[0.625rem] leading-[150%]'>그렇다</span>
        <span className='text-gray9 text-[0.625rem] leading-[150%]'>
          그렇지 않다
        </span>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';
import { RECOMMENDATION_MAJOR_MOBILE_ROWS } from '@/features/recommendation/constants';
import type { RecommendationMajorOption } from '@/features/recommendation/types';
import { useRecommendationMajors } from '@/features/recommendation/hooks/useRecommendationMajors';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { RecommendationMobileProgressBar } from '@/features/recommendation/components/mobile/RecommendationMobileProgressBar';
import { RecommendationMobileStepFooter } from '@/features/recommendation/components/mobile/RecommendationMobileStepFooter';

function RecommendationMajorChipItem({
  major,
  selected,
  onSelect,
}: {
  major: RecommendationMajorOption;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type='button'
      aria-pressed={selected}
      onClick={() => onSelect(major.id)}
      className={cn(
        'typo-b2 box-border shrink-0 rounded-[8px] border-[1.5px] bg-white px-[0.75rem] py-[0.375rem] font-normal whitespace-nowrap text-gray9',
        selected
          ? 'border-main bg-sub1 font-semibold text-main'
          : 'border-gray4',
      )}
    >
      <span className='relative inline-flex'>
        <span className='invisible font-semibold' aria-hidden>
          {major.label}
        </span>
        <span className='absolute inset-0'>{major.label}</span>
      </span>
    </button>
  );
}

export function RecommendationMajorStepMobile() {
  const router = useRouter();
  const { majors } = useRecommendationMajors();
  const selected = useRecommendationTestStore((s) => s.majorId);
  const setMajorId = useRecommendationTestStore((s) => s.setMajorId);

  const majorById = useMemo(
    () => new Map(majors.map((major) => [major.id, major])),
    [majors],
  );

  return (
    <div className='min-h-[calc(100dvh-52px)] bg-white pb-[2rem]'>
      <div className='px-[1rem]'>
        <div className='pt-[0.75rem]'>
          <RecommendationMobileProgressBar currentStep={1} />
        </div>

        <h2 className='typo-h4 mt-[1.5rem] text-gray9'>전공이 무엇인가요?</h2>

        <div className='mt-[0.25rem] flex max-w-[17.375rem] flex-col gap-[1.5rem]'>
          <p className='typo-c2 text-gray6'>
            선택한 전공을 직무 찾기에 반영해요.
            <br />
            일부 전공은 찾기 대상 직무가 한정될 수 있어요.
          </p>

          <div
            className='flex flex-col items-start gap-y-[0.75rem]'
            role='group'
            aria-label='전공 선택'
          >
            {RECOMMENDATION_MAJOR_MOBILE_ROWS.map((row) => (
              <div
                key={row.join('-')}
                className='flex flex-nowrap items-start gap-[0.625rem]'
              >
                {row.map((majorId) => {
                  const major = majorById.get(majorId);
                  if (!major) return null;

                  return (
                    <RecommendationMajorChipItem
                      key={major.id}
                      major={major}
                      selected={selected === major.id}
                      onSelect={setMajorId}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-[2rem]'>
        <RecommendationMobileStepFooter
          disabled={!selected}
          onClick={() => router.push('/recommendation/interest')}
        />
      </div>
    </div>
  );
}

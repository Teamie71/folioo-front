'use client';

import { useRouter } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { cn } from '@/utils/utils';
import { RECOMMENDATION_WHITE_BUTTON_HOVER } from '@/features/recommendation/constants';
import { useRecommendationMajors } from '@/features/recommendation/hooks/useRecommendationMajors';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { RecommendationNextButton } from '@/features/recommendation/components/RecommendationNextButton';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';

export function RecommendationMajorStep() {
  const router = useRouter();
  const { majors } = useRecommendationMajors();
  const selected = useRecommendationTestStore((s) => s.majorId);
  const setMajorId = useRecommendationTestStore((s) => s.setMajorId);

  return (
    <div className='min-h-[100dvh] bg-white'>
      <div className='mx-auto w-[66rem] pt-[1.75rem]'>
        <RecommendationTestHeader currentStep={1} />

        <div className='mt-[5rem] px-[1rem]'>
          <div className='flex flex-col gap-[0.25rem]'>
            <h2 className='typo-h4 text-gray9'>전공이 무엇인가요?</h2>
            <p className='typo-c2 text-gray6'>
              선택한 전공을 직무 찾기에 반영해요.
              <br />
              일부 전공은 찾기 대상 직무가 한정될 수 있어요.
            </p>
          </div>

          <ToggleGroup
            type='single'
            value={selected}
            onValueChange={(value) => setMajorId(value ?? '')}
            className='mt-[1.5rem] flex max-w-[26.8125rem] flex-wrap items-start justify-start gap-x-[0.625rem] gap-y-[0.75rem]'
          >
            {majors.map((major) => (
              <ToggleGroupItem
                key={major.id}
                value={major.id}
                className={cn(
                  'typo-b2 box-border h-auto min-h-0 min-w-0 rounded-[8px] border-[1.5px] border-gray4 bg-white px-[0.75rem] py-[0.375rem] font-normal text-gray9 shadow-none hover:text-gray9',
                  RECOMMENDATION_WHITE_BUTTON_HOVER,
                  'data-[state=on]:border-main data-[state=on]:bg-sub1 data-[state=on]:font-semibold data-[state=on]:text-main',
                )}
              >
                <span className='relative inline-flex'>
                  <span
                    className='invisible font-semibold whitespace-nowrap'
                    aria-hidden
                  >
                    {major.label}
                  </span>
                  <span className='absolute inset-0 whitespace-nowrap'>
                    {major.label}
                  </span>
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className='mt-[3.75rem]'>
            <RecommendationNextButton
              disabled={!selected}
              onClick={() => router.push('/recommendation/interest')}
            >
              다음 단계
            </RecommendationNextButton>
          </div>
        </div>
      </div>
    </div>
  );
}

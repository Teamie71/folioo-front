'use client';

import { RecommendationInfoIcon } from '@/components/icons/RecommendationInfoIcon';
import { RecommendationHollandRadar } from '@/features/recommendation/components/RecommendationHollandRadar';
import { RecommendationHollandTypeCards } from '@/features/recommendation/components/RecommendationHollandTypeCard';
import type {
  HollandScores,
  HollandTypeResult,
} from '@/features/recommendation/types';
import { RECOMMENDATION_SUB_BUTTON_CLASS } from '@/features/recommendation/constants';
import { cn } from '@/utils/utils';

interface RecommendationHollandInterestSectionProps {
  scores: HollandScores;
  types: HollandTypeResult[];
  onOpenTypesModal: () => void;
  variant?: 'web' | 'mobile';
}

export function RecommendationHollandInterestSection({
  scores,
  types,
  onOpenTypesModal,
  variant = 'web',
}: RecommendationHollandInterestSectionProps) {
  const isMobile = variant === 'mobile';
  const multiType = types.length >= 2;

  if (isMobile) {
    return (
      <section className='mt-[0.75rem]'>
        <h3 className='typo-c1-b text-main'>흥미 유형</h3>

        <div className='mt-[1rem] flex w-full flex-col items-stretch'>
          <div className='flex justify-center'>
            <RecommendationHollandRadar scores={scores} />
          </div>

          <div className='mt-[1rem] flex w-full justify-end'>
            <HollandTypesInfoButton onClick={onOpenTypesModal} />
          </div>

          <div className='mt-[1rem] w-full'>
            <RecommendationHollandTypeCards types={types} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='mt-[1.375rem]'>
      <h3 className='typo-c1-b text-main'>흥미 유형</h3>
      <div
        className={cn(
          'mt-[1rem] flex justify-between',
          multiType ? 'items-center' : 'items-start',
        )}
      >
        <RecommendationHollandRadar scores={scores} />
        <div className='flex w-[20.5rem] flex-col items-end'>
          <HollandTypesInfoButton onClick={onOpenTypesModal} />
          <div className='mt-[1rem] w-full'>
            <RecommendationHollandTypeCards types={types} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HollandTypesInfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-[0.25rem] rounded-[8px] border border-gray3 px-[0.5rem] py-[0.25rem]',
        RECOMMENDATION_SUB_BUTTON_CLASS,
      )}
    >
      <RecommendationInfoIcon />
      <span className='typo-c2 text-gray9'>전체 유형별 특성 보기</span>
    </button>
  );
}

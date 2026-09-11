'use client';

import { useValueBalanceGame } from '@/features/recommendation/hooks/useValueBalanceGame';
import type { ValueChoice } from '@/features/recommendation/types';
import { RecommendationBalanceCard } from '@/features/recommendation/components/RecommendationBalanceCard';
import { RecommendationPrevButton } from '@/features/recommendation/components/RecommendationPrevButton';
import { RecommendationMobileProgressBar } from '@/features/recommendation/components/mobile/RecommendationMobileProgressBar';

export function RecommendationValuesStepMobile() {
  const {
    question,
    selected,
    isFirstQuestion,
    isLoading,
    isSubmitting,
    error,
    select,
    goBack,
    retry,
  } = useValueBalanceGame();

  const handleSelect = (choice: ValueChoice) => {
    if (isSubmitting) return;
    void select(choice);
  };

  if (isLoading || !question) {
    if (error && !isLoading) {
      return (
        <div className='min-h-[calc(100dvh-52px)] bg-white pb-[2rem]'>
          <div className='px-[1rem] pt-[0.75rem]'>
            <RecommendationMobileProgressBar currentStep={3} />
            <div className='mt-[1.5rem] flex flex-col gap-[0.75rem]'>
              <p className='typo-b2 text-gray9'>{error}</p>
              <button
                type='button'
                onClick={() => void retry()}
                className='typo-b2 w-fit text-main underline'
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className='min-h-[calc(100dvh-52px)] bg-white pb-[2rem]'>
      <div className='px-[1rem] pt-[0.75rem]'>
        <RecommendationMobileProgressBar currentStep={3} />

        <div className='mt-[1.5rem] flex flex-col items-center gap-[1.75rem]'>
          <div className='flex w-full flex-col gap-[0.25rem]'>
            <h2 className='typo-c1-b text-gray9'>
              어떤 근무 조건을 중요하게 생각하나요?
            </h2>
            <p className='typo-c2 text-gray6'>
              밸런스게임으로 파악한 가치관을 기업 형태 추천에 반영해요.
            </p>
          </div>

          <p className='text-[4.25rem] leading-none' aria-hidden>
            🤔
          </p>
        </div>

        {error ? (
          <p className='typo-c2 mt-[1rem] text-red-500'>{error}</p>
        ) : null}

        <div className='mt-[1.75rem] flex w-full flex-col gap-[1.125rem]'>
          <RecommendationBalanceCard
            variant='mobile'
            text={question.left.card}
            selected={selected === 'left'}
            disabled={isSubmitting}
            onClick={() => handleSelect('left')}
          />
          <RecommendationBalanceCard
            variant='mobile'
            text={question.right.card}
            selected={selected === 'right'}
            disabled={isSubmitting}
            onClick={() => handleSelect('right')}
          />
        </div>
      </div>

      {!isFirstQuestion && (
        <div className='mt-[2rem] px-[1rem]'>
          <RecommendationPrevButton onClick={goBack} />
        </div>
      )}
    </div>
  );
}

'use client';

import { useValueBalanceGame } from '@/features/recommendation/hooks/useValueBalanceGame';
import type { ValueChoice } from '@/features/recommendation/types';
import { RecommendationBalanceCard } from '@/features/recommendation/components/RecommendationBalanceCard';
import { RecommendationPrevButton } from '@/features/recommendation/components/RecommendationPrevButton';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';

export function RecommendationValuesStep() {
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
        <div className='min-h-[100dvh] bg-white'>
          <div className='mx-auto w-[66rem] pt-[1.75rem]'>
            <RecommendationTestHeader currentStep={3} />
            <div className='mt-[5rem] flex flex-col gap-[1rem] px-[1rem]'>
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
    <div className='min-h-[100dvh] bg-white'>
      <div className='mx-auto w-[66rem] pt-[1.75rem]'>
        <RecommendationTestHeader currentStep={3} />

        <div className='mt-[5rem] px-[1rem]'>
          <div className='flex flex-col gap-[0.25rem]'>
            <h2 className='typo-h4 text-gray9'>
              어떤 근무 조건을 중요하게 생각하나요?
            </h2>
            <p className='typo-c2 text-gray6'>
              밸런스게임으로 파악한 가치관을 기업 형태 추천에 반영해요.
            </p>
          </div>

          <p
            className='mt-[1.75rem] text-[4.25rem] leading-none'
            aria-hidden
          >
            🤔
          </p>

          {error ? (
            <p className='typo-c2 mt-[1rem] text-red-500'>{error}</p>
          ) : null}

          <div className='relative mt-[1.75rem] flex items-center gap-[3.75rem]'>
            <RecommendationBalanceCard
              text={question.left.card}
              selected={selected === 'left'}
              disabled={isSubmitting}
              onClick={() => handleSelect('left')}
            />
            <span className='typo-h5 absolute left-1/2 -translate-x-1/2 text-gray9'>
              vs
            </span>
            <RecommendationBalanceCard
              text={question.right.card}
              selected={selected === 'right'}
              disabled={isSubmitting}
              onClick={() => handleSelect('right')}
            />
          </div>

          {!isFirstQuestion && (
            <div className='mt-[1.75rem]'>
              <RecommendationPrevButton onClick={goBack} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

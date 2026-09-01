'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useValueQuestions } from '@/features/recommendation/hooks/useValueQuestions';
import type { ValueChoice } from '@/features/recommendation/types';
import { RecommendationBalanceCard } from '@/features/recommendation/components/RecommendationBalanceCard';
import { RecommendationPrevButton } from '@/features/recommendation/components/RecommendationPrevButton';
import { RecommendationMobileProgressBar } from '@/features/recommendation/components/mobile/RecommendationMobileProgressBar';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

const SELECT_ADVANCE_MS = 200;

export function RecommendationValuesStepMobile() {
  const router = useRouter();
  const { questions } = useValueQuestions();
  const questionIndex = useRecommendationTestStore((s) => s.valueQuestionIndex);
  const answers = useRecommendationTestStore((s) => s.valueAnswers);
  const setValueAnswer = useRecommendationTestStore((s) => s.setValueAnswer);
  const clearValueAnswers = useRecommendationTestStore(
    (s) => s.clearValueAnswers,
  );
  const setValueQuestionIndex = useRecommendationTestStore(
    (s) => s.setValueQuestionIndex,
  );
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[questionIndex];
  const selected = question ? answers[question.id] : undefined;
  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === questions.length - 1;

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current == null) return;
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  };

  useEffect(() => () => clearAdvanceTimer(), []);

  const handleSelect = (choice: ValueChoice) => {
    if (!question || advanceTimerRef.current != null) return;

    setValueAnswer(question.id, choice);

    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      if (isLastQuestion) {
        router.push('/recommendation/waiting');
        return;
      }
      setValueQuestionIndex(questionIndex + 1);
    }, SELECT_ADVANCE_MS);
  };

  const handlePrev = () => {
    if (isFirstQuestion) return;

    clearAdvanceTimer();

    const current = questions[questionIndex];
    const previous = questions[questionIndex - 1];
    const idsToClear = [current?.id, previous?.id].filter(
      (id): id is string => Boolean(id),
    );
    clearValueAnswers(idsToClear);
    setValueQuestionIndex(questionIndex - 1);
  };

  if (!question) return null;

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

        <div className='mt-[1.75rem] flex w-full flex-col gap-[1.125rem]'>
          <RecommendationBalanceCard
            variant='mobile'
            text={question.left}
            selected={selected === 'left'}
            onClick={() => handleSelect('left')}
          />
          <RecommendationBalanceCard
            variant='mobile'
            text={question.right}
            selected={selected === 'right'}
            onClick={() => handleSelect('right')}
          />
        </div>
      </div>

      {!isFirstQuestion && (
        <div className='mt-[2rem] px-[1rem]'>
          <RecommendationPrevButton onClick={handlePrev} />
        </div>
      )}
    </div>
  );
}

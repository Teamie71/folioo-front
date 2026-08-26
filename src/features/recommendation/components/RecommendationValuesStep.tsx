'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useValueQuestions } from '@/features/recommendation/hooks/useValueQuestions';
import type { ValueChoice } from '@/features/recommendation/types';
import { RecommendationPrevButton } from '@/features/recommendation/components/RecommendationPrevButton';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

const SELECT_ADVANCE_MS = 200;

export function RecommendationValuesStep() {
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
    <div className='min-h-[100dvh] bg-white'>
      <div className='mx-auto w-[66rem] pt-[1.75rem]'>
        <RecommendationTestHeader currentStep={3} />

        <div className='mt-[5rem] px-[1rem]'>
          <div className='flex flex-col gap-[0.25rem]'>
            <h2 className='typo-h4 text-gray9'>
              어떤 근무 조건을 중요하게 생각하나요?
            </h2>
            <p className='typo-c2 text-gray6'>
              밸런스게임으로 파악한 가치관을 기업 형태 찾기에 반영해요.
            </p>
          </div>

          <p
            className='mt-[1.75rem] text-[4.25rem] leading-none'
            aria-hidden
          >
            🤔
          </p>

          <div className='relative mt-[1.75rem] flex items-center gap-[3.75rem]'>
            <BalanceCard
              text={question.left}
              selected={selected === 'left'}
              onClick={() => handleSelect('left')}
            />
            <span className='typo-h5 absolute left-1/2 -translate-x-1/2 text-gray9'>
              vs
            </span>
            <BalanceCard
              text={question.right}
              selected={selected === 'right'}
              onClick={() => handleSelect('right')}
            />
          </div>

          {!isFirstQuestion && (
            <div className='mt-[1.75rem]'>
              <RecommendationPrevButton onClick={handlePrev} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BalanceCard({
  text,
  selected,
  onClick,
}: {
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selected}
      className='typo-b2 box-border flex min-h-[8.125rem] w-[30.125rem] max-w-[30.125rem] cursor-pointer items-center rounded-[16px] border border-solid border-gray4 bg-gray1 px-[1.25rem] py-[2.5rem] text-left whitespace-pre-line text-gray9 transition-opacity active:opacity-70'
    >
      {text}
    </button>
  );
}

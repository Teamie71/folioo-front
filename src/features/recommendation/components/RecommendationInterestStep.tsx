'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';
import { useInterestQuestions } from '@/features/recommendation/hooks/useInterestQuestions';
import { RecommendationInterestQuestion } from '@/features/recommendation/components/RecommendationInterestQuestion';
import { RecommendationNextButton } from '@/features/recommendation/components/RecommendationNextButton';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import type { InterestLikertValue } from '@/features/recommendation/constants';

const CIRCLE_CUT_BELOW_CENTER_PX = 7;

export function RecommendationInterestStep() {
  const router = useRouter();
  const { questions } = useInterestQuestions();
  const answers = useRecommendationTestStore((s) => s.interestAnswers);
  const setInterestAnswer = useRecommendationTestStore(
    (s) => s.setInterestAnswer,
  );
  const shouldScrollRef = useRef(false);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);

  const firstUnansweredIndex = questions.findIndex(
    (question) => answers[question.id] == null,
  );
  const allAnswered =
    questions.length > 0 && firstUnansweredIndex === -1;

  useEffect(() => {
    if (!shouldScrollRef.current) return;
    shouldScrollRef.current = false;

    const targetIndex = questions.findIndex(
      (question) => answers[question.id] == null,
    );
    if (targetIndex < 0) return;

    const target = questionRefs.current[targetIndex];
    if (!target) return;

    const headerHeight =
      stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
    const prevQuestion = questionRefs.current[targetIndex - 1];
    const circleRow = prevQuestion?.querySelector('[data-likert-circles]');

    if (!circleRow) {
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return;
    }

    const circleRect = circleRow.getBoundingClientRect();
    const cutY =
      circleRect.top + circleRect.height / 2 + CIRCLE_CUT_BELOW_CENTER_PX;
    window.scrollBy({ top: cutY - headerHeight, behavior: 'smooth' });
  }, [answers, questions]);

  const handleChange = (questionId: string, value: InterestLikertValue) => {
    shouldScrollRef.current = true;
    setInterestAnswer(questionId, value);
  };

  return (
    <div className='min-h-[100dvh] bg-white pb-[4rem]'>
      <div className='mx-auto w-[66rem]'>
        <div
          ref={stickyHeaderRef}
          className='sticky top-0 z-10 bg-white pt-[1.75rem] pb-[1rem]'
        >
          <RecommendationTestHeader currentStep={2} />
        </div>

        <div className='px-[1rem]'>
          <div className='flex flex-col gap-[0.25rem]'>
            <h2 className='typo-h4 text-gray9'>어떤 일에 흥미를 느끼나요?</h2>
            <p className='typo-c2 text-gray6'>
              Holland 흥미 이론에 따라 파악한 유형을 직무 찾기에 반영해요.
            </p>
          </div>
        </div>

        <div className='mt-[1.5rem]'>
          {questions.map((question, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={question.id}
                ref={(node) => {
                  questionRefs.current[index] = node;
                }}
                className={cn(
                  'px-[1rem] py-[0.875rem]',
                  isEven && 'bg-gray2',
                )}
              >
                <RecommendationInterestQuestion
                  index={index}
                  question={question.text}
                  value={answers[question.id]}
                  onChange={(value) => handleChange(question.id, value)}
                />
              </div>
            );
          })}
        </div>

        <div className='mt-[2rem] flex justify-end px-[1rem]'>
          <RecommendationNextButton
            disabled={!allAnswered}
            onClick={() => router.push('/recommendation/values')}
          >
            다음 단계
          </RecommendationNextButton>
        </div>
      </div>
    </div>
  );
}

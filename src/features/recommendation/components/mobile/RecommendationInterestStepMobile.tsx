'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';
import { useInterestQuestions } from '@/features/recommendation/hooks/useInterestQuestions';
import { useInterestStepPreview } from '@/features/recommendation/hooks/useInterestStepPreview';
import { RecommendationInterestQuestionMobile } from '@/features/recommendation/components/mobile/RecommendationInterestQuestionMobile';
import { RecommendationMobileProgressBar } from '@/features/recommendation/components/mobile/RecommendationMobileProgressBar';
import { RecommendationMobileStepFooter } from '@/features/recommendation/components/mobile/RecommendationMobileStepFooter';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import type { InterestLikertValue } from '@/features/recommendation/constants';

const AUTO_SCROLL_TOP_OFFSET_PX = 266;

export function RecommendationInterestStepMobile() {
  const router = useRouter();
  const { questions } = useInterestQuestions();
  const answers = useRecommendationTestStore((s) => s.interestAnswers);
  const setInterestAnswer = useRecommendationTestStore(
    (s) => s.setInterestAnswer,
  );
  const shouldScrollRef = useRef(false);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewQuestion = useInterestStepPreview();
  const previewScrolledRef = useRef(false);

  const allAnswered =
    questions.length > 0 &&
    questions.every((question) => answers[question.id] != null);

  useEffect(() => {
    if (!shouldScrollRef.current) return;
    shouldScrollRef.current = false;

    const targetIndex = questions.findIndex(
      (question) => answers[question.id] == null,
    );
    if (targetIndex < 0) return;

    const target = questionRefs.current[targetIndex];
    if (!target) return;

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      AUTO_SCROLL_TOP_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [answers, questions]);

  useEffect(() => {
    if (!previewQuestion || previewScrolledRef.current) return;

    const targetIndex = previewQuestion - 1;
    const target = questionRefs.current[targetIndex];
    if (!target) return;

    const firstPreviewId = questions[targetIndex - 1]?.id;
    if (!firstPreviewId || answers[firstPreviewId] == null) return;

    previewScrolledRef.current = true;
    requestAnimationFrame(() => {
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        AUTO_SCROLL_TOP_OFFSET_PX;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    });
  }, [answers, previewQuestion, questions]);

  const handleChange = (questionId: string, value: InterestLikertValue) => {
    shouldScrollRef.current = true;
    setInterestAnswer(questionId, value);
  };

  return (
    <div className='min-h-[calc(100dvh-52px)] bg-white pb-[2rem]'>
      <div className='px-[1rem]'>
        <div className='pt-[0.75rem]'>
          <RecommendationMobileProgressBar currentStep={2} />
        </div>

        <div className='mt-[1.5rem] flex flex-col gap-[1.5rem]'>
          <div className='flex flex-col gap-[0.25rem]'>
            <h2 className='typo-h4 text-gray9'>어떤 일에 흥미를 느끼나요?</h2>
            <p className='typo-c2 text-gray6'>
              Holland 흥미 이론에 따라 파악한 유형을 직무 찾기에 반영해요.
            </p>
          </div>

          <div className='flex flex-col'>
            {questions.map((question, index) => {
              const number = index + 1;

              return (
                <div
                  key={question.id}
                  ref={(node) => {
                    questionRefs.current[index] = node;
                  }}
                  className={cn(
                    '-mx-[1rem] px-[1rem] py-[0.875rem]',
                    index % 2 === 1 && 'bg-gray2',
                  )}
                >
                  <RecommendationInterestQuestionMobile
                    number={number}
                    text={question.text}
                    name={`흥미 문항 ${number}`}
                    value={answers[question.id]}
                    onChange={(value) => handleChange(question.id, value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-[2rem]'>
        <RecommendationMobileStepFooter
          disabled={!allAnswered}
          onClick={() => router.push('/recommendation/values')}
        />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { InterestLikertValue } from '@/features/recommendation/constants';
import { useInterestQuestions } from '@/features/recommendation/hooks/useInterestQuestions';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

const PREVIEW_ANSWER: InterestLikertValue = 3;

export function useInterestStepPreview(): number | null {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q');
  const targetQuestion = qParam ? Number.parseInt(qParam, 10) : NaN;
  const { questions } = useInterestQuestions();
  const setInterestAnswer = useRecommendationTestStore(
    (s) => s.setInterestAnswer,
  );
  const seededRef = useRef(false);

  useEffect(() => {
    if (
      !Number.isFinite(targetQuestion) ||
      targetQuestion < 2 ||
      seededRef.current ||
      questions.length === 0
    ) {
      return;
    }

    seededRef.current = true;
    const fillCount = Math.min(targetQuestion - 1, questions.length);

    for (let i = 0; i < fillCount; i++) {
      setInterestAnswer(questions[i].id, PREVIEW_ANSWER);
    }
  }, [questions, setInterestAnswer, targetQuestion]);

  if (!Number.isFinite(targetQuestion) || targetQuestion < 2) {
    return null;
  }

  return targetQuestion;
}

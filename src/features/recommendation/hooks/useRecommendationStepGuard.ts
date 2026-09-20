'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InterestLikertValue } from '@/features/recommendation/constants';
import { INTEREST_QUESTIONS } from '@/features/recommendation/data/staticContent';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export type RecommendationTestStep = 'interest' | 'values';

function hasCompletedInterest(
  interestAnswers: Record<string, InterestLikertValue>,
): boolean {
  return INTEREST_QUESTIONS.every(
    (question) => interestAnswers[question.id] != null,
  );
}

export function useRecommendationStepGuard(step: RecommendationTestStep) {
  const router = useRouter();
  const hasHydrated = useRecommendationTestStore((s) => s.hasHydrated);
  const majorId = useRecommendationTestStore((s) => s.majorId);
  const interestAnswers = useRecommendationTestStore((s) => s.interestAnswers);

  const majorDone = majorId.trim().length > 0;
  const interestDone = hasCompletedInterest(interestAnswers);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!majorDone) {
      router.replace('/recommendation/major');
      return;
    }

    if (step === 'values' && !interestDone) {
      router.replace('/recommendation/interest');
    }
  }, [hasHydrated, interestDone, majorDone, router, step]);

  if (!hasHydrated) return false;
  if (!majorDone) return false;
  if (step === 'values' && !interestDone) return false;
  return true;
}

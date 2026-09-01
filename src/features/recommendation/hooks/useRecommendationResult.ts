'use client';

import { useQuery } from '@tanstack/react-query';
import { RECOMMENDATION_QUERY_KEYS } from '@/features/recommendation/constants';
import { MOCK_RECOMMENDATION_RESULT } from '@/features/recommendation/mock';
import type { RecommendationResultData } from '@/features/recommendation/types';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export function useRecommendationResult(
  scope: 'mine' | 'share' = 'mine',
): {
  result: RecommendationResultData;
  isLoading: boolean;
} {
  const majorId = useRecommendationTestStore((s) => s.majorId);
  const interestAnswers = useRecommendationTestStore((s) => s.interestAnswers);
  const valueAnswers = useRecommendationTestStore((s) => s.valueAnswers);

  const queryKey =
    scope === 'share'
      ? RECOMMENDATION_QUERY_KEYS.sharedResult
      : [
          ...RECOMMENDATION_QUERY_KEYS.result,
          majorId,
          interestAnswers,
          valueAnswers,
        ];

  const { data, isPending } = useQuery({
    queryKey,
    queryFn: async () => MOCK_RECOMMENDATION_RESULT,
  });

  return {
    result: data ?? MOCK_RECOMMENDATION_RESULT,
    isLoading: isPending,
  };
}

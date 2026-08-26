'use client';

import { useQuery } from '@tanstack/react-query';
import { RECOMMENDATION_QUERY_KEYS } from '@/features/recommendation/constants';
import { MOCK_RECOMMENDATION_MAJORS } from '@/features/recommendation/mock';
import type { RecommendationMajorOption } from '@/features/recommendation/types';

export function useRecommendationMajors(): {
  majors: RecommendationMajorOption[];
  isLoading: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.majors,
    queryFn: async () => MOCK_RECOMMENDATION_MAJORS,
  });

  return {
    majors: data ?? [],
    isLoading: isPending,
  };
}

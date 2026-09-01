'use client';

import { useQuery } from '@tanstack/react-query';
import { RECOMMENDATION_QUERY_KEYS } from '@/features/recommendation/constants';
import { MOCK_INTEREST_QUESTIONS } from '@/features/recommendation/mock';
import type { InterestQuestion } from '@/features/recommendation/types';

export function useInterestQuestions(): {
  questions: InterestQuestion[];
  isLoading: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.interestQuestions,
    queryFn: async () => MOCK_INTEREST_QUESTIONS,
  });

  return {
    questions: data ?? [],
    isLoading: isPending,
  };
}

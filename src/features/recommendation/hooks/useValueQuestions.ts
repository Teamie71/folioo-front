'use client';

import { useQuery } from '@tanstack/react-query';
import { RECOMMENDATION_QUERY_KEYS } from '@/features/recommendation/constants';
import { MOCK_VALUE_QUESTIONS } from '@/features/recommendation/mock';
import type { ValueQuestion } from '@/features/recommendation/types';

export function useValueQuestions(): {
  questions: ValueQuestion[];
  isLoading: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.valueQuestions,
    queryFn: async () => MOCK_VALUE_QUESTIONS,
  });

  return {
    questions: data ?? [],
    isLoading: isPending,
  };
}

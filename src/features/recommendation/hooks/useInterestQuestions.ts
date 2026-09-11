import { INTEREST_QUESTIONS } from '@/features/recommendation/data/staticContent';
import type { InterestQuestion } from '@/features/recommendation/types';

export function useInterestQuestions(): {
  questions: InterestQuestion[];
} {
  return { questions: INTEREST_QUESTIONS };
}

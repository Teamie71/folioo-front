import { RECOMMENDATION_MAJORS } from '@/features/recommendation/data/staticContent';
import type { RecommendationMajorOption } from '@/features/recommendation/types';

export function useRecommendationMajors(): {
  majors: RecommendationMajorOption[];
} {
  return { majors: RECOMMENDATION_MAJORS };
}

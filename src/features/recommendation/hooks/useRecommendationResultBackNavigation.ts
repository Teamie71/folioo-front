'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RECOMMENDATION_MAIN_PATH } from '@/features/recommendation/hooks/useRecommendationEntryRedirect';
import { markRecommendationRetake } from '@/features/recommendation/lib/recommendationRetake';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export function useRecommendationResultBackNavigation(enabled: boolean) {
  const router = useRouter();
  const resetTest = useRecommendationTestStore((s) => s.reset);
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.history.pushState({ recommendationResultBackGuard: true }, '');

    const onPopState = () => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      resetTest();
      markRecommendationRetake();
      router.replace(RECOMMENDATION_MAIN_PATH);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [enabled, resetTest, router]);
}

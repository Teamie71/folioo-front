'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

const LANDING_PATH = '/recommendation';

export function useRecommendationResultBackNavigation(enabled: boolean) {
  const router = useRouter();
  const resetTest = useRecommendationTestStore((s) => s.reset);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.history.pushState({ recommendationResultBackGuard: true }, '');

    const onPopState = () => {
      resetTest();
      router.replace(LANDING_PATH);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [enabled, resetTest, router]);
}

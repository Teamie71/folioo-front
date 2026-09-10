'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RECOMMENDATION_MAIN_RETAKE_HREF } from '@/features/recommendation/hooks/useRecommendationEntryRedirect';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

/**
 * 결과 페이지에서 브라우저/제스처 뒤로가기 시
 * 테스트 중간 단계가 아니라 직무찾기 랜딩으로 보낸다.
 * retake=1 로 보내 저장된 결과가 있어도 메인에 머물게 한다.
 */
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
      router.replace(RECOMMENDATION_MAIN_RETAKE_HREF);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [enabled, resetTest, router]);
}

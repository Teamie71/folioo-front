'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAssessmentControllerGetStatus } from '@/api/endpoints/assessment/assessment';
import { useAuthStore } from '@/store/useAuthStore';

export const RECOMMENDATION_RETAKE_PARAM = 'retake';
export const RECOMMENDATION_MAIN_PATH = '/recommendation';
export const RECOMMENDATION_MAIN_RETAKE_HREF = `${RECOMMENDATION_MAIN_PATH}?${RECOMMENDATION_RETAKE_PARAM}=1`;

/**
 * /recommendation 진입 시:
 * - 로그인 + 저장된 결과 있음 → 결과 페이지
 * - 비로그인 / 결과 없음 / retake=1 → 메인 유지
 */
export function useRecommendationEntryRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  const isRetake = searchParams.get(RECOMMENDATION_RETAKE_PARAM) === '1';
  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const shouldCheckStatus = sessionRestoreAttempted && isLoggedIn && !isRetake;

  const statusQuery = useAssessmentControllerGetStatus({
    query: {
      enabled: shouldCheckStatus,
      staleTime: 30_000,
    },
  });

  const rawUuid = statusQuery.data?.result?.uuid as unknown;
  const completedUuid =
    shouldCheckStatus &&
    statusQuery.data?.isSuccess !== false &&
    statusQuery.data?.result?.hasCompleted &&
    typeof rawUuid === 'string' &&
    rawUuid.trim() !== ''
      ? rawUuid.trim()
      : null;

  useEffect(() => {
    if (isRetake || !completedUuid) return;
    router.replace(
      `/recommendation/result?uuid=${encodeURIComponent(completedUuid)}`,
    );
  }, [completedUuid, isRetake, router]);

  const isCheckingEntry =
    !sessionRestoreAttempted ||
    (shouldCheckStatus && statusQuery.isPending) ||
    Boolean(completedUuid);

  return { isCheckingEntry };
}

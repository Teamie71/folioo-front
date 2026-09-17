'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAssessmentControllerGetStatus } from '@/api/endpoints/assessment/assessment';
import {
  isRecommendationRetakeActive,
  markRecommendationRetake,
} from '@/features/recommendation/lib/recommendationRetake';
import { useAuthStore } from '@/store/useAuthStore';

export const RECOMMENDATION_RETAKE_PARAM = 'retake';
export const RECOMMENDATION_MAIN_PATH = '/recommendation';
export const RECOMMENDATION_MAIN_RETAKE_HREF = RECOMMENDATION_MAIN_PATH;

export function useRecommendationEntryRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const [isRetake, setIsRetake] = useState(false);
  const [retakeReady, setRetakeReady] = useState(false);

  useEffect(() => {
    const hasRetakeQuery =
      searchParams.get(RECOMMENDATION_RETAKE_PARAM) === '1';
    if (hasRetakeQuery) {
      markRecommendationRetake();
      router.replace(RECOMMENDATION_MAIN_PATH);
    }
    setIsRetake(isRecommendationRetakeActive() || hasRetakeQuery);
    setRetakeReady(true);
  }, [router, searchParams]);

  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const shouldCheckStatus =
    sessionRestoreAttempted && isLoggedIn && retakeReady && !isRetake;

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
    !retakeReady ||
    (shouldCheckStatus && statusQuery.isPending) ||
    Boolean(completedUuid);

  return { isCheckingEntry };
}

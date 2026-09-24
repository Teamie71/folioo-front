'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAssessmentControllerGetStatus } from '@/api/endpoints/assessment/assessment';
import {
  clearRecommendationPostAuthUuid,
  readRecommendationPostAuthUuid,
} from '@/features/recommendation/lib/recommendationPostAuth';
import {
  isRecommendationResultUuidInvalidated,
  isRecommendationRetakeActive,
  markRecommendationRetake,
} from '@/features/recommendation/lib/recommendationRetake';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
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
  const hasHydrated = useRecommendationTestStore((s) => s.hasHydrated);
  const setAssessmentUuid = useRecommendationTestStore(
    (s) => s.setAssessmentUuid,
  );
  const [isRetake, setIsRetake] = useState(false);
  const [retakeReady, setRetakeReady] = useState(false);

  useEffect(() => {
    const hasRetakeQuery =
      searchParams.get(RECOMMENDATION_RETAKE_PARAM) === '1';
    if (hasRetakeQuery) {
      markRecommendationRetake();
      clearRecommendationPostAuthUuid();
      router.replace(RECOMMENDATION_MAIN_PATH);
    }
    setIsRetake(isRecommendationRetakeActive() || hasRetakeQuery);
    setRetakeReady(true);
  }, [router, searchParams]);

  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const shouldCheckStatus =
    sessionRestoreAttempted &&
    hasHydrated &&
    isLoggedIn &&
    retakeReady &&
    !isRetake;

  const statusQuery = useAssessmentControllerGetStatus({
    query: {
      enabled: shouldCheckStatus,
      staleTime: 30_000,
    },
  });

  const rawUuid = statusQuery.data?.result?.uuid as unknown;
  const statusUuid =
    shouldCheckStatus &&
    statusQuery.data?.isSuccess !== false &&
    statusQuery.data?.result?.hasCompleted &&
    typeof rawUuid === 'string' &&
    rawUuid.trim() !== ''
      ? rawUuid.trim()
      : null;

  const postAuthUuid = shouldCheckStatus
    ? readRecommendationPostAuthUuid()
    : '';
  const recoverableUuid = (() => {
    if (!shouldCheckStatus || statusQuery.isPending) return null;
    const candidate = statusUuid || postAuthUuid;
    if (!candidate) return null;
    if (isRecommendationResultUuidInvalidated(candidate)) return null;
    return candidate;
  })();

  useEffect(() => {
    if (isRetake || !recoverableUuid) return;
    setAssessmentUuid(recoverableUuid);
    clearRecommendationPostAuthUuid();
    router.replace(
      `/recommendation/result?uuid=${encodeURIComponent(recoverableUuid)}`,
    );
  }, [isRetake, recoverableUuid, router, setAssessmentUuid]);

  const isCheckingEntry =
    !sessionRestoreAttempted ||
    !hasHydrated ||
    !retakeReady ||
    (shouldCheckStatus && statusQuery.isPending) ||
    Boolean(recoverableUuid);

  return { isCheckingEntry };
}

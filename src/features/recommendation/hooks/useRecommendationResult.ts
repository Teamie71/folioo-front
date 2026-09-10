'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getAssessmentControllerGetResultQueryKey,
  getAssessmentControllerGetStatusQueryKey,
  useAssessmentControllerClaim,
  useAssessmentControllerGetResult,
} from '@/api/endpoints/assessment/assessment';
import { mapAssessmentResult } from '@/features/recommendation/lib/mapAssessmentResult';
import type { RecommendationResultData } from '@/features/recommendation/types';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

export type RecommendationResultView = RecommendationResultData & {
  locked: boolean;
  uuid: string;
};

export function useRecommendationResult(
  scope: 'mine' | 'share' = 'mine',
): {
  result: RecommendationResultView | null;
  uuid: string;
  isLoading: boolean;
  isError: boolean;
} {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const authKey = accessToken ? 'authed' : 'anon';

  const hasHydrated = useRecommendationTestStore((s) => s.hasHydrated);
  const storeUuid = useRecommendationTestStore((s) => s.assessmentUuid);

  const shareUuid =
    searchParams.get('uuid')?.trim() ||
    searchParams.get('token')?.trim() ||
    '';

  // share는 URL uuid만 사용. store fallback이면 다른 세션 결과가 노출될 수 있다.
  const resolvedUuid =
    scope === 'share' ? shareUuid : storeUuid || shareUuid;

  const resultQuery = useAssessmentControllerGetResult(resolvedUuid, {
    query: {
      enabled:
        Boolean(resolvedUuid) && sessionRestoreAttempted && hasHydrated,
      queryKey: [
        ...getAssessmentControllerGetResultQueryKey(resolvedUuid),
        authKey,
      ],
      staleTime: isLoggedIn ? 0 : 5 * 60 * 1000,
    },
  });

  const { mutateAsync: claimAssessment } = useAssessmentControllerClaim();
  const claimAttemptedRef = useRef<string | null>(null);
  const claimedAt = resultQuery.data?.result?.claimedAt;
  const canClaim =
    scope === 'mine' &&
    resultQuery.data?.isSuccess !== false &&
    Boolean(resultQuery.data?.result) &&
    claimedAt == null;

  const refetchResult = resultQuery.refetch;

  useEffect(() => {
    if (!isLoggedIn || !resolvedUuid || !canClaim) return;
    if (claimAttemptedRef.current === resolvedUuid) return;

    claimAttemptedRef.current = resolvedUuid;
    void claimAssessment({ uuid: resolvedUuid })
      .then(() => {
        void queryClient.invalidateQueries({
          queryKey: getAssessmentControllerGetStatusQueryKey(),
        });
        void refetchResult();
      })
      .catch(() => {
        claimAttemptedRef.current = null;
      });
  }, [
    canClaim,
    claimAssessment,
    isLoggedIn,
    queryClient,
    refetchResult,
    resolvedUuid,
  ]);

  const dto =
    resultQuery.data?.isSuccess !== false
      ? resultQuery.data?.result
      : undefined;

  const isLoading =
    !sessionRestoreAttempted ||
    !hasHydrated ||
    (Boolean(resolvedUuid) && resultQuery.isPending);

  const isError =
    (hasHydrated && !resolvedUuid && !isLoading) ||
    (Boolean(resolvedUuid) &&
      (resultQuery.isError || resultQuery.data?.isSuccess === false) &&
      !dto);

  const mapped = dto ? mapAssessmentResult(dto) : null;

  return {
    result: mapped
      ? {
          ...mapped,
          locked: scope === 'share' ? false : !isLoggedIn,
        }
      : null,
    uuid: resolvedUuid,
    isLoading,
    isError,
  };
}

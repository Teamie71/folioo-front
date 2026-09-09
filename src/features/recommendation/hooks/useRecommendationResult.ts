'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getAssessmentControllerGetResultQueryKey,
  useAssessmentControllerClaim,
  useAssessmentControllerGetResult,
} from '@/api/endpoints/assessment/assessment';
import { mapAssessmentResult } from '@/features/recommendation/lib/mapAssessmentResult';
import type { RecommendationResultData } from '@/features/recommendation/types';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useAuthStore } from '@/store/useAuthStore';

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
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const authKey = accessToken ? 'authed' : 'anon';

  const storeUuid = useRecommendationTestStore((s) => s.assessmentUuid);

  const shareUuid =
    searchParams.get('uuid')?.trim() ||
    searchParams.get('token')?.trim() ||
    '';

  const resolvedUuid =
    scope === 'share' ? shareUuid || storeUuid : storeUuid || shareUuid;

  const resultQuery = useAssessmentControllerGetResult(resolvedUuid, {
    query: {
      enabled: Boolean(resolvedUuid) && sessionRestoreAttempted,
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
        void refetchResult();
      })
      .catch(() => {
        claimAttemptedRef.current = null;
      });
  }, [canClaim, claimAssessment, isLoggedIn, refetchResult, resolvedUuid]);

  const dto =
    resultQuery.data?.isSuccess !== false
      ? resultQuery.data?.result
      : undefined;

  const isLoading =
    !sessionRestoreAttempted ||
    (Boolean(resolvedUuid) && resultQuery.isPending);

  const isError =
    (!resolvedUuid && !isLoading) ||
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

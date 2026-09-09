'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateAssessmentReqDTOValueRankingItem } from '@/api/models';
import {
  getAssessmentControllerGetResultQueryKey,
  useAssessmentControllerCreate,
} from '@/api/endpoints/assessment/assessment';
import { toAssessmentMajorField } from '@/features/recommendation/lib/majorField';
import { buildTraitAnswers } from '@/features/recommendation/lib/traitAnswers';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useAuthStore } from '@/store/useAuthStore';

const MIN_WAITING_MS = 2500;

export function useCreateAssessment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useAssessmentControllerCreate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const majorId = useRecommendationTestStore((s) => s.majorId);
  const interestAnswers = useRecommendationTestStore((s) => s.interestAnswers);
  const valueRanking = useRecommendationTestStore((s) => s.valueRanking);
  const assessmentUuid = useRecommendationTestStore((s) => s.assessmentUuid);
  const setAssessmentUuid = useRecommendationTestStore(
    (s) => s.setAssessmentUuid,
  );

  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRunId((id) => id + 1);
  }, []);

  useEffect(() => {
    if (assessmentUuid) {
      router.replace(
        `/recommendation/result?uuid=${encodeURIComponent(assessmentUuid)}`,
      );
      return;
    }

    let cancelled = false;

    const run = async () => {
      if (!valueRanking || valueRanking.length !== 5) {
        router.replace('/recommendation/values');
        return;
      }

      const traitAnswers = buildTraitAnswers(interestAnswers);
      if (traitAnswers.length !== 15) {
        router.replace('/recommendation/interest');
        return;
      }

      const startedAt = Date.now();

      try {
        const response = await mutateAsync({
          data: {
            majorField: toAssessmentMajorField(majorId),
            traitAnswers,
            valueRanking:
              valueRanking as CreateAssessmentReqDTOValueRankingItem[],
          },
        });

        if (cancelled) return;

        if (response?.isSuccess === false || !response?.result?.uuid) {
          throw new Error('분석 결과를 만들지 못했어요. 다시 시도해 주세요.');
        }

        const uuid = response.result.uuid;
        const authKey = accessToken ? 'authed' : 'anon';
        queryClient.setQueryData(
          [...getAssessmentControllerGetResultQueryKey(uuid), authKey],
          response,
        );
        setAssessmentUuid(uuid);

        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_WAITING_MS) {
          await new Promise((resolve) =>
            window.setTimeout(resolve, MIN_WAITING_MS - elapsed),
          );
        }

        if (!cancelled) {
          router.replace(
            `/recommendation/result?uuid=${encodeURIComponent(uuid)}`,
          );
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : '분석 결과를 만들지 못했어요. 다시 시도해 주세요.';
        setError(message);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    assessmentUuid,
    interestAnswers,
    majorId,
    mutateAsync,
    queryClient,
    router,
    runId,
    setAssessmentUuid,
    valueRanking,
  ]);

  return {
    error,
    retry,
  };
}

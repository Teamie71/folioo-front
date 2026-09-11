'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateAssessmentReqDTOValueRankingItem } from '@/api/models';
import {
  getAssessmentControllerGetResultQueryKey,
  getAssessmentControllerGetStatusQueryKey,
  useAssessmentControllerCreate,
} from '@/api/endpoints/assessment/assessment';
import { toAssessmentMajorField } from '@/features/recommendation/lib/majorField';
import { buildTraitAnswers } from '@/features/recommendation/lib/traitAnswers';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useAuthStore } from '@/store/useAuthStore';

const MIN_WAITING_MS = 2500;

let createInFlight: Promise<string> | null = null;

export function useCreateAssessment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useAssessmentControllerCreate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useRecommendationTestStore((s) => s.hasHydrated);
  const majorId = useRecommendationTestStore((s) => s.majorId);
  const interestAnswers = useRecommendationTestStore((s) => s.interestAnswers);
  const valueRanking = useRecommendationTestStore((s) => s.valueRanking);
  const assessmentUuid = useRecommendationTestStore((s) => s.assessmentUuid);
  const setAssessmentUuid = useRecommendationTestStore(
    (s) => s.setAssessmentUuid,
  );

  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const runGenerationRef = useRef(0);

  const retry = useCallback(() => {
    setError(null);
    setRunId((id) => id + 1);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    if (assessmentUuid) {
      router.replace(
        `/recommendation/result?uuid=${encodeURIComponent(assessmentUuid)}`,
      );
      return;
    }

    const generation = ++runGenerationRef.current;
    let cancelled = false;

    const run = async () => {
      if (!valueRanking || valueRanking.length !== 5) {
        if (!cancelled) router.replace('/recommendation/values');
        return;
      }

      const traitAnswers = buildTraitAnswers(interestAnswers);
      if (traitAnswers.length !== 15) {
        if (!cancelled) router.replace('/recommendation/interest');
        return;
      }

      // 이탈로 draft가 지워져도 create는 이 스냅샷으로 계속한다.
      const payload = {
        majorField: toAssessmentMajorField(majorId),
        traitAnswers,
        valueRanking: valueRanking as CreateAssessmentReqDTOValueRankingItem[],
      };
      const authKey = accessToken ? 'authed' : 'anon';
      const startedAt = Date.now();

      try {
        if (!createInFlight) {
          createInFlight = (async () => {
            const response = await mutateAsync({ data: payload });

            if (response?.isSuccess === false || !response?.result?.uuid) {
              throw new Error(
                '분석 결과를 만들지 못했어요. 다시 시도해 주세요.',
              );
            }

            const uuid = response.result.uuid;
            queryClient.setQueryData(
              [...getAssessmentControllerGetResultQueryKey(uuid), authKey],
              response,
            );
            // 페이지를 떠나도 저장 — 로그인 유저는 status로도 복구 가능
            useRecommendationTestStore.getState().setAssessmentUuid(uuid);
            if (authKey === 'authed') {
              void queryClient.invalidateQueries({
                queryKey: getAssessmentControllerGetStatusQueryKey(),
              });
            }
            return uuid;
          })().finally(() => {
            createInFlight = null;
          });
        }

        const uuid = await createInFlight;

        if (cancelled || generation !== runGenerationRef.current) return;

        setAssessmentUuid(uuid);

        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_WAITING_MS) {
          await new Promise((resolve) =>
            window.setTimeout(resolve, MIN_WAITING_MS - elapsed),
          );
        }

        if (cancelled || generation !== runGenerationRef.current) return;

        router.replace(
          `/recommendation/result?uuid=${encodeURIComponent(uuid)}`,
        );
      } catch (err) {
        if (cancelled || generation !== runGenerationRef.current) return;
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
    hasHydrated,
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

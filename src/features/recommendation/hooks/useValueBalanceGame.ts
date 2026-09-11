'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ValueBalanceQuestionResDTO } from '@/api/models';
import { useAssessmentControllerGetNextValueBalanceQuestion } from '@/api/endpoints/assessment/assessment';
import type {
  ValueBalanceOption,
  ValueBalanceQuestion,
  ValueChoice,
} from '@/features/recommendation/types';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

function toOption(
  option: NonNullable<ValueBalanceQuestionResDTO['left']>,
): ValueBalanceOption {
  return {
    valueKind: option.valueKind,
    label: option.label,
    card: option.card,
  };
}

function toQuestion(
  dto: ValueBalanceQuestionResDTO,
): ValueBalanceQuestion | null {
  if (dto.sequence == null || dto.left == null || dto.right == null) {
    return null;
  }

  return {
    sequence: dto.sequence,
    left: toOption(dto.left),
    right: toOption(dto.right),
  };
}

export function useValueBalanceGame() {
  const router = useRouter();
  const { mutateAsync, isPending: isMutating, reset: resetMutation } =
    useAssessmentControllerGetNextValueBalanceQuestion();

  const hasHydrated = useRecommendationTestStore((s) => s.hasHydrated);
  const valueSessionToken = useRecommendationTestStore(
    (s) => s.valueSessionToken,
  );
  const valueCurrent = useRecommendationTestStore((s) => s.valueCurrent);
  const valueHistory = useRecommendationTestStore((s) => s.valueHistory);
  const valueRanking = useRecommendationTestStore((s) => s.valueRanking);
  const assessmentUuid = useRecommendationTestStore((s) => s.assessmentUuid);
  const setValueSessionToken = useRecommendationTestStore(
    (s) => s.setValueSessionToken,
  );
  const setValueCurrent = useRecommendationTestStore((s) => s.setValueCurrent);
  const setValueHistory = useRecommendationTestStore((s) => s.setValueHistory);
  const setValueRanking = useRecommendationTestStore((s) => s.setValueRanking);
  const resetValueSession = useRecommendationTestStore(
    (s) => s.resetValueSession,
  );

  const [pendingChoice, setPendingChoice] = useState<ValueChoice | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(
    () =>
      valueCurrent == null && valueRanking == null && !assessmentUuid,
  );
  const requestIdRef = useRef(0);

  const applyResponse = useCallback(
    (dto: ValueBalanceQuestionResDTO) => {
      setValueSessionToken(dto.token);

      if (dto.completed) {
        setValueRanking(dto.result?.ranking ?? null);
        setValueCurrent(null);
        setValueHistory([]);
        return 'completed' as const;
      }

      const question = toQuestion(dto);
      if (!question) {
        throw new Error('가치관 질문을 불러오지 못했어요.');
      }

      setValueCurrent(question);
      return 'question' as const;
    },
    [
      setValueCurrent,
      setValueHistory,
      setValueRanking,
      setValueSessionToken,
    ],
  );

  const bootstrap = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsBootstrapping(true);
    setLocalError(null);
    resetMutation();

    try {
      if (valueSessionToken && valueCurrent == null) {
        resetValueSession();
      }

      const response = await mutateAsync({ data: {} });
      if (requestId !== requestIdRef.current) return;

      if (response?.isSuccess === false || !response?.result) {
        throw new Error('가치관 질문을 불러오지 못했어요.');
      }

      const status = applyResponse(response.result);
      if (status === 'completed') {
        router.push('/recommendation/waiting');
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message =
        err instanceof Error
          ? err.message
          : '가치관 질문을 불러오지 못했어요.';
      setLocalError(message);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsBootstrapping(false);
      }
    }
  }, [
    applyResponse,
    mutateAsync,
    resetMutation,
    resetValueSession,
    router,
    valueCurrent,
    valueSessionToken,
  ]);

  const bootstrapRef = useRef(bootstrap);
  bootstrapRef.current = bootstrap;

  useEffect(() => {
    if (!hasHydrated) return;

    if (assessmentUuid) {
      router.replace(
        `/recommendation/result?uuid=${encodeURIComponent(assessmentUuid)}`,
      );
      return;
    }

    if (valueRanking != null && valueCurrent == null) {
      router.replace('/recommendation/waiting');
      return;
    }

    if (valueCurrent != null) {
      setIsBootstrapping(false);
      return;
    }

    void bootstrapRef.current();
    return () => {
      requestIdRef.current += 1;
    };
  }, [assessmentUuid, hasHydrated, router, valueCurrent, valueRanking]);

  const select = useCallback(
    async (choice: ValueChoice) => {
      if (!valueCurrent || isMutating || pendingChoice != null) return;

      const chosen =
        choice === 'left'
          ? valueCurrent.left.valueKind
          : valueCurrent.right.valueKind;

      setPendingChoice(choice);
      setLocalError(null);

      try {
        const response = await mutateAsync({
          data: {
            token: valueSessionToken || undefined,
            sequence: valueCurrent.sequence,
            chosen,
          },
        });

        if (response?.isSuccess === false || !response?.result) {
          throw new Error('응답을 저장하지 못했어요. 다시 시도해 주세요.');
        }

        setValueHistory([
          ...valueHistory.filter(
            (item) => item.sequence < valueCurrent.sequence,
          ),
          { ...valueCurrent, chosen },
        ]);

        const status = applyResponse(response.result);
        setPendingChoice(null);

        if (status === 'completed') {
          router.push('/recommendation/waiting');
        }
      } catch (err) {
        setPendingChoice(null);
        const message =
          err instanceof Error
            ? err.message
            : '응답을 저장하지 못했어요. 다시 시도해 주세요.';
        setLocalError(message);
      }
    },
    [
      applyResponse,
      isMutating,
      mutateAsync,
      pendingChoice,
      router,
      setValueHistory,
      valueCurrent,
      valueHistory,
      valueSessionToken,
    ],
  );

  const goBack = useCallback(() => {
    if (valueHistory.length === 0 || isMutating || pendingChoice != null) {
      return;
    }

    const previous = valueHistory[valueHistory.length - 1];
    setValueHistory(valueHistory.slice(0, -1));
    setValueCurrent({
      sequence: previous.sequence,
      left: previous.left,
      right: previous.right,
    });
    setPendingChoice(null);
    setLocalError(null);
  }, [
    isMutating,
    pendingChoice,
    setValueCurrent,
    setValueHistory,
    valueHistory,
  ]);

  return {
    question: valueCurrent,
    selected: pendingChoice ?? undefined,
    isFirstQuestion: valueHistory.length === 0,
    isLoading:
      !hasHydrated ||
      isBootstrapping ||
      (valueCurrent == null &&
        valueRanking == null &&
        !assessmentUuid &&
        !localError),
    isSubmitting: isMutating || pendingChoice != null,
    error: localError,
    select,
    goBack,
    retry: bootstrap,
  };
}

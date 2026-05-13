'use client';

import { useCallback } from 'react';
import {
  useFeedbackFormControllerGetLatestFeedbackForm,
  useFeedbackResponseControllerSubmitFeedbackResponse,
} from '@/api/endpoints/feedback/feedback';
import type {
  EventFeedbackFormResDTOSchemaItem,
  SubmitFeedbackResponseReqDTOAnswers,
} from '@/api/models';

function parsePositiveInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 1) {
    return Math.trunc(value);
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 1) {
      return Math.trunc(parsed);
    }
  }

  return null;
}

/* 피드백 질문지 조회 + 제출 (Orval API 연동) */
export function useFeedbackSubmission() {
  const {
    data: feedbackFormResponse,
    isPending: isFeedbackFormLoading,
    isError: isFeedbackFormError,
  } = useFeedbackFormControllerGetLatestFeedbackForm();

  const feedbackForm = feedbackFormResponse?.result;
  const formId = parsePositiveInt(feedbackForm?.formId);
  const eventId = parsePositiveInt(feedbackForm?.eventId);
  const schema = feedbackForm?.schema ?? [];

  const canSubmit =
    feedbackFormResponse?.isSuccess !== false &&
    !isFeedbackFormError &&
    formId != null &&
    eventId != null &&
    schema.length > 0;

  const { mutateAsync: submitFeedbackResponse, isPending: isSubmitting } =
    useFeedbackResponseControllerSubmitFeedbackResponse();

  const submitFeedback = useCallback(
    async (answers: Record<string, unknown>) => {
      if (formId == null || eventId == null) {
        throw new Error('피드백 폼 정보를 불러오지 못했어요.');
      }

      try {
        const response = await submitFeedbackResponse({
          data: {
            formId,
            eventId,
            answers: answers as SubmitFeedbackResponseReqDTOAnswers,
          },
        });

        if (response?.isSuccess === false || !response?.result) {
          throw new Error('피드백 제출에 실패했어요.');
        }

        return { rewardGranted: response.result.rewardGranted };
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : '피드백 제출에 실패했어요. 잠시 후 다시 시도해주세요.',
        );
        throw error;
      }
    },
    [eventId, formId, submitFeedbackResponse],
  );

  return {
    submitFeedback,
    isSubmitting,
    canSubmit,
    isFeedbackFormLoading,
    schema: schema as EventFeedbackFormResDTOSchemaItem[],
  };
}

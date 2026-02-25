'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateInsightLogReqDTOCategory } from '@/api/models';
import { createActivityTag, createInsightLog } from '@/services/insight';
import { useLogStore } from '@/store/useLogStore';
import { toLogCardData } from '@/features/log/utils/toLogCardData';
import { ACTIVITY_TAGS_QUERY_KEY } from '@/features/log/constants';
import { useActivityTags } from '@/features/log/hooks/useActivityTags';

export type LogFormErrors = Partial<
  Record<'title' | 'category' | 'content', string>
>;

/* 로그 등록 폼 제출 (활동명 없으면 태그 생성 후 로그 생성, Orval API 연동) */
export function useLogFormSubmit() {
  const {
    formData,
    validateForm,
    getFormattedContent,
    addLog,
    addActivity,
    resetForm,
  } = useLogStore();

  // React Query 클라이언트
  const queryClient = useQueryClient();
  const { activityTags } = useActivityTags();

  // 에러 상태
  const [errors, setErrors] = useState<LogFormErrors>({});

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 폼 검증
    const validation = validateForm();

    // 검증 실패 시 에러 반환
    if (!validation.isValid) {
      setErrors(validation.errors as LogFormErrors);
      return;
    }

    // 에러 초기화
    setErrors({});
    setIsSubmitting(true);

    try {
      const name = formData.activityName?.trim();
      const existing = name
        ? activityTags.find((tag) => tag.name === name)
        : undefined;
      const tag = existing ?? (name ? await createActivityTag({ name }) : undefined);
      if (tag && !existing) addActivity({ id: String(tag.id), label: tag.name });
      const activityIds = tag ? [tag.id] : [];

      const result = await createInsightLog({
        title: formData.title,
        description: getFormattedContent(),
        category: formData.category as CreateInsightLogReqDTOCategory,
        activityIds,
      });

      // 로그 추가
      addLog(toLogCardData(result));
      // 폼 초기화
      resetForm();
      // 활동 태그 목록 무효화
      await queryClient.invalidateQueries({
        queryKey: ACTIVITY_TAGS_QUERY_KEY,
      });
    } catch (err) {
      // 에러 반환
      const message =
        err instanceof Error ? err.message : '로그 등록에 실패했습니다.';
      setErrors({ title: message });
    } finally {
      // 제출 상태 초기화
      setIsSubmitting(false);
    }
  };

  return { errors, isSubmitting, handleSubmit };
}

'use client';

import {
  portfolioCorrectionControllerCreateCorrection,
  portfolioCorrectionControllerGetCorrections,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import {
  clearPendingCorrectionDraft,
  getPendingCorrectionDraft,
  markPendingCorrectionId,
  savePendingCorrectionDraft,
} from '@/features/correction/utils/pendingCorrectionDraft';
import type { InformationErrors } from '@/types/correction';

/** 입력 문자를 제한하지 않고 최대 길이만 적용 */
function limitAllowedInput(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

/** /correction/new 전용: 지원 정보 입력 + 첨삭 생성 후 /correction/{id}로 이동 */
export function useNewCorrectionForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [informationErrors, setInformationErrors] = useState<InformationErrors>(
    {
      companyName: false,
      jobTitle: false,
      jobDescription: false,
    },
  );
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isCorrectionLimitModalOpen, setIsCorrectionLimitModalOpen] =
    useState(false);
  const hasRestoredDraftRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );

  useEffect(() => {
    if (!sessionRestoreAttempted || !accessToken || hasRestoredDraftRef.current)
      return;
    const draft = getPendingCorrectionDraft();
    if (!draft) return;

    setCompanyName(draft.companyName);
    setJobTitle(draft.jobTitle);
    setJobDescription(draft.jobDescription);
    hasRestoredDraftRef.current = true;
  }, [accessToken, sessionRestoreAttempted]);

  const queryClient = useQueryClient();

  const createCorrection = useCallback(async () => {
    const body = {
      title: '새로운 포트폴리오 첨삭',
      jobDescriptionType: 'TEXT' as const,
      companyName: companyName.trim(),
      positionName: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
    };
    try {
      await portfolioCorrectionControllerCreateCorrection(body);
      const listRes = await portfolioCorrectionControllerGetCorrections();

      // 새 첨삭이 생성되었으므로 목록 쿼리 무효화 (새로고침 없이 목록 업데이트)
      queryClient.invalidateQueries({
        queryKey: ['/portfolio-corrections'],
      });

      const list = listRes?.result ?? [];
      const newId = list[0]?.id;
      if (newId != null) {
        if (getPendingCorrectionDraft()) {
          markPendingCorrectionId(newId);
          clearPendingCorrectionDraft();
        }
        router.replace(`/correction/${newId}`);
      }
    } catch (err: unknown) {
      const errObj = err as {
        response?: { data?: { error?: { errorCode?: string } } };
      };
      const code = errObj?.response?.data?.error?.errorCode ?? '';
      if (code === 'CORRECTION4091') {
        setIsCorrectionLimitModalOpen(true);
      }
    }
  }, [companyName, jobTitle, jobDescription, router, queryClient]);

  const handleStartCorrectionClick = useCallback(() => {
    const companyNameEmpty = !companyName.trim();
    const jobTitleEmpty = !jobTitle.trim();
    const jobDescriptionEmpty = !jobDescription.trim();
    const hasError = companyNameEmpty || jobTitleEmpty || jobDescriptionEmpty;
    setInformationErrors({
      companyName: companyNameEmpty,
      jobTitle: jobTitleEmpty,
      jobDescription: jobDescriptionEmpty,
    });
    if (hasError) return;

    if (sessionRestoreAttempted && !accessToken) {
      savePendingCorrectionDraft({
        companyName,
        jobTitle,
        jobDescription,
      });
      router.push('/correction/preview');
      return;
    }

    void portfolioCorrectionControllerGetCorrections()
      .then((response) => {
        if ((response?.result?.length ?? 0) >= 30) {
          setIsCorrectionLimitModalOpen(true);
          return;
        }
        void createCorrection();
      })
      .catch(() => {
        void createCorrection();
      });
  }, [
    companyName,
    jobTitle,
    jobDescription,
    accessToken,
    createCorrection,
    router,
    sessionRestoreAttempted,
  ]);

  const layoutKey = 'correction-information';
  const layoutClassName = 'mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]';

  return {
    router,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    informationErrors,
    setInformationErrors,
    isQuitModalOpen,
    setIsQuitModalOpen,
    isCorrectionLimitModalOpen,
    setIsCorrectionLimitModalOpen,
    limitAllowedInput,
    handleStartCorrectionClick,
    layoutKey,
    layoutClassName,
  };
}

export type UseNewCorrectionFormReturn = ReturnType<
  typeof useNewCorrectionForm
>;

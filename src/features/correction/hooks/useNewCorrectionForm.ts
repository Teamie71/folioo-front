'use client';

import {
  portfolioCorrectionControllerCreateCorrection,
  portfolioCorrectionControllerGetCorrections,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useUserControllerGetTicketBalance } from '@/api/endpoints/user/user';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type {
  FileDeleteConfirmTarget,
  InformationErrors,
} from '@/types/correction';

/** 한국어·영어·숫자·공백·특수문자만 허용, 최대 길이 적용 */
function limitAllowedInput(value: string, maxLength: number): string {
  return value
    .replace(
      /[^\uAC00-\uD7A3\u3130-\u318Ea-zA-Z0-9\s.,\-'()\/&·!?@#%+*<>]/g,
      '',
    )
    .slice(0, maxLength);
}

/** /correction/new 전용: 지원 정보 입력 + 첨삭 생성 후 /correction/{id}로 이동 */
export function useNewCorrectionForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [informationErrors, setInformationErrors] =
    useState<InformationErrors>({
      companyName: false,
      jobTitle: false,
      jobDescription: false,
    });
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isStartCorrectionModalOpen, setIsStartCorrectionModalOpen] =
    useState(false);
  const [isTicketExhaustedModalOpen, setIsTicketExhaustedModalOpen] =
    useState(false);
  const [isCorrectionLimitModalOpen, setIsCorrectionLimitModalOpen] =
    useState(false);

  const { data: ticketBalance } = useUserControllerGetTicketBalance();
  const portfolioCount = ticketBalance?.result?.portfolioCorrection?.count ?? 0;

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
    if (!hasError) {
      if (portfolioCount < 1) {
        setIsTicketExhaustedModalOpen(true);
      } else {
        setIsStartCorrectionModalOpen(true);
      }
    }
  }, [
    companyName,
    jobTitle,
    jobDescription,
    portfolioCount,
  ]);

  const queryClient = useQueryClient();

  const handleStartCorrectionConfirm = useCallback(async () => {
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
      setIsStartCorrectionModalOpen(false);
      if (newId != null) {
        router.replace(`/correction/${newId}`);
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { error?: { errorCode?: string } } } };
      const code = errObj?.response?.data?.error?.errorCode ?? '';
      if (code === 'CORRECTION4091') {
        setIsStartCorrectionModalOpen(false);
        setIsCorrectionLimitModalOpen(true);
      }
    }
  }, [companyName, jobTitle, jobDescription, router, queryClient]);

  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]`;

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
    fileDeleteConfirmTarget,
    setFileDeleteConfirmTarget,
    isQuitModalOpen,
    setIsQuitModalOpen,
    isStartCorrectionModalOpen,
    setIsStartCorrectionModalOpen,
    isTicketExhaustedModalOpen,
    setIsTicketExhaustedModalOpen,
    isCorrectionLimitModalOpen,
    setIsCorrectionLimitModalOpen,
    limitAllowedInput,
    handleStartCorrectionClick,
    handleStartCorrectionConfirm,
    layoutClassName,
  };
}

export type UseNewCorrectionFormReturn = ReturnType<typeof useNewCorrectionForm>;

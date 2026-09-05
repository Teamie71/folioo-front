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
  consumePendingCorrectionJdImages,
  getPendingCorrectionDraft,
  markPendingCorrectionId,
  savePendingCorrectionJdImages,
  savePendingCorrectionDraft,
} from '@/features/correction/utils/pendingCorrectionDraft';
import type {
  FileDeleteConfirmTarget,
  InformationErrors,
  JdMode,
  JdUploadedFile,
} from '@/types/correction';

/** 입력 문자를 제한하지 않고 최대 길이만 적용 */
function limitAllowedInput(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

/** /correction/new 전용: 지원 정보 입력 + 첨삭 생성 후 /correction/{id}로 이동 */
export function useNewCorrectionForm() {
  const router = useRouter();
  const [jdMode, setJdMode] = useState<JdMode>('text');
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
  const [jdUploadedFiles, setJdUploadedFiles] = useState<JdUploadedFile[]>([]);
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);
  const [jdImageError, setJdImageError] = useState<
    null | 'required' | 'too_large' | 'too_many'
  >(null);
  const [jdShakeKey, setJdShakeKey] = useState(0);
  const [jdViewerFileIndex, setJdViewerFileIndex] = useState<number | null>(
    null,
  );
  const [isJdDropOverlayActive, setIsJdDropOverlayActive] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isCorrectionLimitModalOpen, setIsCorrectionLimitModalOpen] =
    useState(false);
  const hasRestoredDraftRef = useRef(false);
  const jdFileInputRef = useRef<HTMLInputElement>(null);
  const jdUploadedFilesRef = useRef<JdUploadedFile[]>([]);
  jdUploadedFilesRef.current = jdUploadedFiles;
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
    setJdMode(draft.jdMode);
    hasRestoredDraftRef.current = true;

    if (draft.jdMode === 'image') {
      void consumePendingCorrectionJdImages().then((files) => {
        setJdUploadedFiles(
          files.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
          })),
        );
      });
    }
  }, [accessToken, sessionRestoreAttempted]);

  useEffect(
    () => () => {
      jdUploadedFilesRef.current.forEach(({ previewUrl }) =>
        URL.revokeObjectURL(previewUrl),
      );
    },
    [],
  );

  const queryClient = useQueryClient();

  const createCorrection = useCallback(async () => {
    const body = {
      title: '새로운 포트폴리오 첨삭',
      jobDescriptionType:
        jdMode === 'text' ? ('TEXT' as const) : ('IMAGE' as const),
      companyName: companyName.trim(),
      positionName: jobTitle.trim(),
      jobDescription: jdMode === 'text' ? jobDescription.trim() : undefined,
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
  }, [companyName, jobTitle, jobDescription, jdMode, router, queryClient]);

  const handleStartCorrectionClick = useCallback(() => {
    const companyNameEmpty = !companyName.trim();
    const jobTitleEmpty = !jobTitle.trim();
    const jobDescriptionEmpty =
      jdMode === 'text' ? !jobDescription.trim() : jdUploadedFiles.length === 0;
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
        jdMode,
      });
      if (jdMode === 'image') {
        void savePendingCorrectionJdImages(
          jdUploadedFiles.map(({ file }) => file),
        ).finally(() => router.push('/correction/preview'));
      } else {
        router.push('/correction/preview');
      }
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
    jdMode,
    jdUploadedFiles,
    accessToken,
    createCorrection,
    router,
    sessionRestoreAttempted,
  ]);

  const handleJdModeChange = useCallback((mode: JdMode) => {
    setJdMode(mode);
    setJdImageError(null);
    setInformationErrors((prev) => ({ ...prev, jobDescription: false }));
  }, []);

  const handleJdImageFile = useCallback((file: File) => {
    const isImage =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      /\.(png|jpe?g)$/i.test(file.name);
    if (!isImage) return;

    if (file.size > 1024 * 1024) {
      setJdImageError('too_large');
      setJdShakeKey((key) => key + 1);
      setInformationErrors((prev) => ({ ...prev, jobDescription: true }));
      return;
    }

    setJdUploadedFiles((prev) => {
      if (prev.length >= 2) {
        setJdImageError('too_many');
        setJdShakeKey((key) => key + 1);
        setInformationErrors((errors) => ({
          ...errors,
          jobDescription: true,
        }));
        return prev;
      }

      setJdImageError(null);
      setInformationErrors((errors) => ({
        ...errors,
        jobDescription: false,
      }));
      return [
        ...prev,
        {
          file,
          name: file.name,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
        },
      ];
    });
  }, []);

  const removeJdFileAt = useCallback((index: number) => {
    setJdUploadedFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
    setJdImageError(null);
    setInformationErrors((prev) => ({ ...prev, jobDescription: false }));
    setJdViewerFileIndex((currentIndex) => {
      if (currentIndex === index) return null;
      if (currentIndex != null && currentIndex > index) return currentIndex - 1;
      return currentIndex;
    });
  }, []);

  const handlePasteJdImageFromClipboard = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find(
          (type) => type === 'image/png' || type === 'image/jpeg',
        );
        if (!imageType) continue;

        const blob = await item.getType(imageType);
        const extension = imageType === 'image/png' ? 'png' : 'jpg';
        const file = new File(
          [blob],
          `pasted-jd-${jdUploadedFiles.length + 1}.${extension}`,
          { type: imageType },
        );
        handleJdImageFile(file);
        return;
      }
    } catch {
      // 클립보드 접근을 허용하지 않은 브라우저에서는 파일 업로드를 사용한다.
    }
  }, [handleJdImageFile, jdUploadedFiles.length]);

  const layoutKey =
    jdImageError === 'too_large' || jdImageError === 'too_many'
      ? `jd-shake-${jdShakeKey}`
      : 'jd-no-shake';
  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${
    jdImageError === 'too_large' || jdImageError === 'too_many'
      ? 'animate-shake'
      : ''
  }`;

  return {
    router,
    jdMode,
    handleJdModeChange,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    informationErrors,
    setInformationErrors,
    jdUploadedFiles,
    fileDeleteConfirmTarget,
    setFileDeleteConfirmTarget,
    jdImageError,
    jdViewerFileIndex,
    setJdViewerFileIndex,
    isJdDropOverlayActive,
    setIsJdDropOverlayActive,
    isQuitModalOpen,
    setIsQuitModalOpen,
    isCorrectionLimitModalOpen,
    setIsCorrectionLimitModalOpen,
    jdFileInputRef,
    limitAllowedInput,
    handleStartCorrectionClick,
    handleJdImageFile,
    handlePasteJdImageFromClipboard,
    removeJdFileAt,
    layoutKey,
    layoutClassName,
  };
}

export type UseNewCorrectionFormReturn = ReturnType<
  typeof useNewCorrectionForm
>;

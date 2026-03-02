'use client';

import {
  portfolioCorrectionControllerCreateCorrection,
  portfolioCorrectionControllerGetCorrections,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  FileDeleteConfirmTarget,
  InformationErrors,
  JdUploadedFile,
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
  const [jdMode, setJdMode] = useState<'text' | 'image'>('text');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [informationErrors, setInformationErrors] =
    useState<InformationErrors>({
      companyName: false,
      jobTitle: false,
      jobDescription: false,
    });
  const [jdUploadedFiles, setJdUploadedFiles] = useState<JdUploadedFile[]>([]);
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);
  const [jdViewerFileIndex, setJdViewerFileIndex] = useState<number | null>(null);
  const [jdImageError, setJdImageError] = useState<
    null | 'required' | 'too_large' | 'too_many'
  >(null);
  const [jdShakeKey, setJdShakeKey] = useState(0);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isStartCorrectionModalOpen, setIsStartCorrectionModalOpen] =
    useState(false);
  const [isJdDropOverlayActive, setIsJdDropOverlayActive] = useState(false);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const hasJdImageUploaded = jdUploadedFiles.length >= 1;

  const handleStartCorrectionClick = useCallback(() => {
    const companyNameEmpty = !companyName.trim();
    const jobTitleEmpty = !jobTitle.trim();
    const jobDescriptionEmpty =
      jdMode === 'text' ? !jobDescription.trim() : !hasJdImageUploaded;
    const hasError = companyNameEmpty || jobTitleEmpty || jobDescriptionEmpty;
    setInformationErrors({
      companyName: companyNameEmpty,
      jobTitle: jobTitleEmpty,
      jobDescription: jobDescriptionEmpty,
    });
    if (!hasError) setIsStartCorrectionModalOpen(true);
  }, [
    companyName,
    jobTitle,
    jobDescription,
    jdMode,
    hasJdImageUploaded,
  ]);

  const handleStartCorrectionConfirm = useCallback(async () => {
    const body = {
      jobDescriptionType: jdMode === 'text' ? ('TEXT' as const) : ('IMAGE' as const),
      companyName: companyName.trim(),
      positionName: jobTitle.trim(),
      ...(jdMode === 'text'
        ? { jobDescription: jobDescription.trim() }
        : { jobDescription: '' }),
    };
    try {
      await portfolioCorrectionControllerCreateCorrection(body);
      const listRes = await portfolioCorrectionControllerGetCorrections();
      const list = listRes?.result ?? [];
      const newId = list[0]?.id;
      setIsStartCorrectionModalOpen(false);
      if (newId != null) {
        router.replace(`/correction/${newId}`);
      }
    } catch {
      // 실패 시 모달 유지
    }
  }, [jdMode, companyName, jobTitle, jobDescription, router]);

  const handleJdImageFile = useCallback((file: File) => {
    const isImage =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      /\.(png|jpe?g)$/i.test(file.name);
    if (!isImage) return;
    if (file.size > 1024 * 1024) {
      setJdImageError('too_large');
      setJdShakeKey((k) => k + 1);
      setInformationErrors((prev) => ({ ...prev, jobDescription: true }));
      return;
    }
    setJdUploadedFiles((prev) => {
      if (prev.length >= 2) {
        setJdImageError('too_many');
        setJdShakeKey((k) => k + 1);
        setInformationErrors((p) => ({ ...p, jobDescription: true }));
        return prev;
      }
      setJdImageError(null);
      setInformationErrors((p) => ({ ...p, jobDescription: false }));
      return [
        ...prev,
        {
          name: file.name,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
        },
      ];
    });
  }, []);

  const removeJdFileAt = useCallback((index: number) => {
    setJdUploadedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index]?.previewUrl) URL.revokeObjectURL(prev[index].previewUrl);
      return next;
    });
    setJdImageError(null);
    if (jdViewerFileIndex === index) setJdViewerFileIndex(null);
    else if (jdViewerFileIndex != null && jdViewerFileIndex > index)
      setJdViewerFileIndex((i) => i - 1);
  }, [jdViewerFileIndex]);

  const handlePasteJdImageFromClipboard = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type === 'image/png' || type === 'image/jpeg') {
            const blob = await item.getType(type);
            const baseName =
              jdUploadedFiles.length === 0
                ? 'pasted-image'
                : `pasted-image-${jdUploadedFiles.length + 1}`;
            const ext = type === 'image/png' ? 'png' : 'jpg';
            const file = new File([blob], `${baseName}.${ext}`, { type });
            handleJdImageFile(file);
            return;
          }
        }
      }
    } catch {
      // clipboard read denied or unsupported
    }
  }, [jdUploadedFiles.length, handleJdImageFile]);

  const layoutKey =
    jdImageError === 'too_large' || jdImageError === 'too_many'
      ? `jd-shake-${jdShakeKey}`
      : 'no-shake';
  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${jdImageError === 'too_large' || jdImageError === 'too_many' ? 'animate-shake' : ''}`;

  return {
    router,
    jdMode,
    setJdMode,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    informationErrors,
    setInformationErrors,
    jdUploadedFiles,
    setJdUploadedFiles,
    fileDeleteConfirmTarget,
    setFileDeleteConfirmTarget,
    jdViewerFileIndex,
    setJdViewerFileIndex,
    jdImageError,
    setJdImageError,
    jdShakeKey,
    isQuitModalOpen,
    setIsQuitModalOpen,
    isStartCorrectionModalOpen,
    setIsStartCorrectionModalOpen,
    isJdDropOverlayActive,
    setIsJdDropOverlayActive,
    jdFileInputRef,
    limitAllowedInput,
    handleStartCorrectionClick,
    handleStartCorrectionConfirm,
    handleJdImageFile,
    handlePasteJdImageFromClipboard,
    removeJdFileAt,
    layoutKey,
    layoutClassName,
  };
}

export type UseNewCorrectionFormReturn = ReturnType<typeof useNewCorrectionForm>;

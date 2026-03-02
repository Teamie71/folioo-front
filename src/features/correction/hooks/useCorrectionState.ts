'use client';

import {
  externalPortfolioControllerCreateExternalPortfolioBlock,
  externalPortfolioControllerDeleteExternalPortfolio,
  externalPortfolioControllerExtractPortfolios,
  externalPortfolioControllerGetExternalPortfolios,
  externalPortfolioControllerUpdateExternalPortfolio,
} from '@/api/endpoints/portfolio/portfolio';
import {
  portfolioCorrectionControllerCreateCorrection,
  portfolioCorrectionControllerGetCorrections,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { mapToPdfActivityBlock, toPatchBody } from '@/services/correction';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCorrectionNavbar } from '@/contexts/CorrectionNavbarContext';
import {
  INITIAL_PDF_ACTIVITIES,
  PDF_CATEGORY_CHAR_LIMIT,
} from '@/features/correction/constants';
import type {
  FileDeleteConfirmTarget,
  InformationErrors,
  JdUploadedFile,
  PdfActivityBlock,
  PdfCategoryName,
  PortfolioType,
  Status,
  Step,
} from '@/types/correction';

const TEXT_PORTFOLIOS: Array<{
  id: string;
  title: string;
  tag: string;
  date: string;
}> = [
  { id: 'text-1', title: '데이터 통계 경진대회', tag: '데이터', date: '2000-00-00' },
  { id: 'text-2', title: '공공 디자인 공모전', tag: '디자인', date: '2000-00-00' },
  { id: 'text-3', title: '00기업 서포터즈 활동', tag: '미정', date: '2000-00-00' },
];

/** 한국어·영어·숫자·공백·특수문자만 허용, 최대 길이 적용 */
function limitAllowedInput(value: string, maxLength: number): string {
  return value
    .replace(
      /[^\uAC00-\uD7A3\u3130-\u318Ea-zA-Z0-9\s.,\-'()\/&·!?@#%+*<>]/g,
      '',
    )
    .slice(0, maxLength);
}

export function useCorrectionState(correctionId?: string | null) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('information');
  const [status, setStatus] = useState<Status>('DRAFT');
  const [jdMode, setJdMode] = useState<'text' | 'image'>('text');
  const [selectedPortfolioType, setSelectedPortfolioType] =
    useState<PortfolioType | null>(null);
  const [pdfActivities, setPdfActivities] =
    useState<PdfActivityBlock[]>(INITIAL_PDF_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    INITIAL_PDF_ACTIVITIES[0].id,
  );
  const [selectedTab, setSelectedTab] = useState<PdfCategoryName>('상세정보');
  const [activityDeleteTargetId, setActivityDeleteTargetId] = useState<
    string | null
  >(null);
  const [pdfActivityHoverId, setPdfActivityHoverId] = useState<string | null>(
    null,
  );
  const [selectedTextPortfolioIds, setSelectedTextPortfolioIds] = useState<
    string[]
  >([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [resultTab, setResultTab] = useState<
    '지원 정보' | '총평' | '활동 A' | '활동 B'
  >('지원 정보');
  const [detailInfoButton, setDetailInfoButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [responsibilityButton, setResponsibilityButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [problemSolvingButton, setProblemSolvingButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [lessonsButton, setLessonsButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isStartCorrectionModalOpen, setIsStartCorrectionModalOpen] =
    useState(false);
  const [isPdfTextExtracted, setIsPdfTextExtracted] = useState(false);
  const [isPdfTextExtracting, setIsPdfTextExtracting] = useState(false);
  const [isPdfExtractConfirmModalOpen, setIsPdfExtractConfirmModalOpen] =
    useState(false);
  const [pdfUploadedFile, setPdfUploadedFile] = useState<{
    name: string;
    file: File;
  } | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<
    null | 'too_large' | 'too_many'
  >(null);
  const [pdfShakeKey, setPdfShakeKey] = useState(0);
  const [isPdfDropOverlayActive, setIsPdfDropOverlayActive] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const bulletTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const lastBulletEnterAt = useRef<number>(0);
  const [showTextPortfolioWarning, setShowTextPortfolioWarning] =
    useState(false);
  const [analysisInfoValue, setAnalysisInfoValue] = useState('');
  const [showAnalysisInfoWarning, setShowAnalysisInfoWarning] = useState(false);
  const [emphasisPointsValue, setEmphasisPointsValue] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jdUploadedFiles, setJdUploadedFiles] = useState<JdUploadedFile[]>([]);
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);
  const [jdViewerFileIndex, setJdViewerFileIndex] = useState<number | null>(
    null,
  );
  const [isJdDropOverlayActive, setIsJdDropOverlayActive] = useState(false);
  const jdFileInputRef = useRef<HTMLInputElement>(null);
  const [informationErrors, setInformationErrors] =
    useState<InformationErrors>({
      companyName: false,
      jobTitle: false,
      jobDescription: false,
    });
  const [jdImageError, setJdImageError] = useState<
    null | 'required' | 'too_large' | 'too_many'
  >(null);
  const [jdShakeKey, setJdShakeKey] = useState(0);

  const hasJdImageUploaded = jdUploadedFiles.length >= 1;

  // information + 이미지 모드일 때 창 어디로든 파일 드래그 들어오면 전체 페이지 드롭 오버레이 활성화
  useEffect(() => {
    if (step !== 'information' || jdMode !== 'image') return;
    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files'))
        setIsJdDropOverlayActive(true);
    };
    document.addEventListener('dragenter', onDragEnter);
    return () => document.removeEventListener('dragenter', onDragEnter);
  }, [step, jdMode]);

  // portfolio + PDF 선택 시 창 어디로든 파일 드래그 들어오면 전체 페이지 드롭 오버레이 활성화
  useEffect(() => {
    if (step !== 'portfolio' || selectedPortfolioType !== 'pdf') return;
    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files'))
        setIsPdfDropOverlayActive(true);
    };
    document.addEventListener('dragenter', onDragEnter);
    return () => document.removeEventListener('dragenter', onDragEnter);
  }, [step, selectedPortfolioType]);

  const { setShowNavbarOnResult } = useCorrectionNavbar() ?? {};
  useEffect(() => {
    setShowNavbarOnResult?.(step === 'result');
  }, [step, setShowNavbarOnResult]);

  const handlePdfExtractConfirm = useCallback(async () => {
    if (!pdfUploadedFile) return;
    setIsPdfExtractConfirmModalOpen(false);
    setIsPdfTextExtracting(true);
    try {
      const extractRes = await externalPortfolioControllerExtractPortfolios({ file: pdfUploadedFile.file });
      if (extractRes.status !== 200) throw new Error();
      setIsPdfTextExtracted(true);
      const id = correctionId != null ? Number(correctionId) : null;
      if (id != null && !Number.isNaN(id)) {
        const listRes = await externalPortfolioControllerGetExternalPortfolios({ correctionId: id });
        const result = (listRes.data as { result?: Array<{ portfolioId: number; name: string; description: string; responsibilities: string; problemSolving: string; learnings: string }> })?.result;
        const activities = (result ?? []).map((dto, i) => mapToPdfActivityBlock(dto, i));
        setPdfActivities(activities);
        if (activities.length > 0) setSelectedActivityId(activities[0].id);
      }
    } catch {
      // 실패 시 상태만 복구
    } finally {
      setIsPdfTextExtracting(false);
    }
  }, [pdfUploadedFile, correctionId]);

  const handleDeletePdfActivity = useCallback(async () => {
    const targetId = activityDeleteTargetId;
    if (targetId === null) return;
    const activity = pdfActivities.find((a) => a.id === targetId);
    if (activity?.portfolioId != null) {
      try {
        const res = await externalPortfolioControllerDeleteExternalPortfolio(activity.portfolioId);
        if (res.status !== 200) throw new Error();
      } catch {
        return;
      }
    }
    setPdfActivities((prev) => {
      const next = prev.filter((a) => a.id !== targetId);
      setSelectedActivityId((id) =>
        next.some((a) => a.id === id) ? id : next[0]?.id ?? id,
      );
      return next;
    });
    setActivityDeleteTargetId(null);
  }, [activityDeleteTargetId, pdfActivities]);

  const handleAddPdfActivity = useCallback(async () => {
    const id = correctionId != null ? Number(correctionId) : null;
    if (id == null || Number.isNaN(id)) return;
    if (pdfActivities.length >= 5) return;
    try {
      const res = await externalPortfolioControllerCreateExternalPortfolioBlock({ correctionId: id });
      const result = (res.data as { result?: { portfolioId: number; name: string; description: string; responsibilities: string; problemSolving: string; learnings: string } })?.result;
      if (res.status !== 200 || !result) throw new Error();
      const newBlock = mapToPdfActivityBlock(result, pdfActivities.length);
      setPdfActivities((prev) => [...prev, newBlock]);
      setSelectedActivityId(newBlock.id);
    } catch {
      // 실패 시 무시
    }
  }, [correctionId, pdfActivities.length]);

  const debouncedPatchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePdfActivityChange = useCallback((activity: PdfActivityBlock) => {
    if (activity.portfolioId == null) return;
    if (debouncedPatchRef.current) clearTimeout(debouncedPatchRef.current);
    debouncedPatchRef.current = setTimeout(() => {
      debouncedPatchRef.current = null;
      externalPortfolioControllerUpdateExternalPortfolio(activity.portfolioId!, toPatchBody(activity)).catch(
        () => {},
      );
    }, 500);
  }, []);

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
      } else {
        setStep('portfolio');
      }
    } catch {
      // 실패 시 모달 유지
    }
  }, [jdMode, companyName, jobTitle, jobDescription, router]);

  const handleNextStep = useCallback(() => {
    if (step === 'information') {
      setStep('portfolio');
    } else if (step === 'portfolio') {
      if (
        selectedPortfolioType === 'text' &&
        selectedTextPortfolioIds.length === 0
      ) {
        setShowTextPortfolioWarning(true);
        return;
      }
      setStep('analysis');
    } else if (step === 'analysis') {
      if (!analysisInfoValue.trim()) {
        setShowAnalysisInfoWarning(true);
        return;
      }
      setStatus('ANALYZING');
      setTimeout(() => {
        setStatus('DONE');
        setStep('result');
      }, 2000);
    }
  }, [
    step,
    selectedPortfolioType,
    selectedTextPortfolioIds.length,
    analysisInfoValue,
  ]);

  const handleStartNewExperience = useCallback(() => {
    router.push('/experience/settings');
  }, [router]);

  const handlePortfolioSelect = useCallback((type: PortfolioType) => {
    setSelectedPortfolioType(type);
    setShowTextPortfolioWarning(false);
    setSelectedTextPortfolioIds([]);
    if (type !== 'pdf') {
      setIsPdfTextExtracted(false);
      setPdfUploadedFile(null);
      setPdfUploadError(null);
    }
  }, []);

  const handlePdfFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') return;
    if (file.size > 10 * 1024 * 1024) {
      setPdfUploadError('too_large');
      setPdfShakeKey((k) => k + 1);
      return;
    }
    setPdfUploadedFile((prev) => {
      if (prev) {
        setPdfUploadError('too_many');
        setPdfShakeKey((k) => k + 1);
        return prev;
      }
      setPdfUploadError(null);
      return { name: file.name, file };
    });
  }, []);

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
      // 권한 거부 또는 클립보드에 이미지 없음
    }
  }, [jdUploadedFiles.length, handleJdImageFile]);

  const removeJdFileAt = useCallback(
    (index: number) => {
      setJdUploadedFiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        if (prev[index]?.previewUrl) URL.revokeObjectURL(prev[index].previewUrl);
        return next;
      });
      setJdImageError(null);
      if (jdViewerFileIndex === index) setJdViewerFileIndex(null);
      else if (jdViewerFileIndex !== null && jdViewerFileIndex > index)
        setJdViewerFileIndex((i) => (i === null ? null : i - 1));
    },
    [jdViewerFileIndex],
  );

  const layoutKey =
    pdfUploadError === 'too_large' || pdfUploadError === 'too_many'
      ? `pdf-shake-${pdfShakeKey}`
      : jdImageError === 'too_large' || jdImageError === 'too_many'
        ? `jd-shake-${jdShakeKey}`
        : 'no-shake';
  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${jdImageError === 'too_large' || jdImageError === 'too_many' || pdfUploadError === 'too_large' || pdfUploadError === 'too_many' ? 'animate-shake' : ''}`;

  const pdfCategoryOverLimit =
    selectedPortfolioType === 'pdf' &&
    pdfActivities.some((a) =>
      a.categories.some(
        (c) =>
          c.bullets.reduce((s, b) => s + b.length, 0) > PDF_CATEGORY_CHAR_LIMIT,
      ),
    );

  return {
    router,
    step,
    status,
    jdMode,
    setJdMode,
    selectedPortfolioType,
    pdfActivities,
    setPdfActivities,
    selectedActivityId,
    setSelectedActivityId,
    selectedTab,
    setSelectedTab,
    activityDeleteTargetId,
    setActivityDeleteTargetId,
    pdfActivityHoverId,
    setPdfActivityHoverId,
    selectedTextPortfolioIds,
    setSelectedTextPortfolioIds,
    isEditingTitle,
    setIsEditingTitle,
    textPortfolios: TEXT_PORTFOLIOS,
    resultTab,
    setResultTab,
    detailInfoButton,
    setDetailInfoButton,
    responsibilityButton,
    setResponsibilityButton,
    problemSolvingButton,
    setProblemSolvingButton,
    lessonsButton,
    setLessonsButton,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isQuitModalOpen,
    setIsQuitModalOpen,
    isStartCorrectionModalOpen,
    setIsStartCorrectionModalOpen,
    isPdfTextExtracted,
    setIsPdfTextExtracted,
    isPdfTextExtracting,
    setIsPdfTextExtracting,
    isPdfExtractConfirmModalOpen,
    setIsPdfExtractConfirmModalOpen,
    pdfUploadedFile,
    setPdfUploadedFile,
    pdfUploadError,
    setPdfUploadError,
    isPdfDropOverlayActive,
    setIsPdfDropOverlayActive,
    pdfFileInputRef,
    bulletTextareaRefs,
    lastBulletEnterAt,
    showTextPortfolioWarning,
    setShowTextPortfolioWarning,
    analysisInfoValue,
    setAnalysisInfoValue,
    showAnalysisInfoWarning,
    setShowAnalysisInfoWarning,
    emphasisPointsValue,
    setEmphasisPointsValue,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    jdUploadedFiles,
    fileDeleteConfirmTarget,
    setFileDeleteConfirmTarget,
    jdViewerFileIndex,
    setJdViewerFileIndex,
    isJdDropOverlayActive,
    setIsJdDropOverlayActive,
    jdFileInputRef,
    informationErrors,
    setInformationErrors,
    jdImageError,
    setJdImageError,
    jdShakeKey,
    setJdUploadedFiles,
    limitAllowedInput,
    handleStartCorrectionClick,
    handleStartCorrectionConfirm,
    handleNextStep,
    handleStartNewExperience,
    handlePortfolioSelect,
    handlePdfFile,
    handlePdfExtractConfirm,
    handleDeletePdfActivity,
    handleAddPdfActivity,
    handlePdfActivityChange,
    handleJdImageFile,
    handlePasteJdImageFromClipboard,
    removeJdFileAt,
    layoutKey,
    layoutClassName,
    pdfCategoryOverLimit,
  };
}

export type UseCorrectionStateReturn = ReturnType<typeof useCorrectionState>;

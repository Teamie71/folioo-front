'use client';

import {
  externalPortfolioControllerCreateExternalPortfolioBlock,
  externalPortfolioControllerDeleteExternalPortfolio,
  externalPortfolioControllerExtractPortfolios,
  externalPortfolioControllerGetSelectedPortfolios,
  externalPortfolioControllerUpdateExternalPortfolio,
  getExternalPortfolioControllerGetSelectedPortfoliosQueryKey,
} from '@/api/endpoints/portfolio/portfolio';
import {
  portfolioCorrectionControllerMapCorrectionWithPortfolios,
  portfolioCorrectionControllerCreateCorrectionByAI,
  portfolioCorrectionControllerGetCorrectionStatus,
  portfolioCorrectionControllerCreateCompanyInsight,
  portfolioCorrectionControllerUpdateCompanyInsight,
  portfolioCorrectionControllerUpdateCorrectionTitle,
  portfolioCorrectionControllerGetCorrections,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import type {
  CorrectionStatusResDTOStatus,
  ExternalPortfolioControllerCreateExternalPortfolioBlock200,
} from '@/api/models';
import {
  assignPlaceholderLabelsForEmptyPdfNames,
  mapToPdfActivityBlock,
  toPatchBody,
} from '@/services/correction';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCorrectionNavbar } from '@/contexts/CorrectionNavbarContext';
import { useAuthStore } from '@/store/useAuthStore';
import {
  getPdfCategoryCharLimit,
  getPdfActivityPlaceholderLabel,
  getNextPdfPlaceholderLabelIndex,
  INITIAL_PDF_ACTIVITIES,
  PDF_MAX_ACTIVITY_COUNT,
} from '@/features/correction/constants';
import {
  clearPendingCorrectionPdf,
  consumePendingCorrectionPdf,
  savePendingCorrectionPdf,
} from '@/features/correction/utils/pendingCorrectionDraft';
import type {
  FileDeleteConfirmTarget,
  PdfActivityBlock,
  PdfCategoryName,
  Status,
  Step,
} from '@/types/correction';

/** 입력 문자를 제한하지 않고 최대 길이만 적용 */
function limitAllowedInput(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

const EMPTY_CORRECTION_ID = '';

/** GET /status 응답값 → step, status 복원용 */
function mapStatusToStepAndStatus(
  apiStatus: CorrectionStatusResDTOStatus | undefined,
): { step: Step; status: Status } {
  switch (apiStatus) {
    case 'COMPANY_INSIGHT':
      return { step: 'analysis', status: 'DRAFT' };
    case 'DOING_RAG':
    case 'GENERATING':
      return { step: 'result', status: 'ANALYZING' };
    case 'RAG_FAILED':
    case 'FAILED':
      return { step: 'result', status: 'ANALYZING_FAILED' };
    case 'DONE':
      return { step: 'result', status: 'DONE' };
    case 'NOT_STARTED':
    default:
      return { step: 'portfolio', status: 'DRAFT' };
  }
}

export function useCorrectionState(correctionId: string | undefined) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [step, setStep] = useState<Step>('portfolio');
  const effectiveId = correctionId ?? EMPTY_CORRECTION_ID;
  const [status, setStatus] = useState<Status>('DRAFT');
  const [pdfActivities, setPdfActivities] = useState<PdfActivityBlock[]>(
    INITIAL_PDF_ACTIVITIES,
  );
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
  const [title, setTitle] = useState('새로운 포트폴리오 첨삭');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [resultTab, setResultTab] = useState<string>('지원 정보');
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
  const [isPdfTextExtracted, setIsPdfTextExtracted] = useState(false);
  const [isPdfTextExtracting, setIsPdfTextExtracting] = useState(false);
  const [isPdfExtractFailed, setIsPdfExtractFailed] = useState(false);
  /** 추출 요청마다 증가 — 조회 API로 동기화할 때마다 한 번만 상태 반영 */
  const [pdfExtractNonce, setPdfExtractNonce] = useState(0);
  const [isPdfExtractConfirmModalOpen, setIsPdfExtractConfirmModalOpen] =
    useState(false);
  const [isPdfLoginRequiredModalOpen, setIsPdfLoginRequiredModalOpen] =
    useState(false);
  const [pdfUploadedFile, setPdfUploadedFile] = useState<{
    name: string;
    /** 직접 업로드한 경우에만 존재. 재진입 복원 시에는 없을 수 있음 */
    file?: File;
  } | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<
    null | 'too_large' | 'too_many'
  >(null);
  const [pdfShakeKey, setPdfShakeKey] = useState(0);
  const [isPdfDropOverlayActive, setIsPdfDropOverlayActive] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const bulletTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const lastBulletEnterAt = useRef<number>(0);
  const [analysisInfoValue, setAnalysisInfoValue] = useState('');
  const [showAnalysisInfoWarning, setShowAnalysisInfoWarning] = useState(false);
  const [emphasisPointsValue, setEmphasisPointsValue] = useState('');
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const pendingPdfRestoreAttemptedForIdRef = useRef<string>('');

  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  // 포트폴리오 단계에서는 창 어디로든 PDF 파일을 드래그할 수 있다.
  useEffect(() => {
    if (step !== 'portfolio') return;
    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files'))
        setIsPdfDropOverlayActive(true);
    };
    document.addEventListener('dragenter', onDragEnter);
    return () => document.removeEventListener('dragenter', onDragEnter);
  }, [step]);

  const { setShowNavbarOnResult } = useCorrectionNavbar() ?? {};

  // correctionId 있을 때 GET /status로 step·status 복원
  useEffect(() => {
    if (!sessionRestoreAttempted) return;

    // 비로그인 사용자는 PDF 업로드 화면까지 접근할 수 있다.
    // 실제 첨삭 데이터 조회와 생성은 로그인 후에만 수행한다.
    if (!accessToken) {
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);

    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) {
      setIsInitializing(false);
      return;
    }

    // 내 첨삭인지 확인
    portfolioCorrectionControllerGetCorrections()
      .then((listRes) => {
        const corrections = (listRes as any)?.result ?? [];
        const myCorrection = corrections.find((c: any) => c.id === id);
        if (!myCorrection) {
          router.replace('/correction');
          return;
        }

        if (myCorrection.title) {
          setTitle(myCorrection.title);
        }

        // 내 첨삭이면 status 조회 진행
        portfolioCorrectionControllerGetCorrectionStatus(id)
          .then((res) => {
            const apiStatus = (
              res as { result?: { status?: CorrectionStatusResDTOStatus } }
            )?.result?.status;
            const { step: nextStep, status: nextStatus } =
              mapStatusToStepAndStatus(apiStatus);
            setStep(nextStep);
            setStatus(nextStatus);
          })
          .catch(() => {})
          .finally(() => {
            setIsInitializing(false);
          });
      })
      .catch(() => {
        // 에러 발생 시에도 일단 메인으로
        router.replace('/correction');
      });
  }, [accessToken, effectiveId, router, sessionRestoreAttempted]);

  useEffect(() => {
    if (!accessToken || isInitializing) return;
    if (pendingPdfRestoreAttemptedForIdRef.current === effectiveId) return;

    const id = Number(effectiveId);
    if (Number.isNaN(id) || id <= 0) return;
    pendingPdfRestoreAttemptedForIdRef.current = effectiveId;

    void consumePendingCorrectionPdf(id).then((file) => {
      if (!file) return;
      setPdfUploadedFile({ name: file.name, file });
    });
  }, [accessToken, effectiveId, isInitializing]);

  useEffect(() => {
    setShowNavbarOnResult?.(step === 'result');
  }, [step, setShowNavbarOnResult]);

  // result 단계에서 status === 'ANALYZING'이면 /status 주기적으로 폴링해서 DONE 되면 자동 반영
  useEffect(() => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    if (step !== 'result' || status !== 'ANALYZING') return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await portfolioCorrectionControllerGetCorrectionStatus(id);
        const apiStatus = (
          res as { result?: { status?: CorrectionStatusResDTOStatus } }
        )?.result?.status;
        const { step: nextStep, status: nextStatus } =
          mapStatusToStepAndStatus(apiStatus);
        if (!cancelled) {
          setStep(nextStep);
          setStatus(nextStatus);
          if (nextStep === 'result' && nextStatus === 'ANALYZING') {
            timer = setTimeout(poll, 3000);
          }
        }
      } catch {
        if (!cancelled) {
          timer = setTimeout(poll, 3000);
        }
      }
    };

    timer = setTimeout(poll, 3000);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [effectiveId, step, status]);

  const handlePdfPortfoliosHydratedFromQuery = useCallback(
    (activities: PdfActivityBlock[]) => {
      setIsPdfTextExtracting(false);
      setIsPdfExtractFailed(false);
      setSelectedActivityId((currentId) =>
        activities.some((activity) => activity.id === currentId)
          ? currentId
          : (activities[0]?.id ?? currentId),
      );
    },
    [],
  );

  /** 이 correctionId에 대해 서버 데이터로 PDF UI 복원을 이미 적용했는지 (Strict Mode 이중 실행 방지) */
  const pdfPortfolioRestoreCompletedForIdRef = useRef<string>('');
  useEffect(() => {
    pdfPortfolioRestoreCompletedForIdRef.current = '';
  }, [effectiveId]);

  /**
   * 재진입: step === 'portfolio'인데 이미 추출 요청이 된 적 있으면
   * extractionStatus 기준으로 PDF 텍스트 정리 UI를 복원한다.
   *
   * - PENDING  → PDF + 스피너 (nonce 증가로 CorrectionPdfTextSection 폴링 개시)
   * - COMPLETED → PDF + 데이터 복원
   * - FAILED   → PDF + 재시도 버튼 (nonce 올리지 않아 showEmptyRetry 표시)
   * - undefined → 추출 요청 자체 없음 → 복원 안 함
   */
  useEffect(() => {
    if (isInitializing) return;
    if (step !== 'portfolio' || status !== 'DRAFT') return;
    if (!effectiveId) return;

    const id = Number(effectiveId);
    if (Number.isNaN(id) || id <= 0) return;
    if (pdfPortfolioRestoreCompletedForIdRef.current === effectiveId) return;

    let cancelled = false;
    externalPortfolioControllerGetSelectedPortfolios({ correctionId: id })
      .then((res) => {
        if (cancelled) return;
        if (res?.isSuccess === false) return;

        const extractionStatus = res?.result?.status;
        const originalFileName = res?.result?.originalFileName as
          | string
          | null
          | undefined;
        const portfolios = res?.result?.portfolios ?? [];

        // NONE → 추출 요청 전 → PDF 업로드 화면 유지
        if (!extractionStatus || extractionStatus === 'NONE') return;

        pdfPortfolioRestoreCompletedForIdRef.current = effectiveId;
        setIsPdfTextExtracted(true);
        setIsPdfTextExtracting(false);
        if (originalFileName) {
          setPdfUploadedFile({ name: originalFileName });
        }

        if (extractionStatus === 'GENERATING') {
          // 추출 중: 섹션만 열고 nonce 올려 폴링 개시
          setPdfExtractNonce((n) => n + 1);
          return;
        }

        if (extractionStatus === 'FAILED') {
          // 추출 실패: nonce 올리지 않음 → CorrectionPdfTextSection의 isFailed 표시
          setIsPdfExtractFailed(true);
          return;
        }

        // GENERATED: 구조화 데이터 복원
        if (portfolios.length > 0) {
          const activities = assignPlaceholderLabelsForEmptyPdfNames(
            portfolios
              .slice(0, PDF_MAX_ACTIVITY_COUNT)
              .map((dto, i) => mapToPdfActivityBlock(dto, i)),
          );
          setPdfActivities(activities);
          setPdfExtractNonce((n) => n + 1);
          handlePdfPortfoliosHydratedFromQuery(activities);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [
    effectiveId,
    handlePdfPortfoliosHydratedFromQuery,
    isInitializing,
    step,
    status,
  ]);

  const handlePdfExtractConfirm = useCallback(async () => {
    if (!pdfUploadedFile?.file) return;
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    const correctionId = id;
    setIsPdfExtractConfirmModalOpen(false);
    setIsPdfTextExtracting(true);
    setIsPdfExtractFailed(false);
    /* POST 전에 영역을 띄워야 스피너·조회 폴링 UI가 보임 (실패 시 아래 catch에서 되돌림) */
    setIsPdfTextExtracted(true);
    try {
      await externalPortfolioControllerExtractPortfolios({
        correctionId,
        file: pdfUploadedFile.file,
      });
      await queryClient.invalidateQueries({
        queryKey: getExternalPortfolioControllerGetSelectedPortfoliosQueryKey({
          correctionId,
        }),
      });
      setPdfExtractNonce((n) => n + 1);
      /* 구조화 결과는 비동기 — CorrectionPdfTextSection 조회 폴링 후 반영 */
    } catch {
      setIsPdfTextExtracting(false);
      setIsPdfExtractFailed(true);
      // 즉시 요청 실패도 텍스트 추출 실패 화면에서 다시 시도할 수 있게 유지한다.
      setIsPdfTextExtracted(true);
    }
  }, [pdfUploadedFile, effectiveId, queryClient]);

  const handleRequestPdfExtract = useCallback(() => {
    if (!sessionRestoreAttempted || !accessToken) {
      setIsPdfLoginRequiredModalOpen(true);
      return;
    }
    setIsPdfExtractConfirmModalOpen(true);
  }, [accessToken, sessionRestoreAttempted]);

  useEffect(() => {
    if (!isPdfLoginRequiredModalOpen) return;
    const timer = window.setTimeout(() => {
      const numericId = Number(effectiveId);
      const redirectTo = Number.isNaN(numericId)
        ? '/correction/new?resume=portfolio'
        : `${window.location.pathname}${window.location.search}`;
      router.push(`/login?redirect_to=${encodeURIComponent(redirectTo)}`);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [effectiveId, isPdfLoginRequiredModalOpen, router]);

  const handleRetryPdfExtract = useCallback(() => {
    if (!pdfUploadedFile?.file) {
      // 페이지 재진입 후에는 브라우저가 파일 객체를 복원할 수 없으므로 재업로드를 유도한다.
      setIsPdfTextExtracted(false);
      setIsPdfExtractFailed(false);
      setPdfUploadedFile(null);
      return;
    }
    void handlePdfExtractConfirm();
  }, [handlePdfExtractConfirm, pdfUploadedFile]);

  const handleDeletePdfActivity = useCallback(async () => {
    const targetId = activityDeleteTargetId;
    if (targetId === null) return;
    const activity = pdfActivities.find((a) => a.id === targetId);
    if (activity?.portfolioId != null) {
      try {
        await externalPortfolioControllerDeleteExternalPortfolio(
          activity.portfolioId,
        );
      } catch {
        return;
      }
    }
    setPdfActivities((prev) => {
      const next = prev.filter((a) => a.id !== targetId);
      setSelectedActivityId((id) =>
        next.some((a) => a.id === id) ? id : (next[0]?.id ?? id),
      );
      return next;
    });
    setActivityDeleteTargetId(null);
  }, [activityDeleteTargetId, pdfActivities]);

  const handleAddPdfActivity = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    if (pdfActivities.length >= PDF_MAX_ACTIVITY_COUNT) return;
    try {
      const res = await externalPortfolioControllerCreateExternalPortfolioBlock(
        {
          correctionId: id,
        },
      );
      const result = (
        res as ExternalPortfolioControllerCreateExternalPortfolioBlock200
      ).result;
      if (!result) throw new Error();
      const insertIndex = pdfActivities.length;
      const placeholderIndex = getNextPdfPlaceholderLabelIndex(pdfActivities);
      if (placeholderIndex == null) return;
      const newBlock: PdfActivityBlock = {
        ...mapToPdfActivityBlock(result, insertIndex),
        label: getPdfActivityPlaceholderLabel(placeholderIndex),
      };
      setPdfActivities((prev) => [...prev, newBlock]);
      setSelectedActivityId(newBlock.id);
    } catch {
      // 실패 시 무시
    }
  }, [effectiveId, pdfActivities.length]);

  const debouncedPatchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePdfActivityChange = useCallback((activity: PdfActivityBlock) => {
    if (activity.portfolioId == null) return;
    if (debouncedPatchRef.current) clearTimeout(debouncedPatchRef.current);
    debouncedPatchRef.current = setTimeout(() => {
      debouncedPatchRef.current = null;
      externalPortfolioControllerUpdateExternalPortfolio(
        activity.portfolioId!,
        toPatchBody(activity),
      ).catch(() => {});
    }, 500);
  }, []);

  const handleNextStep = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;

    if (step === 'portfolio') {
      const portfolioIds = pdfActivities
        .map((a) => a.portfolioId)
        .filter((n): n is number => n != null);
      if (portfolioIds.length === 0) return;
      try {
        await portfolioCorrectionControllerMapCorrectionWithPortfolios(id, {
          portfolioIds,
        });
        // 기업 분석 정보 생성 트리거 (실패해도 다음 단계로 진행)
        try {
          await portfolioCorrectionControllerCreateCompanyInsight(id);
        } catch {
          // ignore create-company-insight error; 분석 단계에서 재시도 가능
        }
        setStep('analysis');
      } catch {
        // 실패 시 단계 유지
      }
      return;
    }

    if (step === 'analysis') {
      if (!analysisInfoValue.trim()) {
        setShowAnalysisInfoWarning(true);
        return;
      }
      try {
        // 기업 분석 정보·강조 포인트를 백엔드에 저장 (실패해도 첨삭은 진행)
        try {
          await portfolioCorrectionControllerUpdateCompanyInsight(id, {
            companyInsight: analysisInfoValue.trim() || null,
            highlightPoint: emphasisPointsValue.trim() || null,
          });
        } catch {
          // ignore PATCH error
        }

        await portfolioCorrectionControllerCreateCorrectionByAI(id);
        const statusRes =
          await portfolioCorrectionControllerGetCorrectionStatus(id);
        const apiStatus = (
          statusRes as { result?: { status?: CorrectionStatusResDTOStatus } }
        )?.result?.status;
        const { step: nextStep, status: nextStatus } =
          mapStatusToStepAndStatus(apiStatus);
        setStep(nextStep);
        setStatus(nextStatus);
      } catch {
        // 실패 시 단계 유지
      }
    }
  }, [step, effectiveId, pdfActivities, analysisInfoValue]);

  const handleStartNewExperience = useCallback(() => {
    router.push('/experience/settings');
  }, [router]);

  /* 첨삭 생성 실패 시 다시 생성 요청 */
  const handleRetryAnalyzing = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    try {
      await portfolioCorrectionControllerCreateCorrectionByAI(id);
      const statusRes =
        await portfolioCorrectionControllerGetCorrectionStatus(id);
      const apiStatus = (
        statusRes as { result?: { status?: CorrectionStatusResDTOStatus } }
      )?.result?.status;
      const { step: nextStep, status: nextStatus } =
        mapStatusToStepAndStatus(apiStatus);
      setStep(nextStep);
      setStatus(nextStatus);
    } catch {
      // 실패 시 상태 유지(ANALYZING_FAILED)
    }
  }, [effectiveId]);

  const handleRetryCompanyInsight = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    await portfolioCorrectionControllerCreateCompanyInsight(id);
  }, [effectiveId]);

  const handlePdfFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') return;
      if (file.size > 10 * 1024 * 1024) {
        setPdfUploadError('too_large');
        setPdfShakeKey((k) => k + 1);
        return;
      }
      if (pdfUploadedFile) {
        setPdfUploadError('too_many');
        setPdfShakeKey((k) => k + 1);
        return;
      }
      setPdfUploadError(null);
      setPdfUploadedFile({ name: file.name, file });
      if (!accessToken) void savePendingCorrectionPdf(file);
    },
    [accessToken, pdfUploadedFile],
  );

  const handlePdfFileDelete = useCallback(() => {
    setPdfUploadedFile(null);
    setPdfUploadError(null);
    if (!accessToken) void clearPendingCorrectionPdf();
  }, [accessToken]);

  const layoutKey =
    pdfUploadError === 'too_large' || pdfUploadError === 'too_many'
      ? `pdf-shake-${pdfShakeKey}`
      : 'no-shake';
  const layoutWidth =
    step === 'result' ? 'w-[87rem] min-w-[87rem]' : 'w-[66rem] min-w-[66rem]';
  const layoutClassName = `mx-auto mt-[2.5rem] ${layoutWidth} ${pdfUploadError === 'too_large' || pdfUploadError === 'too_many' ? 'animate-shake' : ''}`;

  const pdfCategoryOverLimit = pdfActivities.some((a) =>
    a.categories.some(
      (c) =>
        c.bullets.reduce((s, b) => s + b.length, 0) >
        getPdfCategoryCharLimit(c.name),
    ),
  );

  return {
    router,
    step,
    status,
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
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
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
    isPdfTextExtracted,
    setIsPdfTextExtracted,
    isPdfTextExtracting,
    setIsPdfTextExtracting,
    isPdfExtractFailed,
    setIsPdfExtractFailed,
    pdfExtractNonce,
    handlePdfPortfoliosHydratedFromQuery,
    isPdfExtractConfirmModalOpen,
    setIsPdfExtractConfirmModalOpen,
    isPdfLoginRequiredModalOpen,
    pdfUploadedFile,
    setPdfUploadedFile,
    pdfUploadError,
    setPdfUploadError,
    isPdfDropOverlayActive,
    setIsPdfDropOverlayActive,
    pdfFileInputRef,
    fileDeleteConfirmTarget,
    setFileDeleteConfirmTarget,
    bulletTextareaRefs,
    lastBulletEnterAt,
    analysisInfoValue,
    setAnalysisInfoValue,
    showAnalysisInfoWarning,
    setShowAnalysisInfoWarning,
    emphasisPointsValue,
    setEmphasisPointsValue,
    limitAllowedInput,
    handleNextStep,
    handleStartNewExperience,
    handleRetryAnalyzing,
    handleRetryCompanyInsight,
    handlePdfFile,
    handlePdfFileDelete,
    handleRequestPdfExtract,
    handlePdfExtractConfirm,
    handleRetryPdfExtract,
    handleDeletePdfActivity,
    handleAddPdfActivity,
    handlePdfActivityChange,
    layoutKey,
    layoutClassName,
    pdfCategoryOverLimit,
    isInitializing,
  };
}

export type UseCorrectionStateReturn = ReturnType<typeof useCorrectionState>;

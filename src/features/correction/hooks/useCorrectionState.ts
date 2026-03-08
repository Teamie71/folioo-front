'use client';

import {
  externalPortfolioControllerCreateExternalPortfolioBlock,
  externalPortfolioControllerDeleteExternalPortfolio,
  externalPortfolioControllerExtractPortfolios,
  externalPortfolioControllerGetExternalPortfolios,
  externalPortfolioControllerUpdateExternalPortfolio,
} from '@/api/endpoints/portfolio/portfolio';
import {
  portfolioCorrectionControllerMapCorrectionWithPortfolios,
  portfolioCorrectionControllerCreateCorrectionByAI,
  portfolioCorrectionControllerGetCorrectionStatus,
  portfolioCorrectionControllerCreateCompanyInsight,
  portfolioCorrectionControllerUpdateCompanyInsight,
  portfolioCorrectionControllerUpdateCorrectionTitle,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import type {
  CorrectionStatusResDTOStatus,
  ExternalPortfolioControllerGetExternalPortfolios200,
  ExternalPortfolioControllerCreateExternalPortfolioBlock200,
} from '@/api/models';
import { useExperienceControllerGetExperiences } from '@/api/endpoints/experience/experience';
import { mapToPdfActivityBlock, toPatchBody } from '@/services/correction';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCorrectionNavbar } from '@/contexts/CorrectionNavbarContext';
import { useAuthStore } from '@/store/useAuthStore';
import {
  INITIAL_PDF_ACTIVITIES,
  PDF_CATEGORY_CHAR_LIMIT,
} from '@/features/correction/constants';
import { getHopeJobLabel } from '@/constants/hopeJob';
import type {
  FileDeleteConfirmTarget,
  PdfActivityBlock,
  PdfCategoryName,
  PortfolioType,
  Status,
  Step,
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
    case 'DONE':
      return { step: 'result', status: 'DONE' };
    case 'NOT_STARTED':
    default:
      return { step: 'portfolio', status: 'DRAFT' };
  }
}

export function useCorrectionState(correctionId: string | undefined) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('portfolio');
  const effectiveId = correctionId ?? EMPTY_CORRECTION_ID;
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
  const [selectedTextPortfolioIds, setSelectedTextPortfolioIds] = useState<string[]>([]);
  const [title, setTitle] = useState('새로운 포트폴리오 첨삭');
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
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] =
    useState<FileDeleteConfirmTarget>(null);

  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: experiencesData } = useExperienceControllerGetExperiences(
    undefined,
    {
      query: {
        // 토큰이 있을 때만 호출 (세션 복원 전 요청 시 401 방지)
        enabled:
          !!accessToken &&
          step === 'portfolio' &&
          selectedPortfolioType === 'text',
      },
    },
  );
  const experiencesList = experiencesData?.result ?? [];
  const textPortfolios = experiencesList.map((e) => ({
    id: String(e.id),
    title: e.name,
    tag: getHopeJobLabel(e.hopeJob),
    date: e.createdAt.slice(0, 10),
  }));

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

  // correctionId 있을 때 GET /status로 step·status 복원
  useEffect(() => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    portfolioCorrectionControllerGetCorrectionStatus(id)
      .then((res) => {
        const apiStatus = (res as { result?: { status?: CorrectionStatusResDTOStatus } })?.result?.status;
        const { step: nextStep, status: nextStatus } = mapStatusToStepAndStatus(apiStatus);
        setStep(nextStep);
        setStatus(nextStatus);
      })
      .catch(() => {});
  }, [effectiveId]);

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

  const handlePdfExtractConfirm = useCallback(async () => {
    if (!pdfUploadedFile) return;
    setIsPdfExtractConfirmModalOpen(false);
    setIsPdfTextExtracting(true);
    try {
      await externalPortfolioControllerExtractPortfolios({
        file: pdfUploadedFile.file,
      });
      setIsPdfTextExtracted(true);
      const id = effectiveId ? Number(effectiveId) : null;
      if (id != null && !Number.isNaN(id)) {
        const listRes =
          await externalPortfolioControllerGetExternalPortfolios({
            correctionId: id,
          });
        const listResult = (listRes as ExternalPortfolioControllerGetExternalPortfolios200)
          .result;
        const activities = (listResult ?? []).map((dto, i) =>
          mapToPdfActivityBlock(dto, i),
        );
        setPdfActivities(activities);
        if (activities.length > 0) setSelectedActivityId(activities[0].id);
      }
    } catch {
      // 실패 시 상태만 복구
    } finally {
      setIsPdfTextExtracting(false);
    }
  }, [pdfUploadedFile, effectiveId]);

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
        next.some((a) => a.id === id) ? id : next[0]?.id ?? id,
      );
      return next;
    });
    setActivityDeleteTargetId(null);
  }, [activityDeleteTargetId, pdfActivities]);

  const handleAddPdfActivity = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;
    if (pdfActivities.length >= 5) return;
    try {
      const res = await externalPortfolioControllerCreateExternalPortfolioBlock({
        correctionId: id,
      });
      const result = (res as ExternalPortfolioControllerCreateExternalPortfolioBlock200)
        .result;
      if (!result) throw new Error();
      const newBlock = mapToPdfActivityBlock(result, pdfActivities.length);
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
      externalPortfolioControllerUpdateExternalPortfolio(activity.portfolioId!, toPatchBody(activity)).catch(
        () => {},
      );
    }, 500);
  }, []);

  const handleNextStep = useCallback(async () => {
    const id = effectiveId ? Number(effectiveId) : null;
    if (id == null || Number.isNaN(id)) return;

    if (step === 'portfolio') {
      if (
        selectedPortfolioType === 'text' &&
        selectedTextPortfolioIds.length === 0
      ) {
        // 텍스트형 포트폴리오가 0개일 때는 에러 메시지 없이 버튼만 비활성화
        if (textPortfolios.length > 0) setShowTextPortfolioWarning(true);
        return;
      }
      const portfolioIds =
        selectedPortfolioType === 'pdf'
          ? pdfActivities
              .map((a) => a.portfolioId)
              .filter((n): n is number => n != null)
          : selectedTextPortfolioIds
              .map((s) => Number(s))
              .filter((n) => !Number.isNaN(n));
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
  }, [
    step,
    effectiveId,
    selectedPortfolioType,
    selectedTextPortfolioIds,
    textPortfolios.length,
    pdfActivities,
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

  const layoutKey =
    pdfUploadError === 'too_large' || pdfUploadError === 'too_many'
      ? `pdf-shake-${pdfShakeKey}`
      : 'no-shake';
  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${pdfUploadError === 'too_large' || pdfUploadError === 'too_many' ? 'animate-shake' : ''}`;

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
    title,
    setTitle,
    isEditingTitle,
    setIsEditingTitle,
    textPortfolios,
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
    isPdfExtractConfirmModalOpen,
    setIsPdfExtractConfirmModalOpen,
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
    showTextPortfolioWarning,
    setShowTextPortfolioWarning,
    analysisInfoValue,
    setAnalysisInfoValue,
    showAnalysisInfoWarning,
    setShowAnalysisInfoWarning,
    emphasisPointsValue,
    setEmphasisPointsValue,
    limitAllowedInput,
    handleNextStep,
    handleStartNewExperience,
    handlePortfolioSelect,
    handlePdfFile,
    handlePdfExtractConfirm,
    handleDeletePdfActivity,
    handleAddPdfActivity,
    handlePdfActivityChange,
    layoutKey,
    layoutClassName,
    pdfCategoryOverLimit,
  };
}

export type UseCorrectionStateReturn = ReturnType<typeof useCorrectionState>;

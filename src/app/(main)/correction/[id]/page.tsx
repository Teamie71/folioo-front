'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { useCorrectionNavbar } from '@/contexts/CorrectionNavbarContext';
import {
  INITIAL_PDF_ACTIVITIES,
  PDF_CATEGORY_CHAR_LIMIT,
} from '@/features/correction/constants';
import { CorrectionAnalyzingView } from '@/features/correction/components/CorrectionAnalyzingView';
import { CorrectionInformationStep } from '@/features/correction/components/CorrectionInformationStep';
import { CorrectionPortfolioStep } from '@/features/correction/components/CorrectionPortfolioStep';
import { CorrectionAnalysisStep } from '@/features/correction/components/CorrectionAnalysisStep';
import { CorrectionResultStep } from '@/features/correction/components/CorrectionResultStep';
import { CorrectionLayout } from '@/features/correction/components/CorrectionLayout';
import { CorrectionPageHeader } from '@/features/correction/components/CorrectionPageHeader';
import type {
  PdfActivityBlock,
  PdfCategoryName,
  PortfolioType,
  Status,
  Step,
} from '@/types/correction';

export default function CorrectionSettingsPage() {
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
  const [isUnclassifiedOpen, setIsUnclassifiedOpen] = useState(false);
  const [selectedUnclassifiedTab, setSelectedUnclassifiedTab] = useState<
    '상세정보' | '담당업무' | '문제해결' | '배운 점'
  >('상세정보');
  const [selectedTextPortfolioIds, setSelectedTextPortfolioIds] = useState<
    string[]
  >([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const textPortfolios = [
    {
      id: 'text-1',
      title: '데이터 통계 경진대회',
      tag: '데이터',
      date: '2000-00-00',
    },
    {
      id: 'text-2',
      title: '공공 디자인 공모전',
      tag: '디자인',
      date: '2000-00-00',
    },
    {
      id: 'text-3',
      title: '00기업 서포터즈 활동',
      tag: '미정',
      date: '2000-00-00',
    },
  ];
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
  const [pdfUploadedFile, setPdfUploadedFile] = useState<{ name: string } | null>(
    null,
  );
  const [pdfUploadError, setPdfUploadError] = useState<
    null | 'too_large' | 'too_many'
  >(null);
  const [pdfShakeKey, setPdfShakeKey] = useState(0);
  const [isPdfDropOverlayActive, setIsPdfDropOverlayActive] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const bulletTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const lastBulletEnterAt = useRef<number>(0);
  const [showTextPortfolioWarning, setShowTextPortfolioWarning] = useState(false);
  const [analysisInfoValue, setAnalysisInfoValue] = useState('');
  const [showAnalysisInfoWarning, setShowAnalysisInfoWarning] = useState(false);
  const [emphasisPointsValue, setEmphasisPointsValue] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jdUploadedFiles, setJdUploadedFiles] = useState<
    Array<{ name: string; size: number; previewUrl: string }>
  >([]);
  const [fileDeleteConfirmTarget, setFileDeleteConfirmTarget] = useState<
    { type: 'jd'; index: number } | { type: 'pdf' } | null
  >(null);
  const hasJdImageUploaded = jdUploadedFiles.length >= 1;
  const [jdViewerFileIndex, setJdViewerFileIndex] = useState<number | null>(null);
  const [isJdDropOverlayActive, setIsJdDropOverlayActive] = useState(false);
  const jdFileInputRef = useRef<HTMLInputElement>(null);
  const [informationErrors, setInformationErrors] = useState<{
    companyName: boolean;
    jobTitle: boolean;
    jobDescription: boolean;
  }>({ companyName: false, jobTitle: false, jobDescription: false });
  const [jdImageError, setJdImageError] = useState<
    null | 'required' | 'too_large' | 'too_many'
  >(null);
  const [jdShakeKey, setJdShakeKey] = useState(0);

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

  // 첨삭 결과 단계에서만 Navbar 표시
  const { setShowNavbarOnResult } = useCorrectionNavbar() ?? {};
  useEffect(() => {
    setShowNavbarOnResult?.(step === 'result');
  }, [step, setShowNavbarOnResult]);

  // PDF 텍스트 추출 로딩 시뮬레이션
  useEffect(() => {
    if (!isPdfTextExtracting) return;
    const timer = setTimeout(() => setIsPdfTextExtracting(false), 2500);
    return () => clearTimeout(timer);
  }, [isPdfTextExtracting]);

  const handleStartCorrectionClick = () => {
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
  };

  const handleNextStep = () => {
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
      // TODO: 백엔드 연동 시 API 호출
      setStatus('ANALYZING');
      // 분석 완료 후
      setTimeout(() => {
        setStatus('DONE');
        setStep('result');
      }, 2000);
    }
  };

  const handleStartNewExperience = () => {
    router.push('/experience/settings');
  };

  /** 한국어·영어·숫자·공백·특수문자만 허용, 최대 길이 적용 (기업명/직무명/기업분석/강조포인트 공통) */
  const limitAllowedInput = (value: string, maxLength: number) =>
    value
      .replace(
        /[^\uAC00-\uD7A3\u3130-\u318Ea-zA-Z0-9\s.,\-'()\/&·!?@#%+*<>]/g,
        '',
      )
      .slice(0, maxLength);

  const handlePortfolioSelect = (type: PortfolioType) => {
    setSelectedPortfolioType(type);
    setShowTextPortfolioWarning(false);
    // 포트폴리오 타입 전환 시 텍스트형 선택 상태 초기화
    setSelectedTextPortfolioIds([]);
    // PDF에서 다른 타입으로 전환 시 텍스트 추출 상태 초기화
    if (type !== 'pdf') {
      setIsPdfTextExtracted(false);
      setPdfUploadedFile(null);
      setPdfUploadError(null);
    }
  };

  const handlePdfFile = (file: File) => {
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
    setPdfUploadedFile({ name: file.name });
  };

  const handleJdImageFile = (file: File) => {
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
    if (jdUploadedFiles.length >= 2) {
      setJdImageError('too_many');
      setJdShakeKey((k) => k + 1);
      setInformationErrors((prev) => ({ ...prev, jobDescription: true }));
      return;
    }
    setJdImageError(null);
    setInformationErrors((prev) => ({ ...prev, jobDescription: false }));
    setJdUploadedFiles((prev) => [
      ...prev,
      {
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      },
    ]);
  };

  const handlePasteJdImageFromClipboard = async () => {
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
  };

  const removeJdFileAt = (index: number) => {
    setJdUploadedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index]?.previewUrl) URL.revokeObjectURL(prev[index].previewUrl);
      return next;
    });
    setJdImageError(null);
    if (jdViewerFileIndex === index) setJdViewerFileIndex(null);
    else if (jdViewerFileIndex !== null && jdViewerFileIndex > index)
      setJdViewerFileIndex((i) => (i === null ? null : i - 1));
  };

  const layoutKey =
    pdfUploadError === 'too_large' || pdfUploadError === 'too_many'
      ? `pdf-shake-${pdfShakeKey}`
      : jdImageError === 'too_large' || jdImageError === 'too_many'
        ? `jd-shake-${jdShakeKey}`
        : 'no-shake';
  const layoutClassName = `mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${jdImageError === 'too_large' || jdImageError === 'too_many' || pdfUploadError === 'too_large' || pdfUploadError === 'too_many' ? 'animate-shake' : ''}`;

  return (
    <CorrectionLayout
      layoutKey={layoutKey}
      layoutClassName={layoutClassName}
      onDragEnter={
        step === 'information' && jdMode === 'image'
          ? (e) => {
              if (e.dataTransfer.types.includes('Files'))
                setIsJdDropOverlayActive(true);
            }
          : step === 'portfolio' && selectedPortfolioType === 'pdf'
            ? (e) => {
                if (e.dataTransfer.types.includes('Files'))
                  setIsPdfDropOverlayActive(true);
              }
            : undefined
      }
      jdDropOverlay={{
        active: step === 'information' && jdMode === 'image' && isJdDropOverlayActive,
        onDrop: handleJdImageFile,
        onClose: () => setIsJdDropOverlayActive(false),
      }}
      pdfDropOverlay={{
        active:
          step === 'portfolio' &&
          selectedPortfolioType === 'pdf' &&
          isPdfDropOverlayActive,
        onDrop: handlePdfFile,
        onClose: () => setIsPdfDropOverlayActive(false),
      }}
      header={
        <CorrectionPageHeader
          step={step}
          onBackClick={() => {
            if (step === 'information') {
              setIsQuitModalOpen(true);
            } else {
              router.replace('/correction');
            }
          }}
          quitModal={{
            open: isQuitModalOpen,
            onOpenChange: setIsQuitModalOpen,
            onConfirm: () => {
              setIsQuitModalOpen(false);
              router.replace('/correction');
            },
          }}
          fileDeleteModal={{
            target: fileDeleteConfirmTarget,
            onOpenChange: (open) => !open && setFileDeleteConfirmTarget(null),
            onConfirm: () => {
              if (fileDeleteConfirmTarget === null) return;
              if (fileDeleteConfirmTarget.type === 'jd') {
                removeJdFileAt(fileDeleteConfirmTarget.index);
              } else {
                setPdfUploadedFile(null);
                setPdfUploadError(null);
              }
              setFileDeleteConfirmTarget(null);
            },
          }}
          activityDeleteModal={{
            targetId: activityDeleteTargetId,
            onOpenChange: (open) => !open && setActivityDeleteTargetId(null),
            onConfirm: () => {
              if (activityDeleteTargetId === null) return;
              setPdfActivities((prev) => {
                const next = prev.filter(
                  (a) => a.id !== activityDeleteTargetId,
                );
                setSelectedActivityId((id) =>
                  next.some((a) => a.id === id) ? id : next[0]?.id ?? id,
                );
                return next;
              });
              setActivityDeleteTargetId(null);
            },
          }}
          titleEdit={{
            title: '새로운 포트폴리오 첨삭',
            isEditing: isEditingTitle,
            editable: step !== 'information',
            onEdit: () => setIsEditingTitle(true),
            onSave: () => setIsEditingTitle(false),
          }}
          showDeleteButton={step !== 'information'}
          deleteModal={{
            open: isDeleteModalOpen,
            onOpenChange: setIsDeleteModalOpen,
            onConfirm: () => {
              setIsDeleteModalOpen(false);
              router.replace('/correction');
            },
          }}
          startCorrectionModal={{
            open: isStartCorrectionModalOpen,
            onOpenChange: setIsStartCorrectionModalOpen,
            onConfirm: () => {
              setIsStartCorrectionModalOpen(false);
              handleNextStep();
            },
          }}
          pdfExtractModal={{
            open: isPdfExtractConfirmModalOpen,
            onOpenChange: setIsPdfExtractConfirmModalOpen,
            onConfirm: () => {
              setIsPdfExtractConfirmModalOpen(false);
              setIsPdfTextExtracted(true);
              setIsPdfTextExtracting(true);
            },
          }}
          jdViewer={{
            previewUrl:
              jdViewerFileIndex != null && jdUploadedFiles[jdViewerFileIndex]
                ? jdUploadedFiles[jdViewerFileIndex].previewUrl
                : null,
            onClose: () => setJdViewerFileIndex(null),
          }}
        />
      }
      progressOrDivider={
        step === 'result' ? (
          <div className='flex flex-col gap-[0.75rem] pb-[6.25rem]'>
            <div className='h-[1px] w-full bg-[#9EA4A9]' />
          </div>
        ) : (
          <CorrectionProgressBar step={step} status={status} />
        )
      }
    >
      <div className='flex flex-col gap-[3.75rem]'>
        {status === 'ANALYZING' ? (
          <CorrectionAnalyzingView
            onLeaveClick={() => router.replace('/correction')}
          />
        ) : step === 'information' ? (
          <CorrectionInformationStep
            companyName={companyName}
            onCompanyNameChange={(next) => {
              setCompanyName(next);
              if (informationErrors.companyName)
                setInformationErrors((prev) => ({ ...prev, companyName: false }));
            }}
            jobTitle={jobTitle}
            onJobTitleChange={(next) => {
              setJobTitle(next);
              if (informationErrors.jobTitle)
                setInformationErrors((prev) => ({ ...prev, jobTitle: false }));
            }}
            jobDescription={jobDescription}
            onJobDescriptionChange={(next) => {
              setJobDescription(next);
              if (informationErrors.jobDescription)
                setInformationErrors((prev) => ({
                  ...prev,
                  jobDescription: false,
                }));
            }}
            jdMode={jdMode}
            onJdModeChange={(value) => {
              setJdMode(value);
              if (value === 'image') {
                setJdImageError(null);
                setJdViewerFileIndex(null);
                setJdUploadedFiles((prev) => {
                  prev.forEach((f) => {
                    if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
                  });
                  return [];
                });
              }
            }}
            informationErrors={informationErrors}
            jdImageError={jdImageError}
            jdShakeKey={jdShakeKey}
            jdUploadedFiles={jdUploadedFiles}
            limitAllowedInput={limitAllowedInput}
            onStartCorrectionClick={handleStartCorrectionClick}
            jdFileInputRef={jdFileInputRef}
            onRequestFileDelete={(index) =>
              setFileDeleteConfirmTarget({ type: 'jd', index })
            }
            onRequestJdViewer={setJdViewerFileIndex}
            onJdImageFile={handleJdImageFile}
            onPasteJdImage={handlePasteJdImageFromClipboard}
          />
        ) : step === 'portfolio' ? (
          <CorrectionPortfolioStep
            selectedPortfolioType={selectedPortfolioType}
            onPortfolioSelect={handlePortfolioSelect}
            showTextPortfolioWarning={showTextPortfolioWarning}
            textPortfolios={textPortfolios}
            selectedTextPortfolioIds={selectedTextPortfolioIds}
            onTextPortfolioToggle={(portfolioId) => {
              setShowTextPortfolioWarning(false);
              setSelectedTextPortfolioIds((prev) =>
                prev.includes(portfolioId)
                  ? prev.filter((id) => id !== portfolioId)
                  : [...prev, portfolioId],
              );
            }}
            pdfUploadedFile={pdfUploadedFile}
            pdfUploadError={pdfUploadError}
            pdfFileInputRef={pdfFileInputRef}
            onPdfFileSelect={handlePdfFile}
            onRequestPdfFileDelete={() =>
              setFileDeleteConfirmTarget({ type: 'pdf' })
            }
            onRequestPdfExtract={() => setIsPdfExtractConfirmModalOpen(true)}
            isPdfTextExtracted={isPdfTextExtracted}
            isPdfTextExtracting={isPdfTextExtracting}
            pdfActivities={pdfActivities}
            setPdfActivities={setPdfActivities}
            selectedActivityId={selectedActivityId}
            onActivitySelect={setSelectedActivityId}
            selectedTab={selectedTab}
            onTabSelect={setSelectedTab}
            bulletTextareaRefs={bulletTextareaRefs}
            lastBulletEnterAt={lastBulletEnterAt}
            onRequestActivityDelete={setActivityDeleteTargetId}
            pdfActivityHoverId={pdfActivityHoverId}
            setPdfActivityHoverId={setPdfActivityHoverId}
            handleNextStep={handleNextStep}
            pdfCategoryOverLimit={
              selectedPortfolioType === 'pdf' &&
              pdfActivities.some((a) =>
                a.categories.some(
                  (c) =>
                    c.bullets.reduce((s, b) => s + b.length, 0) >
                    PDF_CATEGORY_CHAR_LIMIT,
                ),
              )
            }
          />
        ) : step === 'analysis' ? (
          <CorrectionAnalysisStep
            analysisInfoValue={analysisInfoValue}
            onAnalysisInfoChange={(value) => {
              setAnalysisInfoValue(value);
              setShowAnalysisInfoWarning(false);
            }}
            showAnalysisInfoWarning={showAnalysisInfoWarning}
            emphasisPointsValue={emphasisPointsValue}
            onEmphasisPointsChange={setEmphasisPointsValue}
            limitAllowedInput={limitAllowedInput}
            onNextStep={handleNextStep}
          />
        ) : (
          <CorrectionResultStep
            status={status}
            resultTab={resultTab}
            onResultTabChange={setResultTab}
            detailInfoButton={detailInfoButton}
            setDetailInfoButton={setDetailInfoButton}
            responsibilityButton={responsibilityButton}
            setResponsibilityButton={setResponsibilityButton}
            problemSolvingButton={problemSolvingButton}
            setProblemSolvingButton={setProblemSolvingButton}
            lessonsButton={lessonsButton}
            setLessonsButton={setLessonsButton}
            onStartNewExperience={handleStartNewExperience}
          />
        )}
      </div>

      {step === 'result' && <FeedbackFloatingButton />}
    </CorrectionLayout>
  );
}

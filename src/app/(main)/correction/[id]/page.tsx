'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioCard } from '@/components/PortfolioCard';
import { PortfolioTypeCard } from '@/components/PortfolioTypeCard';
import { BackButton } from '@/components/BackButton';
import { DeleteButton } from '@/components/DeleteButton';
import { CommonModal } from '@/components/CommonModal';
import { InlineEdit } from '@/components/InlineEdit';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { ToggleSmall } from '@/components/ToggleSmall';
import { ToggleLarge } from '@/components/ToggleLarge';
import InputArea from '@/components/InputArea';
import TextField from '@/components/TextField';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { CorrectionIcon } from '@/components/icons/CorrectionIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { FileCloseIcon } from '@/components/icons/FileCloseIcon';
import { FileImageIcon } from '@/components/icons/FileImageIcon';
import { FullIcon } from '@/components/icons/FullIcon';
import { PdfIcon } from '@/components/icons/PdfIcon';

type Step = 'information' | 'portfolio' | 'analysis' | 'result';
type Status = 'DRAFT' | 'ANALYZING' | 'DONE';
type PortfolioType = 'text' | 'pdf';

export default function CorrectionSettingsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('information');
  const [status, setStatus] = useState<Status>('DRAFT');
  const [jdMode, setJdMode] = useState<'text' | 'image'>('text');
  const [selectedPortfolioType, setSelectedPortfolioType] =
    useState<PortfolioType | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<'A' | 'B' | 'C'>(
    'A',
  );
  const [selectedTab, setSelectedTab] = useState<
    '상세정보' | '담당업무' | '문제해결' | '배운 점'
  >('상세정보');
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
  const [pdfUploadedFile, setPdfUploadedFile] = useState<{ name: string } | null>(
    null,
  );
  const [pdfUploadError, setPdfUploadError] = useState<
    null | 'too_large' | 'too_many'
  >(null);
  const [pdfShakeKey, setPdfShakeKey] = useState(0);
  const [isPdfDropOverlayActive, setIsPdfDropOverlayActive] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const [showTextPortfolioWarning, setShowTextPortfolioWarning] = useState(false);
  const [analysisInfoValue, setAnalysisInfoValue] = useState('');
  const [showAnalysisInfoWarning, setShowAnalysisInfoWarning] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jdUploadedFiles, setJdUploadedFiles] = useState<
    Array<{ name: string; size: number; previewUrl: string }>
  >([]);
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

  /** 지원 기업명/직무명: 최대 20자, 한국어·영어·숫자·공백·특수문자만 허용 */
  const limitCompanyOrJobInput = (value: string) =>
    value
      .replace(
        /[^\uAC00-\uD7A3\u3130-\u318Ea-zA-Z0-9\s.,\-'()\/&·!?@#%+*<>]/g,
        '',
      )
      .slice(0, 20);

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

  return (
    <div
      key={
        pdfUploadError === 'too_large' || pdfUploadError === 'too_many'
          ? `pdf-shake-${pdfShakeKey}`
          : jdImageError === 'too_large' || jdImageError === 'too_many'
            ? `jd-shake-${jdShakeKey}`
            : 'no-shake'
      }
      className={`mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem] ${jdImageError === 'too_large' || jdImageError === 'too_many' || pdfUploadError === 'too_large' || pdfUploadError === 'too_many' ? 'animate-shake' : ''}`}
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
    >
      {/* JD 이미지 전체 페이지 드롭 오버레이 (이미지 모드 + 드래그 중일 때만) */}
      {step === 'information' && jdMode === 'image' && isJdDropOverlayActive && (
        <div
          className='fixed inset-0 z-40'
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDragLeave={() => setIsJdDropOverlayActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsJdDropOverlayActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleJdImageFile(file);
          }}
        />
      )}

      {/* PDF 전체 페이지 드롭 오버레이 (포트폴리오 PDF 선택 + 드래그 중일 때만) */}
      {step === 'portfolio' &&
        selectedPortfolioType === 'pdf' &&
        isPdfDropOverlayActive && (
          <div
            className='fixed inset-0 z-40'
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDragLeave={() => setIsPdfDropOverlayActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsPdfDropOverlayActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                // 드래그앤드롭에서도 동일하게 10MB 초과 / 2개 초과 시 흔들림+오류메시지 적용
                handlePdfFile(file);
              }
            }}
          />
        )}
      <div className='flex flex-col gap-[0.75rem]'>
        {/* 헤더 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[0.75rem]'>
            <BackButton onClick={() => setIsQuitModalOpen(true)} />
            <CommonModal
              open={isQuitModalOpen}
              onOpenChange={setIsQuitModalOpen}
              title='이 첨삭을 정말 그만두시겠습니까?'
              description='지금 돌아가면, 작성하신 내용이 저장되지 않아요.'
              cancelBtnText='취소'
              secondaryBtnText='그만두기'
              onSecondaryClick={() => {
                setIsQuitModalOpen(false);
                router.push('/correction');
              }}
            />
            <InlineEdit
              title='새로운 포트폴리오 첨삭'
              isEditing={isEditingTitle}
              editable={step !== 'information'}
              onEdit={() => {
                // TODO: 포트폴리오 첨삭 명 수정 모드로 전환
                setIsEditingTitle(true);
              }}
              onSave={() => {
                // TODO: 포트폴리오 첨삭 명 저장 API 호출
                setIsEditingTitle(false);
              }}
            />
          </div>
          {/* 삭제 버튼 (information 단계에서는 숨김) */}
          {step !== 'information' && (
            <DeleteButton onClick={() => setIsDeleteModalOpen(true)} />
          )}
          <CommonModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title='이 첨삭을 정말 삭제하시겠습니까?'
            cancelBtnText='취소'
            secondaryBtnText='삭제'
            onSecondaryClick={() => {
              setIsDeleteModalOpen(false);
              router.push('/correction');
            }}
          />
            <CommonModal
              open={isStartCorrectionModalOpen}
              onOpenChange={setIsStartCorrectionModalOpen}
              title={
                <>
                  포트폴리오 첨삭 1회권을 사용하여
                  <br />
                  진행하시겠습니까?
                </>
              }
              cancelBtnText='취소'
              primaryBtnText='진행'
              onPrimaryClick={() => {
                setIsStartCorrectionModalOpen(false);
                handleNextStep();
              }}
              className='max-w-[24.75rem] items-center px-[5rem] py-[3.75rem] text-center'
            />

            {/* JD 이미지 전체보기 뷰어 */}
            {jdViewerFileIndex !== null && jdUploadedFiles[jdViewerFileIndex] && (
              <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
                role='dialog'
                aria-modal='true'
                aria-label='JD 이미지 전체보기'
                onClick={() => setJdViewerFileIndex(null)}
              >
                <div
                  className='flex max-h-full max-w-full items-center justify-center'
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={jdUploadedFiles[jdViewerFileIndex].previewUrl}
                    alt='JD 미리보기 전체'
                    className='max-h-[90vh] max-w-full object-contain'
                  />
                </div>
              </div>
            )}
        </div>

        {step === 'result' ? (
          <div className='flex flex-col gap-[0.75rem] pb-[3.375rem]'>
            <div className='h-[1px] w-full bg-[#9EA4A9]' />
          </div>
        ) : (
          <CorrectionProgressBar step={step} status={status} />
        )}
      </div>

      <div className='flex flex-col gap-[3.75rem]'>
        {status === 'ANALYZING' ? (
          <div className='flex flex-col items-center justify-center gap-[2rem] py-[10rem]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='56'
              height='60'
              viewBox='0 0 56 60'
              fill='none'
            >
              <path
                opacity='0.1'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M28 8C22.6957 8 17.6086 10.1071 13.8579 13.8579C10.1071 17.6086 8 22.6957 8 28C8 33.3043 10.1071 38.3914 13.8579 42.1421C17.6086 45.8929 22.6957 48 28 48C33.3043 48 38.3914 45.8929 42.1421 42.1421C45.8929 38.3914 48 33.3043 48 28C48 22.6957 45.8929 17.6086 42.1421 13.8579C38.3914 10.1071 33.3043 8 28 8ZM0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z'
                fill='#74777D'
              />
              <g
                className='animate-spin'
                style={{ transformOrigin: '28px 28px' }}
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M28.0007 8.00003C22.8444 7.989 17.8852 9.9805 14.1687 13.5547C13.3987 14.2666 12.3801 14.6477 11.3319 14.6159C10.2838 14.5841 9.29007 14.142 8.56467 13.3848C7.83927 12.6276 7.44023 11.6158 7.45344 10.5673C7.46666 9.51879 7.89108 8.51738 8.63534 7.7787C13.8408 2.77773 20.7822 -0.0105164 28.0007 2.98087e-05C29.0615 2.98087e-05 30.079 0.421457 30.8291 1.1716C31.5792 1.92175 32.0007 2.93916 32.0007 4.00003C32.0007 5.0609 31.5792 6.07831 30.8291 6.82846C30.079 7.5786 29.0615 8.00003 28.0007 8.00003Z'
                  fill='url(#paint0_linear_3242_3790)'
                />
              </g>
              <defs>
                <linearGradient
                  id='paint0_linear_3242_3790'
                  x1='19.7269'
                  y1='0'
                  x2='19.7269'
                  y2='14.6177'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stopColor='#93B3F4' />
                  <stop offset='1' stopColor='#5060C5' />
                </linearGradient>
              </defs>
            </svg>
            <div className='flex flex-col items-center text-center'>
              <span className='text-[1.125rem] font-bold leading-[1.3] text-#464B53]'>
                AI 컨설턴트가 포트폴리오 첨삭을 진행 중이에요.
              </span>
              <span className='text-[1.125rem] font-bold leading-[1.3] text-#464B53]'>
                페이지를 떠나도 작업은 계속돼요.
              </span>
            </div>
          </div>
        ) : step === 'information' ? (
          <>
            {/* 지원 기업명 및 지원 직무명 입력 */}
            <div className='grid grid-cols-2 gap-[1.5rem]'>
              {/* 지원 기업명 입력 */}
              <div className='flex flex-col gap-[0.5rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>지원 기업명</span>
                  <span className='text-[#DC0000]'>*</span>
                </div>
                {informationErrors.companyName && (
                  <p className='text-[0.875rem] text-[#DC0000]'>
                    지원 기업명을 입력해주세요.
                  </p>
                )}
                <InputArea
                  placeholder='기업명을 입력해주세요.'
                  value={companyName}
                  maxLength={20}
                  onChange={(e) => {
                    const next = limitCompanyOrJobInput(e.target.value);
                    setCompanyName(next);
                    if (informationErrors.companyName)
                      setInformationErrors((prev) => ({
                        ...prev,
                        companyName: false,
                      }));
                  }}
                />
              </div>

              {/* 지원 직무명 입력 */}
              <div className='flex flex-col gap-[0.5rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>지원 직무명</span>
                  <span className='text-[#DC0000]'>*</span>
                </div>
                {informationErrors.jobTitle && (
                  <p className='text-[0.875rem] text-[#DC0000]'>
                    지원 직무명을 입력해주세요.
                  </p>
                )}
                <InputArea
                  placeholder='직무명을 입력해주세요.'
                  value={jobTitle}
                  maxLength={20}
                  onChange={(e) => {
                    const next = limitCompanyOrJobInput(e.target.value);
                    setJobTitle(next);
                    if (informationErrors.jobTitle)
                      setInformationErrors((prev) => ({
                        ...prev,
                        jobTitle: false,
                      }));
                  }}
                />
              </div>
            </div>

            {/* Job Description (1MB 초과 시 흔들림 - 클릭/드래그앤드롭 공통) */}
            <div
              key={jdImageError === 'too_large' ? `jd-shake-${jdShakeKey}` : 'jd-no-shake'}
              className={`flex flex-col gap-[0.5rem] overflow-visible ${jdImageError === 'too_large' ? 'animate-shake' : ''}`}
            >
              <div>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>Job Description</span>
                  <span className='text-[#DC0000]'>*</span>
                </div>
                <div
                  className={`flex items-center justify-between ${
                    informationErrors.jobDescription ? 'mb-0' : 'mb-[1.25rem]'
                  }`}
                >
                  <span className='font-regular text-[0.875rem] leading-[1.5] text-[#74777D]'>
                    JD는 채용공고에 명시된 직무 설명서로, 주로 담당할 업무,
                    자격요건, 우대사항 등이 포함돼요.
                  </span>
                  <ToggleSmall
                    options={[
                      { value: 'text', label: '텍스트' },
                      { value: 'image', label: '이미지' },
                    ]}
                    value={jdMode}
                    onChange={(value) => {
                      setJdMode(value as 'text' | 'image');
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
                  />
                </div>
                {informationErrors.jobDescription && (
                  <p className='text-[0.875rem] text-[#DC0000]'>
                    {jdMode === 'text'
                      ? 'Job Description을 입력해주세요.'
                      : jdImageError === 'too_large' || jdImageError === 'too_many'
                        ? '1MB 이하의 이미지 파일만 업로드 가능하며, 최대 2개까지만 업로드 가능해요.'
                        : 'Job Description 이미지를 업로드해주세요.'}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-[0.75rem]'>
                {jdMode === 'text' ? (
                  <TextField
                    variant='wide'
                    height='23.5rem'
                    className='rounded-[1.25rem] px-[1.625rem] py-[1.25rem]'
                    placeholder='채용공고의 JD를 복사 후 붙여넣기 해주세요.'
                    value={jobDescription}
                    maxLength={700}
                    onChange={(e) => {
                      setJobDescription(e.target.value.slice(0, 700));
                      if (informationErrors.jobDescription)
                        setInformationErrors((prev) => ({
                          ...prev,
                          jobDescription: false,
                        }));
                    }}
                  />
                ) : (
                  <div className='flex gap-[1.5rem]'>
                    <input
                      ref={jdFileInputRef}
                      type='file'
                      accept='.jpg,.jpeg,.png,image/jpeg,image/png'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleJdImageFile(file);
                        e.target.value = '';
                      }}
                    />
                    {/* 왼쪽: 업로드 카드(0~1개일 때) 또는 두 번째 파일 미리보기(2개일 때) */}
                    {jdUploadedFiles.length >= 2 ? (
                      <div className='flex h-[19.125rem] w-[32.25rem] shrink-0 flex-col overflow-hidden rounded-[1rem] border border-[#9EA4A9] bg-[#FFFFFF]'>
                        <div className='group relative h-[15rem] shrink-0 overflow-hidden bg-[#FFFFFF] p-[1rem] transition-colors hover:bg-[#E9EAEC]'>
                          <img
                            src={jdUploadedFiles[1].previewUrl}
                            alt='JD 미리보기 2'
                            className='h-full w-full object-contain object-left-top'
                          />
                          <button
                            type='button'
                            className='absolute top-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#74777D] opacity-0 transition-opacity duration-150 group-hover:opacity-100'
                            aria-label='파일 삭제'
                            onClick={() => removeJdFileAt(1)}
                          >
                            <FileCloseIcon />
                          </button>
                          <button
                            type='button'
                            className='absolute bottom-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#FFFFFF] shadow-[0_0_8px_0_rgba(0,0,0,0.25)]'
                            aria-label='전체화면'
                            onClick={() => setJdViewerFileIndex(1)}
                          >
                            <FullIcon />
                          </button>
                        </div>
                        <div className='h-[1px] w-full bg-[#E9EAEC]' />
                        <div className='flex items-center gap-[0.75rem] border-t border-[#9EA4A9] px-[1rem] py-[0.75rem]'>
                          <div className='flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-[0.375rem]'>
                            <FileImageIcon />
                          </div>
                          <div className='min-w-0 flex-1 overflow-hidden'>
                            <p className='truncate text-[0.875rem] font-bold text-[#1A1A1A]'>
                              {jdUploadedFiles[1].name}
                            </p>
                            <p className='mt-[0.125rem] text-[0.75rem] text-[#74777D]'>
                              {jdUploadedFiles[1].size >= 1024 * 1024
                                ? `${(jdUploadedFiles[1].size / 1024 / 1024).toFixed(1)} MB`
                                : `${(jdUploadedFiles[1].size / 1024).toFixed(1)} KB`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-1 flex-col gap-[0.5rem] rounded-[1.25rem] bg-[#F6F8FA] px-[1.5rem] py-[1.25rem]'>
                        <div
                          role='button'
                          tabIndex={0}
                          className='flex cursor-pointer items-center gap-[3.625rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] px-[4.75rem] py-[2.25rem] shadow-sm'
                          onClick={() => jdFileInputRef.current?.click()}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && jdFileInputRef.current?.click()
                          }
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='40'
                            height='40'
                            viewBox='0 0 60 60'
                            fill='none'
                          >
                            <path
                              d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                              stroke='#9EA4A9'
                              strokeWidth='4'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <div className='flex flex-col'>
                            <span className='text-[0.875rem] text-[#1A1A1A] whitespace-nowrap'>
                              클릭하여 JD 파일을 업로드 하세요.
                            </span>
                            <span className='text-[0.75rem] text-[#74777D] whitespace-nowrap'>
                              (JPG, PNG 파일만 업로드 가능, 최대 2개)
                            </span>
                          </div>
                        </div>
                        <div className='relative flex w-full items-center px-[1rem] py-[0.5rem]'>
                          <div className='h-[1px] w-full bg-[#CDD0D5]' />
                          <div className='absolute left-1/2 flex h-[1.25rem] w-[3.5rem] -translate-x-1/2 items-center justify-center bg-[#F6F8FA] text-center text-[0.875rem] text-[#1A1A1A]'>
                            또는
                          </div>
                        </div>
                        <div
                          role='button'
                          tabIndex={0}
                          className='flex cursor-pointer items-center gap-[2rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] px-[4.75rem] py-[2.25rem] shadow-sm'
                          onClick={() => handlePasteJdImageFromClipboard()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePasteJdImageFromClipboard();
                            }
                          }}
                        >
                          <svg
                            width='40'
                            height='40'
                            viewBox='0 0 60 60'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M3.21484 10.2338V7.5C3.21484 6.50544 3.60993 5.55161 4.31319 4.84835C5.01645 4.14509 5.97028 3.75 6.96484 3.75H14.4648V7.5H6.96484V52.5H21.9648V56.25H6.96484C5.97028 56.25 5.01645 55.8549 4.31319 55.1516C3.60993 54.4484 3.21484 53.4946 3.21484 52.5V10.2338ZM48.2148 18.75V7.5C48.2148 6.50544 47.8198 5.55161 47.1165 4.84835C46.4132 4.14509 45.4594 3.75 44.4648 3.75H36.9648V7.5H44.4648V18.75H48.2148ZM44.4648 22.5H51.9648V56.25H25.7148V22.5H44.4648ZM44.4648 18.75H25.7148C24.7203 18.75 23.7665 19.1451 23.0632 19.8484C22.3599 20.5516 21.9648 21.5054 21.9648 22.5V56.25C21.9648 57.2446 22.3599 58.1984 23.0632 58.9016C23.7665 59.6049 24.7203 60 25.7148 60H51.9648C52.9594 60 53.9132 59.6049 54.6165 58.9016C55.3198 58.1984 55.7148 57.2446 55.7148 56.25V22.5C55.7148 21.5054 55.3198 20.5516 54.6165 19.8484C53.9132 19.1451 52.9594 18.75 51.9648 18.75H44.4648Z'
                              fill='#9EA4A9'
                            />
                            <path
                              d='M29.4648 37.5H48.2148V33.75H29.4648V37.5ZM29.4648 30H48.2148V26.25H29.4648V30ZM29.4648 45H48.2148V41.25H29.4648V45ZM29.4648 52.5H48.2148V48.75H29.4648V52.5ZM36.9648 7.5V3.75C36.9648 2.75544 36.5698 1.80161 35.8665 1.09835C35.1632 0.395088 34.2094 0 33.2148 0L18.2148 0C17.2203 0 16.2665 0.395088 15.5632 1.09835C14.8599 1.80161 14.4648 2.75544 14.4648 3.75V7.5H18.2148V3.75H33.2148V7.5H36.9648ZM14.4648 11.25H36.9648V7.5H14.4648V11.25Z'
                              fill='#9EA4A9'
                            />
                          </svg>
                          <span className='text-[0.875rem] text-[#1A1A1A] whitespace-nowrap'>
                            클릭하여 복사한 JD 이미지를 업로드 하세요.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 오른쪽: 드롭존(0개일 때) 또는 첫 번째 파일 미리보기(1개 이상) */}
                    <div
                      className={`flex h-[19.125rem] w-[32.25rem] shrink-0 flex-col overflow-hidden rounded-[1rem] bg-[#FFFFFF] ${
                        jdUploadedFiles.length >= 1
                          ? 'border border-[#9EA4A9]'
                          : 'border border-dashed border-[#CDD0D5]'
                      }`}
                    >
                      {jdUploadedFiles.length >= 1 ? (
                        <>
                          <div className='group relative h-[15rem] shrink-0 overflow-hidden bg-[#FFFFFF] p-[1rem] transition-colors hover:bg-[#E9EAEC]'>
                            <img
                              src={jdUploadedFiles[0].previewUrl}
                              alt='JD 미리보기 1'
                              className='h-full w-full object-contain object-left-top'
                            />
                            <button
                              type='button'
                              className='absolute top-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#74777D] opacity-0 transition-opacity duration-150 group-hover:opacity-100'
                              aria-label='파일 삭제'
                              onClick={() => removeJdFileAt(0)}
                            >
                              <FileCloseIcon />
                            </button>
                            <button
                              type='button'
                              className='absolute bottom-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#FFFFFF] shadow-[0_0_8px_0_rgba(0,0,0,0.25)]'
                              aria-label='전체화면'
                              onClick={() => setJdViewerFileIndex(0)}
                            >
                              <FullIcon />
                            </button>
                          </div>
                          <div className='h-[1px] w-full bg-[#E9EAEC]' />
                          <div className='flex items-center gap-[0.75rem] border-t border-[#9EA4A9] px-[1rem] py-[0.75rem]'>
                            <div className='flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-[0.375rem]'>
                              <FileImageIcon />
                            </div>
                            <div className='min-w-0 flex-1 overflow-hidden'>
                              <p className='truncate text-[0.875rem] font-bold text-[#1A1A1A]'>
                                {jdUploadedFiles[0].name}
                              </p>
                              <p className='mt-[0.125rem] text-[0.75rem] text-[#74777D]'>
                                {jdUploadedFiles[0].size >= 1024 * 1024
                                  ? `${(jdUploadedFiles[0].size / 1024 / 1024).toFixed(1)} MB`
                                  : `${(jdUploadedFiles[0].size / 1024).toFixed(1)} KB`}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className='flex h-full w-full rounded-[1rem]' />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 첨삭 시작하기 버튼 */}
            <div className='flex justify-center pb-[7rem]'>
              <button
                onClick={handleStartCorrectionClick}
                className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[3.75rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
              >
                <CorrectionIcon />
                <span className='text-[1rem] font-bold text-[#FFFFFF] whitespace-nowrap'>
                  첨삭 시작하기
                </span>
              </button>
            </div>
          </>
        ) : step === 'portfolio' ? (
          <>
            {/* 포트폴리오 종류 선택 */}
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                <span>포트폴리오 종류 선택</span>
                <span className='text-[#DC0000]'>*</span>
              </div>

              <div className='grid grid-cols-2 gap-[1.5rem]'>
                {/* 텍스트형 포트폴리오 */}
                <PortfolioTypeCard
                  icon={
                    <svg
                      width='52'
                      height='52'
                      viewBox='0 0 52 52'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H32.5V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM6.266 51.5093V40.664H9.958V38.5125H0V40.664H3.6855V51.5093H6.266ZM21.5053 38.5125H18.5998L15.925 43.1892H15.8112L13.1073 38.5125H10.0782L14.0693 44.9573L10.0393 51.5093H12.8407L15.613 46.9105H15.7268L18.4893 51.5093H21.437L17.3647 45.0353L21.5053 38.5125ZM27.7778 40.664V51.5093H25.1972V40.664H21.5117V38.5125H31.4697V40.664H27.7745H27.7778Z'
                        fill='#5060C5'
                      />
                    </svg>
                  }
                  title='텍스트형 포트폴리오'
                  description='경험 정리를 바탕으로 생성된 텍스트형 포트폴리오를 첨삭해요.'
                  selected={selectedPortfolioType === 'text'}
                  onClick={() => handlePortfolioSelect('text')}
                />

                {/* PDF 포트폴리오 */}
                <PortfolioTypeCard
                  icon={
                    <svg
                      width='52'
                      height='52'
                      viewBox='0 0 52 52'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H35.75V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM5.2 38.5125H0V51.5093H2.57075V47.1478H5.1805C6.11217 47.1478 6.90517 46.9603 7.5595 46.5855C8.22033 46.2063 8.72192 45.6928 9.06425 45.045C9.42107 44.3673 9.60104 43.6105 9.5875 42.8447C9.5875 42.0322 9.41633 41.2988 9.074 40.6445C8.73105 39.9977 8.21296 39.4604 7.579 39.0942C6.929 38.7043 6.136 38.5103 5.2 38.5125ZM6.97125 42.8447C6.98229 43.2729 6.88739 43.6971 6.695 44.0798C6.52249 44.4132 6.25274 44.6863 5.9215 44.863C5.5429 45.0494 5.12461 45.1409 4.70275 45.1295H2.561V40.56H4.706C5.4145 40.56 5.96917 40.7561 6.37 41.1483C6.77083 41.5448 6.97125 42.1102 6.97125 42.8447ZM10.9265 38.5125V51.5093H15.6715C16.9758 51.5093 18.057 51.2525 18.915 50.739C19.7833 50.2195 20.4613 49.4344 20.8487 48.4998C21.2734 47.5247 21.4858 46.3504 21.4858 44.9767C21.4858 43.6117 21.2734 42.4472 20.8487 41.483C20.465 40.5596 19.7937 39.7845 18.9345 39.273C18.0765 38.766 16.9878 38.5125 15.6683 38.5125H10.9265ZM13.4972 40.6087H15.327C16.1308 40.6087 16.7906 40.7734 17.3062 41.1028C17.841 41.4554 18.2451 41.9737 18.4567 42.5783C18.7124 43.2326 18.8403 44.0483 18.8403 45.0255C18.8503 45.6737 18.776 46.3205 18.6193 46.9495C18.5071 47.4469 18.2899 47.9145 17.9823 48.321C17.6995 48.6855 17.3248 48.9681 16.8967 49.14C16.3951 49.3275 15.8624 49.418 15.327 49.4065H13.4972V40.6087ZM25.662 46.3385V51.5093H23.0945V38.5125H31.3755V40.6348H25.662V44.265H30.8815V46.3385H25.662Z'
                        fill='#5060C5'
                      />
                    </svg>
                  }
                  title='PDF 포트폴리오'
                  description='업로드한 PDF 포트폴리오의 텍스트를 첨삭해요.'
                  selected={selectedPortfolioType === 'pdf'}
                  onClick={() => handlePortfolioSelect('pdf')}
                />
              </div>

              {/* 텍스트형 포트폴리오 선택 리스트 */}
              {selectedPortfolioType === 'text' && (
                // TODO: 실제 데이터 연동 시 textPortfolios를 API 데이터로 교체
                // TODO: 선택된 포트폴리오 ID를 다음 단계 API에 전달
                <div className='mt-[4.75rem] flex flex-col'>
                  <div className='flex items-center text-[1.125rem] font-bold leading-[1.3]'>
                    <span>텍스트형 포트폴리오 선택</span>
                  </div>
                  <span className='pt-[0.25rem] text-[0.875rem] text-[#74777D]'>
                    경험 정리를 통해 생성한 포트폴리오 중, 첨삭을 진행할
                    포트폴리오를 최대 5개 클릭하여 선택해주세요.
                  </span>
                  {showTextPortfolioWarning && (
                    <span className='mt-[1.75rem] mb-[0.5rem] text-[0.875rem] text-[#DC0000]'>
                      첨삭할 텍스트형 포트폴리오를 선택해주세요
                    </span>
                  )}
                  <div
                    className={`grid grid-cols-2 gap-[1.5rem] ${
                      showTextPortfolioWarning ? 'mt-[0.5rem]' : 'mt-[1.25rem]'
                    }`}
                  >
                    {textPortfolios.map((portfolio) => (
                      <PortfolioCard
                        key={portfolio.id}
                        title={portfolio.title}
                        tag={portfolio.tag}
                        date={portfolio.date}
                        selected={selectedTextPortfolioIds.includes(
                          portfolio.id,
                        )}
                        onClick={() => {
                          setShowTextPortfolioWarning(false);
                          setSelectedTextPortfolioIds((prev) => {
                            if (prev.includes(portfolio.id)) {
                              // 이미 선택되어 있으면 제거
                              return prev.filter((id) => id !== portfolio.id);
                            } else {
                              // 선택되어 있지 않으면 추가
                              return [...prev, portfolio.id];
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* PDF 포트폴리오 업로드 섹션 */}
              {selectedPortfolioType === 'pdf' && (
                <div className='mt-[4.75rem] flex flex-col gap-[1.25rem]'>
                  <div>
                    <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                      <span>PDF 포트폴리오 업로드</span>
                      <span className='text-[#DC0000]'>*</span>
                    </div>
                    {pdfUploadError === 'too_large' && (
                      <p className='mt-[0.5rem] text-[0.875rem] text-[#DC0000]'>
                        최대 10MB의 PDF 파일만 업로드 가능해요.
                      </p>
                    )}
                  </div>
                  <div className='rounded-[1rem] border border-[#E9EAEC] bg-[#FDFDFD] p-[1rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    <div className='grid grid-cols-2 gap-[4rem] pl-[2.75rem]'>
                      {/* 왼쪽: 설명 및 텍스트 추출 버튼 */}
                      <div className='flex flex-col justify-center gap-[1.5rem]'>
                        <div className='flex flex-col'>
                          <span className='text-[0.875rem] text-[#1A1A1A]'>
                            업로드하신 포트폴리오 파일의 텍스트를 추출하여
                            첨삭을 진행해요.
                          </span>
                          <span className='text-[0.875rem] text-[#1A1A1A]'>
                            최대 10MB의 파일, 최대 5개의 파일을 첨삭이 가능해요.
                          </span>
                        </div>
                        <button
                          onClick={() => setIsPdfTextExtracted(true)}
                          disabled={isPdfTextExtracted}
                          className={`self-start rounded-[3.75rem] border-none px-[2.25rem] py-[0.75rem] ${
                            isPdfTextExtracted
                              ? 'cursor-not-allowed bg-[#CDD0D5]'
                              : 'cursor-pointer bg-[#5060C5]'
                          }`}
                        >
                          <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                            텍스트 추출하기
                          </span>
                        </button>
                      </div>

                      {/* 오른쪽: PDF 파일 업로드 영역 */}
                      <input
                        ref={pdfFileInputRef}
                        type='file'
                        accept='.pdf,application/pdf'
                        className='hidden'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (file) handlePdfFile(file);
                        }}
                      />
                      <div
                        role='button'
                        tabIndex={0}
                        className='group relative flex flex-col items-center justify-center gap-[0.75rem] rounded-[1rem] border border-[#CDD0D5] bg-[#FFFFFF] p-[3rem] cursor-pointer'
                        onClick={() =>
                          pdfUploadedFile
                            ? undefined
                            : pdfFileInputRef.current?.click()
                        }
                        onKeyDown={(e) => {
                          if (
                            !pdfUploadedFile &&
                            (e.key === 'Enter' || e.key === ' ')
                          ) {
                            e.preventDefault();
                            pdfFileInputRef.current?.click();
                          }
                        }}
                      >
                        {pdfUploadedFile ? (
                          <>
                            <PdfIcon />
                            <span className='text-center text-[0.875rem] text-[#1A1A1A]'>
                              {pdfUploadedFile.name.endsWith('.pdf')
                                ? pdfUploadedFile.name
                                : `${pdfUploadedFile.name}.pdf`}
                            </span>
                            <button
                              type='button'
                              className='absolute top-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#74777D] opacity-0 transition-opacity duration-150 group-hover:opacity-100'
                              aria-label='파일 삭제'
                              onClick={(e) => {
                                e.stopPropagation();
                                setPdfUploadedFile(null);
                                setPdfUploadError(null);
                              }}
                            >
                              <FileCloseIcon />
                            </button>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='40'
                              height='40'
                              viewBox='0 0 60 60'
                              fill='none'
                            >
                              <path
                                d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                                stroke='#74777D'
                                strokeWidth='4'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <span className='text-center text-[0.875rem] text-[#74777D]'>
                              클릭하여 파일을 업로드하세요.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF 포트폴리오 텍스트 정리 섹션 */}
              {selectedPortfolioType === 'pdf' && isPdfTextExtracted && (
                <div className='mt-[3.75rem] flex flex-col'>
                  <div className='mb-[0.5rem] flex items-center text-[1.125rem] font-bold leading-[1.3]'>
                    <span>PDF 포트폴리오 텍스트 정리</span>
                  </div>
                  <div className='mb-[2.5rem] flex flex-col'>
                    <span className='text-[0.875rem] text-[#74777D]'>
                      업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된
                      부분이나 추가하실 부분이 있다면 수정해주세요.
                    </span>
                    <span className='text-[0.875rem] text-[#74777D]'>
                      삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지
                      않아요.
                    </span>
                  </div>

                  {/* 활동 탭 */}
                  <div className='flex'>
                    <button
                      onClick={() => setSelectedActivity('A')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'A'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 A
                    </button>
                    <button
                      onClick={() => setSelectedActivity('B')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'B'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 B
                    </button>
                    <button
                      onClick={() => setSelectedActivity('C')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'C'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 C
                    </button>
                    <button className='cursor-pointer rounded-t-[1.25rem] border-none bg-[#F6F8FA] px-[3rem] py-[1rem] text-[0.875rem] font-medium text-[#9EA4A9] transition-all'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 16 16'
                        fill='#5060C5'
                      >
                        <path
                          d='M8 3.33333V12.6667M3.33333 8H12.6667'
                          stroke='#5060C5'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 사이드바 및 내용 영역 */}
                  <div className='relative z-20 flex min-h-[397px] rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    {/* 사이드바 네비게이션 */}
                    <div className='flex flex-col'>
                      <button
                        onClick={() => setSelectedTab('상세정보')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] transition-all ${
                          selectedTab === '상세정보'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        상세정보
                      </button>
                      <button
                        onClick={() => setSelectedTab('담당업무')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '담당업무'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        담당업무
                      </button>
                      <button
                        onClick={() => setSelectedTab('문제해결')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '문제해결'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        문제해결
                      </button>
                      <button
                        onClick={() => setSelectedTab('배운 점')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '배운 점'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        배운 점
                      </button>
                    </div>

                    {/* 구분선 */}
                    <div className='w-[1px] bg-[#CDD0D5]' />

                    {/* 내용 영역 */}
                    <div className='flex-1 rounded-tr-[1.25rem] rounded-br-[1.25rem] bg-[#FFFFFF] px-[2.25rem] py-[1.5rem]'>
                      <div className='flex flex-col gap-[0.5rem] text-[0.875rem] text-[#1A1A1A]'>
                        <span>
                          내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                          내용내용내용내용내용내용내용
                          내용내용내용내용내용내용내용
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 다음으로 버튼 */}
            {selectedPortfolioType && (
              <div className='flex justify-center pb-[7rem]'>
                <button
                  onClick={handleNextStep}
                  className='flex cursor-pointer items-center justify-center rounded-[3.75rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
                >
                  <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                    다음으로
                  </span>
                </button>
              </div>
            )}
          </>
        ) : step === 'analysis' ? (
          <>
            <div className='flex flex-col gap-[5rem]'>
              {/* 기업 분석 정보 섹션 */}
              <div className='flex flex-col gap-[0.375rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>기업 분석 정보</span>
                  <span className='text-[#DC0000]'>*</span>
                </div>
                <div className='flex flex-col'>
                  <div
                    className={`flex items-center justify-between ${
                      showAnalysisInfoWarning ? 'mb-[0.5rem]' : 'mb-[1rem]'
                    }`}
                  >
                    <div className='flex flex-col'>
                      <span className='text-[0.875rem] text-[#74777D]'>
                        지원 정보를 바탕으로 AI 컨설턴트가 기업 분석 정보를
                        생성했어요.
                      </span>
                      <span className='text-[0.875rem] text-[#74777D]'>
                        추가하고 싶은 내용이 있으시면, 수정 후 첨삭을
                        의뢰해주세요.
                      </span>
                      {showAnalysisInfoWarning && (
                        <span className='mt-[0.5rem] text-[0.875rem] text-[#DC0000]'>
                          기업 분석 정보를 입력해주세요
                        </span>
                      )}
                    </div>
                  </div>
                  <TextField
                    variant='wide'
                    height='17.125rem'
                    className='rounded-[1.25rem]'
                    value={analysisInfoValue}
                    onChange={(e) => {
                      setAnalysisInfoValue(e.target.value);
                      setShowAnalysisInfoWarning(false);
                    }}
                  />
                </div>
              </div>

              {/* 강조 포인트 섹션 */}
              <div className='flex flex-col gap-[0.375rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>강조 포인트</span>
                </div>
                <div className='flex flex-col'>
                  <span className='mb-[1rem] text-[0.875rem] text-[#74777D]'>
                    기업 분석 정보를 바탕으로, 이번 서류에서 강조하고 싶은
                    역량이나 기술 등이 있다면 작성해주세요.
                  </span>
                  <TextField
                    variant='wide'
                    height='10.625rem'
                    className='rounded-[1.25rem]'
                  />
                </div>
              </div>
            </div>

            {/* 첨삭 의뢰하기 버튼 */}
            <div className='flex justify-center pt-[1.25rem] pb-[7rem]'>
              <button
                onClick={handleNextStep}
                className='flex cursor-pointer items-center justify-center rounded-[3.75rem] gap-[0.75rem]  border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
              >
                <CorrectionIcon />
                <span className='text-[1rem] font-bold text-[#FFFFFF] whitespace-nowrap'>
                  첨삭 의뢰하기
                </span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* status가 ANALYZING 상태일 때는 DRAFT, DONE이 아닌 값을 미리 체크 */}
            {status !== 'DRAFT' && status !== 'DONE' ? (
              <div className='flex flex-col items-center justify-center gap-[2rem] py-[10rem]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='56'
                  height='60'
                  viewBox='0 0 56 60'
                  fill='none'
                >
                  <path
                    opacity='0.1'
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M28 8C22.6957 8 17.6086 10.1071 13.8579 13.8579C10.1071 17.6086 8 22.6957 8 28C8 33.3043 10.1071 38.3914 13.8579 42.1421C17.6086 45.8929 22.6957 48 28 48C33.3043 48 38.3914 45.8929 42.1421 42.1421C45.8929 38.3914 48 33.3043 48 28C48 22.6957 45.8929 17.6086 42.1421 13.8579C38.3914 10.1071 33.3043 8 28 8ZM0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z'
                    fill='#74777D'
                  />
                  <g
                    className='animate-spin'
                    style={{ transformOrigin: '28px 28px' }}
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M28.0007 8.00003C22.8444 7.989 17.8852 9.9805 14.1687 13.5547C13.3987 14.2666 12.3801 14.6477 11.3319 14.6159C10.2838 14.5841 9.29007 14.142 8.56467 13.3848C7.83927 12.6276 7.44023 11.6158 7.45344 10.5673C7.46666 9.51879 7.89108 8.51738 8.63534 7.7787C13.8408 2.77773 20.7822 -0.0105164 28.0007 2.98087e-05C29.0615 2.98087e-05 30.079 0.421457 30.8291 1.1716C31.5792 1.92175 32.0007 2.93916 32.0007 4.00003C32.0007 5.0609 31.5792 6.07831 30.8291 6.82846C30.079 7.5786 29.0615 8.00003 28.0007 8.00003Z'
                      fill='url(#paint0_linear_3242_3790_analysis)'
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id='paint0_linear_3242_3790_analysis'
                      x1='19.7269'
                      y1='0'
                      x2='19.7269'
                      y2='14.6177'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#93B3F4' />
                      <stop offset='1' stopColor='#5060C5' />
                    </linearGradient>
                  </defs>
                </svg>
                <div className='flex flex-col items-center gap-[0.5rem] text-center'>
                  <span className='text-[1.25rem] font-bold leading-[1.3] text-[#1A1A1A]'>
                    AI 컨설턴트가 포트폴리오 첨삭을 진행 중이에요.
                  </span>
                  <span className='text-[1rem] text-[#74777D]'>
                    페이지를 떠나도 작업은 계속돼요.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className='flex flex-col'>
                  {/* 탭 */}
                  <div className='flex'>
                    <button
                      onClick={() => setResultTab('지원 정보')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '지원 정보'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '지원 정보'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      지원 정보
                    </button>
                    <button
                      onClick={() => setResultTab('총평')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '총평'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '총평'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      총평
                    </button>
                    <button
                      onClick={() => setResultTab('활동 A')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '활동 A'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '활동 A'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      활동 A
                    </button>
                    <button
                      onClick={() => setResultTab('활동 B')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '활동 B'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '활동 B'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      활동 B
                    </button>
                  </div>

                  {/* 내용 영역 */}
                  <div className='relative z-20 rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-t-0 border-[#E9EAEC] bg-[#FFFFFF] px-[2.5rem] py-[3rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    {/* 지원 정보 탭 내용 */}
                    {resultTab === '지원 정보' && (
                      <div className='flex flex-col gap-[3.75rem]'>
                        {/* 지원 기업명 및 지원 직무명 */}
                        <div className='grid grid-cols-2 gap-[1.5rem]'>
                          <div className='flex flex-col gap-[1rem]'>
                            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                              <span>지원 기업명</span>
                            </div>
                            <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                              삼성 SDI
                            </div>
                          </div>
                          <div className='flex flex-col gap-[1rem]'>
                            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                              <span>지원 직무명</span>
                            </div>
                            <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                              품질관리
                            </div>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                            <span>Job Description</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>

                        {/* 기업 분석 정보 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                            <span>기업 분석 정보</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>

                        {/* 강조 포인트 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                            <span>강조 포인트</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 총평 탭 내용 */}
                    {resultTab === '총평' && (
                      <div className='flex flex-col gap-[3rem]'>
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold leading-[1.3]'>총평</div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 활동 A, B 탭 내용 */}
                    {(resultTab === '활동 A' || resultTab === '활동 B') && (
                      <div className='flex flex-col gap-[3rem]'>
                        {/* 상세정보 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold leading-[1.3]'>
                            상세정보
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용
                              <span className='bg-[#FFF2F2]'>
                                내용내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                              내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setDetailInfoButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    detailInfoButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setDetailInfoButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    detailInfoButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 담당업무 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold leading-[1.3]'>
                            담당업무
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -
                              <span className='bg-[#F1FEF0]'>
                                내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                              내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setResponsibilityButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    responsibilityButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setResponsibilityButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    responsibilityButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 문제 해결 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold leading-[1.3]'>
                            문제 해결
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <ToggleLarge
                                options={[
                                  { value: '축소 또는 제외', label: '축소 또는 제외' },
                                  { value: '구체화하여 강조', label: '구체화하여 강조' },
                                ]}
                                value={problemSolvingButton}
                                onChange={(value) =>
                                  setProblemSolvingButton(
                                    value as '축소 또는 제외' | '구체화하여 강조',
                                  )
                                }
                              />
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 배운 점 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold leading-[1.3]'>
                            배운 점
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setLessonsButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    lessonsButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setLessonsButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    lessonsButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 새로운 경험 정리 시작하기 버튼 */}
                <div className='flex justify-center pt-[1.25rem] pb-[7rem]'>
                  <button
                    onClick={handleStartNewExperience}
                    className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[3.75rem] border-none bg-[#5060C5] px-[2rem] py-[0.625rem]'
                  >
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M15 0H1.66667C0.746192 0 0 0.746192 0 1.66667V3.33333C0 4.25381 0.746192 5 1.66667 5H15C15.9205 5 16.6667 4.25381 16.6667 3.33333V1.66667C16.6667 0.746192 15.9205 0 15 0Z'
                        fill='white'
                      />
                      <path
                        d='M18.332 6.66675H4.9987C4.07822 6.66675 3.33203 7.41294 3.33203 8.33341V10.0001C3.33203 10.9206 4.07822 11.6667 4.9987 11.6667H18.332C19.2525 11.6667 19.9987 10.9206 19.9987 10.0001V8.33341C19.9987 7.41294 19.2525 6.66675 18.332 6.66675Z'
                        fill='white'
                      />
                      <path
                        d='M15 13.3333H1.66667C0.746192 13.3333 0 14.0794 0 14.9999V16.6666C0 17.5871 0.746192 18.3333 1.66667 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6666V14.9999C16.6667 14.0794 15.9205 13.3333 15 13.3333Z'
                        fill='white'
                      />
                    </svg>
                    <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                      새로운 경험 정리 시작하기
                    </span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {step === 'result' && <FeedbackFloatingButton />}
    </div>
  );
}

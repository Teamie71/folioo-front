'use client';

import { type MutableRefObject, useEffect, useRef } from 'react';
import { useExternalPortfolioControllerGetSelectedPortfolios } from '@/api/endpoints/portfolio/portfolio';
import { CommonButton } from '@/components/CommonButton';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import {
  assignPlaceholderLabelsForEmptyPdfNames,
  mapToPdfActivityBlock,
} from '@/services/correction';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';
import { CorrectionPdfActivityTabs } from './CorrectionPdfActivityTabs';
import { CorrectionPdfBulletEditor } from './CorrectionPdfBulletEditor';

export interface CorrectionPdfTextSectionProps {
  isPdfTextExtracting: boolean;
  pdfActivities: PdfActivityBlock[];
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  onAddActivity: () => Promise<void>;
  onActivityChange?: (activity: PdfActivityBlock) => void;
  selectedActivityId: string;
  onActivitySelect: (id: string) => void;
  selectedTab: PdfCategoryName;
  onTabSelect: (tab: PdfCategoryName) => void;
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
  bulletTextareaRefs: MutableRefObject<(HTMLTextAreaElement | null)[]>;
  lastBulletEnterAt: MutableRefObject<number>;
  correctionNumericId: number | null;
  pdfExtractNonce: number;
  onPdfPortfoliosHydratedFromQuery: (activities: PdfActivityBlock[]) => void;
}

export function CorrectionPdfTextSection({
  isPdfTextExtracting,
  pdfActivities,
  setPdfActivities,
  onAddActivity,
  onActivityChange,
  selectedActivityId,
  onActivitySelect,
  selectedTab,
  onTabSelect,
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
  bulletTextareaRefs,
  lastBulletEnterAt,
  correctionNumericId,
  pdfExtractNonce,
  onPdfPortfoliosHydratedFromQuery,
}: CorrectionPdfTextSectionProps) {
  const lastSyncedExtractNonceRef = useRef<number | null>(null);

  const enabled =
    correctionNumericId != null &&
    correctionNumericId > 0;

  const { data, isLoading, isFetching, isError, refetch } =
    useExternalPortfolioControllerGetSelectedPortfolios(
      { correctionId: correctionNumericId ?? 0 },
      {
        query: {
          enabled,
          refetchInterval: (q) => {
            const status = q.state.data?.result?.status;
            const len = q.state.data?.result?.portfolios?.length ?? 0;
            if (len > 0 || status === 'GENERATED' || status === 'FAILED') return false;
            const shouldPoll = isPdfTextExtracting || pdfExtractNonce > 0 || status === 'GENERATING';
            return shouldPoll ? 2000 : false;
          },
        },
      },
    );

  const extractionStatus = data?.result?.status;
  const listLen = data?.result?.portfolios?.length ?? 0;
  const isFailed = isError || data?.isSuccess === false || extractionStatus === 'FAILED';
  /**
   * 추출 접수 후·조회 중에는 결과 행이 생길 때까지 스피너 유지.
   * (페칭 사이 간격에 isFetching이 잠깐 false여도 사라지지 않게 nonce·extracting·GENERATING으로 잡음)
   */
  const isWaitingForData =
    !isFailed &&
    (isPdfTextExtracting ||
      extractionStatus === 'GENERATING' ||
      (pdfExtractNonce > 0 && listLen === 0) ||
      (enabled && listLen === 0 && (isLoading || isFetching)));
  /** 성공 응답인데 행이 없고, 위 대기 조건도 아닐 때만(이론상 드묾) 재조회 유도 */
  const showEmptyRetry =
    enabled && !isFailed && !isWaitingForData && listLen === 0;
  const showPortfolioBlock =
    enabled && listLen > 0 && !isFailed && !isWaitingForData;

  useEffect(() => {
    if (!enabled) return;
    const list = data?.result?.portfolios;
    if (!Array.isArray(list) || list.length === 0) return;
    if (lastSyncedExtractNonceRef.current === pdfExtractNonce) return;

    const activities = assignPlaceholderLabelsForEmptyPdfNames(
      list.map((dto, i) => mapToPdfActivityBlock(dto, i)),
    );
    setPdfActivities(activities);
    lastSyncedExtractNonceRef.current = pdfExtractNonce;
    onPdfPortfoliosHydratedFromQuery(activities);
  }, [
    enabled,
    data,
    pdfExtractNonce,
    setPdfActivities,
    onPdfPortfoliosHydratedFromQuery,
  ]);

  return (
    <div className='mt-[3.75rem] flex flex-col'>
      <div className='mb-[0.5rem] flex items-center text-[1.125rem] font-bold leading-[1.3]'>
        <span>PDF 포트폴리오 텍스트 정리</span>
      </div>
      <div className='mb-[2.5rem] flex flex-col'>
        <span className='text-[0.875rem] text-[#74777D]'>
          업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된 부분이나
          추가하실 부분이 있다면 수정해주세요.
        </span>
        <span className='text-[0.875rem] text-[#74777D]'>
          삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지 않아요.
        </span>
      </div>

      {!enabled ? null : isFailed || showEmptyRetry ? (
        <div className='flex flex-col items-center justify-center py-[4rem]'>
          <CommonButton
            variantType='Outline'
            px='1.5rem'
            py='0.5rem'
            onClick={() => refetch()}
          >
            다시 시도하기
          </CommonButton>
        </div>
      ) : isWaitingForData ? (
        <div className='flex flex-col items-center justify-center py-[4rem]'>
          <CorrectionLoadingSpinner />
        </div>
      ) : showPortfolioBlock ? (
        <>
          <CorrectionPdfActivityTabs
            pdfActivities={pdfActivities}
            selectedActivityId={selectedActivityId}
            onActivitySelect={onActivitySelect}
            setPdfActivities={setPdfActivities}
            onAddActivity={onAddActivity}
            onRequestActivityDelete={onRequestActivityDelete}
            pdfActivityHoverId={pdfActivityHoverId}
            setPdfActivityHoverId={setPdfActivityHoverId}
          />
          <CorrectionPdfBulletEditor
            pdfActivities={pdfActivities}
            setPdfActivities={setPdfActivities}
            onActivityChange={onActivityChange}
            selectedActivityId={selectedActivityId}
            selectedTab={selectedTab}
            onTabSelect={onTabSelect}
            bulletTextareaRefs={bulletTextareaRefs}
            lastBulletEnterAt={lastBulletEnterAt}
          />
        </>
      ) : null}
    </div>
  );
}

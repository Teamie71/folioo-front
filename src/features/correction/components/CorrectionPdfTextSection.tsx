'use client';

import { type MutableRefObject, useEffect, useRef } from 'react';
import { useExternalPortfolioControllerGetSelectedPortfolios } from '@/api/endpoints/portfolio/portfolio';
import { CommonButton } from '@/components/CommonButton';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import {
  assignPlaceholderLabelsForEmptyPdfNames,
  mapToPdfActivityBlock,
} from '@/services/correction';
import { PDF_MAX_ACTIVITY_COUNT } from '@/features/correction/constants';
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
  onRetryExtract: () => void;
  onExtractFailureChange: (isFailed: boolean) => void;
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
  onRetryExtract,
  onExtractFailureChange,
}: CorrectionPdfTextSectionProps) {
  const lastSyncedPortfoliosRef = useRef<string | null>(null);

  const enabled = correctionNumericId != null && correctionNumericId > 0;

  const { data, isLoading, isFetching, isError } =
    useExternalPortfolioControllerGetSelectedPortfolios(
      { correctionId: correctionNumericId ?? 0 },
      {
        query: {
          enabled,
          refetchInterval: (q) => {
            const status = q.state.data?.result?.status;
            const len = q.state.data?.result?.portfolios?.length ?? 0;
            if (status === 'GENERATED' || status === 'FAILED') return false;
            const shouldPoll =
              isPdfTextExtracting ||
              pdfExtractNonce > 0 ||
              status === 'GENERATING';
            return shouldPoll ? 2000 : false;
          },
        },
      },
    );

  const extractionStatus = data?.result?.status;
  const listLen = data?.result?.portfolios?.length ?? 0;
  const isFailed =
    isError || data?.isSuccess === false || extractionStatus === 'FAILED';
  /**
   * 추출 결과가 아직 하나도 없을 때만 대기 화면을 유지한다.
   * 활동이 하나라도 도착하면 생성 중이어도 활동 단위로 스트리밍한다.
   */
  const isWaitingForData =
    !isFailed &&
    extractionStatus !== 'GENERATED' &&
    listLen === 0 &&
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
    onExtractFailureChange(isFailed || showEmptyRetry);
  }, [isFailed, onExtractFailureChange, showEmptyRetry]);

  useEffect(() => {
    if (!enabled) return;
    const list = data?.result?.portfolios;
    if (!Array.isArray(list) || list.length === 0) return;
    const limitedPortfolios = list.slice(0, PDF_MAX_ACTIVITY_COUNT);
    const nextPortfolios = JSON.stringify(limitedPortfolios);
    if (lastSyncedPortfoliosRef.current === nextPortfolios) return;

    const activities = assignPlaceholderLabelsForEmptyPdfNames(
      limitedPortfolios.map((dto, i) => mapToPdfActivityBlock(dto, i)),
    );
    setPdfActivities(activities);
    lastSyncedPortfoliosRef.current = nextPortfolios;
    onPdfPortfoliosHydratedFromQuery(activities);
  }, [
    enabled,
    data,
    pdfExtractNonce,
    setPdfActivities,
    onPdfPortfoliosHydratedFromQuery,
  ]);

  if (isWaitingForData) {
    return (
      <section className='mt-[3.75rem] flex min-h-[calc(100dvh-6.25rem)] flex-col'>
        <h2 className='typo-h1 text-black'>PDF 포트폴리오 텍스트 정리</h2>
        <div className='flex flex-1 flex-col items-center pt-[8rem]'>
          <CorrectionLoadingSpinner size={100} />
          <div className='mt-[4rem] flex flex-col items-center gap-[1rem] text-center text-[2rem] leading-[1.3] font-bold text-[#464B53]'>
            <span>업로드하신 파일을 AI가 구조화하여 정리 중이에요.</span>
            <span>페이지를 떠나도 작업은 계속돼요.</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className='mt-[3.75rem] flex flex-col'>
      <div className='mb-[0.5rem] flex items-center text-[1.125rem] leading-[1.3] font-bold'>
        <span>PDF 포트폴리오 텍스트 정리</span>
      </div>
      {!isWaitingForData && !isFailed && !showEmptyRetry && (
        <div className='mb-[2.5rem] flex flex-col'>
          <span className='text-[0.875rem] text-[#74777D]'>
            업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된 부분이나
            추가하실 부분이 있다면 수정해주세요.
          </span>
          <span className='text-[0.875rem] text-[#74777D]'>
            삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지 않아요.
          </span>
        </div>
      )}

      {!enabled ? null : isFailed || showEmptyRetry ? (
        <div className='flex flex-col items-center justify-center py-[4rem]'>
          <div className='mb-[2rem] flex flex-col items-center gap-[0.5rem] text-center text-[1.125rem] leading-[1.3] font-bold text-[#464B53]'>
            <span>포트폴리오를 텍스트로 정리하는 중 오류가 발생했어요.</span>
            <span>아래 버튼을 눌러 다시 시도해주세요.</span>
          </div>
          <CommonButton
            variantType='Outline'
            px='1.5rem'
            py='0.5rem'
            onClick={onRetryExtract}
          >
            다시 시도하기
          </CommonButton>
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

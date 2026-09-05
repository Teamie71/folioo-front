'use client';

import { type MutableRefObject, type RefObject } from 'react';
import { CommonButton } from '@/components/CommonButton';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';
import { CorrectionPdfTextSection } from './CorrectionPdfTextSection';
import { CorrectionPdfUploadBlock } from './CorrectionPdfUploadBlock';

export interface CorrectionPortfolioStepProps {
  pdfUploadedFile: { name: string } | null;
  pdfUploadError: null | 'too_large' | 'too_many';
  pdfFileInputRef: RefObject<HTMLInputElement | null>;
  onPdfFileSelect: (file: File) => void;
  onRequestPdfFileDelete: () => void;
  onRequestPdfExtract: () => void;
  isPdfTextExtracted: boolean;
  isPdfTextExtracting: boolean;
  pdfActivities: PdfActivityBlock[];
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  onAddActivity: () => Promise<void>;
  onActivityChange?: (activity: PdfActivityBlock) => void;
  selectedActivityId: string;
  onActivitySelect: (id: string) => void;
  selectedTab: PdfCategoryName;
  onTabSelect: (tab: PdfCategoryName) => void;
  bulletTextareaRefs: MutableRefObject<(HTMLTextAreaElement | null)[]>;
  lastBulletEnterAt: MutableRefObject<number>;
  correctionNumericId: number | null;
  pdfExtractNonce: number;
  onPdfPortfoliosHydratedFromQuery: (activities: PdfActivityBlock[]) => void;
  onRetryPdfExtract: () => void;
  isPdfExtractFailed: boolean;
  onPdfExtractFailureChange: (isFailed: boolean) => void;
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
  handleNextStep: () => void;
  pdfCategoryOverLimit: boolean;
}

export function CorrectionPortfolioStep({
  pdfUploadedFile,
  pdfUploadError,
  pdfFileInputRef,
  onPdfFileSelect,
  onRequestPdfFileDelete,
  onRequestPdfExtract,
  isPdfTextExtracted,
  isPdfTextExtracting,
  pdfActivities,
  setPdfActivities,
  onAddActivity,
  onActivityChange,
  selectedActivityId,
  onActivitySelect,
  selectedTab,
  onTabSelect,
  bulletTextareaRefs,
  lastBulletEnterAt,
  correctionNumericId,
  pdfExtractNonce,
  onPdfPortfoliosHydratedFromQuery,
  onRetryPdfExtract,
  isPdfExtractFailed,
  onPdfExtractFailureChange,
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
  handleNextStep,
  pdfCategoryOverLimit,
}: CorrectionPortfolioStepProps) {
  return (
    <>
      <div
        className={`flex flex-col gap-[1.25rem] ${!isPdfTextExtracted || isPdfTextExtracting ? 'pb-[6.25rem]' : ''}`}
      >
        <CorrectionPdfUploadBlock
          pdfUploadedFile={pdfUploadedFile}
          pdfUploadError={pdfUploadError}
          pdfFileInputRef={pdfFileInputRef}
          onPdfFileSelect={onPdfFileSelect}
          onRequestPdfFileDelete={onRequestPdfFileDelete}
          onRequestPdfExtract={onRequestPdfExtract}
          isPdfTextExtracted={isPdfTextExtracted}
          isPdfTextExtracting={isPdfTextExtracting}
        />
        {isPdfTextExtracted && (
          <CorrectionPdfTextSection
            isPdfTextExtracting={isPdfTextExtracting}
            pdfActivities={pdfActivities}
            setPdfActivities={setPdfActivities}
            onAddActivity={onAddActivity}
            onActivityChange={onActivityChange}
            selectedActivityId={selectedActivityId}
            onActivitySelect={onActivitySelect}
            selectedTab={selectedTab}
            onTabSelect={onTabSelect}
            onRequestActivityDelete={onRequestActivityDelete}
            pdfActivityHoverId={pdfActivityHoverId}
            setPdfActivityHoverId={setPdfActivityHoverId}
            bulletTextareaRefs={bulletTextareaRefs}
            lastBulletEnterAt={lastBulletEnterAt}
            correctionNumericId={correctionNumericId}
            pdfExtractNonce={pdfExtractNonce}
            onPdfPortfoliosHydratedFromQuery={onPdfPortfoliosHydratedFromQuery}
            onRetryExtract={onRetryPdfExtract}
            onExtractFailureChange={onPdfExtractFailureChange}
          />
        )}
      </div>

      {/* 다음으로 버튼 */}
      {isPdfTextExtracted && !isPdfTextExtracting && !isPdfExtractFailed && (
        <div className='flex justify-center pb-[6.25rem]'>
          <CommonButton
            variantType='Primary'
            px='2.25rem'
            py='0.75rem'
            disabled={pdfCategoryOverLimit}
            className={
              pdfCategoryOverLimit
                ? 'cursor-not-allowed rounded-[3.75rem] !bg-[#CDD0D5] hover:!bg-[#CDD0D5]'
                : 'rounded-[3.75rem]'
            }
            onClick={handleNextStep}
          >
            다음으로
          </CommonButton>
        </div>
      )}
    </>
  );
}

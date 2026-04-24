'use client';

import { type MutableRefObject, type RefObject } from 'react';
import { CommonButton } from '@/components/CommonButton';
import type {
  PdfActivityBlock,
  PdfCategoryName,
  PortfolioType,
} from '@/types/correction';
import { CorrectionPdfTextSection } from './CorrectionPdfTextSection';
import { CorrectionPdfUploadBlock } from './CorrectionPdfUploadBlock';
import { CorrectionPortfolioTypeCards } from './CorrectionPortfolioTypeCards';
import {
  type TextPortfolioItem,
  CorrectionTextPortfolioSelect,
} from './CorrectionTextPortfolioSelect';

export type { TextPortfolioItem };

export interface CorrectionPortfolioStepProps {
  selectedPortfolioType: PortfolioType | null;
  onPortfolioSelect: (type: PortfolioType) => void;
  showTextPortfolioWarning: boolean;
  textPortfolios: TextPortfolioItem[];
  selectedTextPortfolioIds: string[];
  onTextPortfolioToggle: (portfolioId: string) => void;
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
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
  handleNextStep: () => void;
  pdfCategoryOverLimit: boolean;
  isTextPortfoliosLoading: boolean;
}

export function CorrectionPortfolioStep({
  selectedPortfolioType,
  onPortfolioSelect,
  showTextPortfolioWarning,
  textPortfolios,
  selectedTextPortfolioIds,
  onTextPortfolioToggle,
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
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
  handleNextStep,
  pdfCategoryOverLimit,
  isTextPortfoliosLoading,
}: CorrectionPortfolioStepProps) {
  return (
    <>
      <div
        className={`flex flex-col gap-[1.25rem] ${!selectedPortfolioType ? 'pb-[6.25rem]' : ''}`}
      >
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>포트폴리오 종류 선택</span>
          <span className='text-[#DC0000]'>*</span>
        </div>

        <CorrectionPortfolioTypeCards
          selectedPortfolioType={selectedPortfolioType}
          onPortfolioSelect={onPortfolioSelect}
          disabled={isPdfTextExtracted}
        />

        {selectedPortfolioType === 'text' && (
          <CorrectionTextPortfolioSelect
            showWarning={showTextPortfolioWarning}
            textPortfolios={textPortfolios}
            selectedTextPortfolioIds={selectedTextPortfolioIds}
            onTextPortfolioToggle={onTextPortfolioToggle}
            isLoading={isTextPortfoliosLoading}
          />
        )}

        {selectedPortfolioType === 'pdf' && (
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
                onPdfPortfoliosHydratedFromQuery={
                  onPdfPortfoliosHydratedFromQuery
                }
              />
            )}
          </div>
        )}
      </div>

      {/* 다음으로 버튼 */}
      {selectedPortfolioType &&
        !(
          selectedPortfolioType === 'pdf' &&
          (!isPdfTextExtracted || isPdfTextExtracting)
        ) && (
          <div className='flex justify-center pb-[6.25rem]'>
            <CommonButton
              variantType='Primary'
              px='2.25rem'
              py='0.75rem'
              disabled={
                pdfCategoryOverLimit ||
                (selectedPortfolioType === 'text' && textPortfolios.length === 0)
              }
              className={
                pdfCategoryOverLimit ||
                (selectedPortfolioType === 'text' &&
                  textPortfolios.length === 0)
                  ? 'rounded-[3.75rem] cursor-not-allowed !bg-[#CDD0D5] hover:!bg-[#CDD0D5]'
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

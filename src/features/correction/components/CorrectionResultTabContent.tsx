'use client';

import type { ResultButtonValue } from './CorrectionResultActivityDetail';
import { CorrectionResultSupportInfo } from './CorrectionResultSupportInfo';
import { CorrectionResultSummary } from './CorrectionResultSummary';
import { CorrectionResultActivityDetail } from './CorrectionResultActivityDetail';
import type { CorrectionResultResDTO, PortfolioDetailResDTO, CorrectionResultItemReqDTO } from '@/api/models';

export interface CorrectionResultTabContentProps {
  resultTab: string;
  correctionId?: string;
  correctionData?: CorrectionResultResDTO;
  portfolios?: PortfolioDetailResDTO[];
  detailInfoButton: ResultButtonValue;
  setDetailInfoButton: (value: ResultButtonValue) => void;
  responsibilityButton: ResultButtonValue;
  setResponsibilityButton: (value: ResultButtonValue) => void;
  problemSolvingButton: ResultButtonValue;
  setProblemSolvingButton: (value: ResultButtonValue) => void;
  lessonsButton: ResultButtonValue;
  setLessonsButton: (value: ResultButtonValue) => void;
}

export function CorrectionResultTabContent({
  resultTab,
  correctionId,
  correctionData,
  portfolios = [],
  detailInfoButton,
  setDetailInfoButton,
  responsibilityButton,
  setResponsibilityButton,
  problemSolvingButton,
  setProblemSolvingButton,
  lessonsButton,
  setLessonsButton,
}: CorrectionResultTabContentProps) {
  const isActivityTab = resultTab !== '지원 정보' && resultTab !== '총평';
  const activePortfolio = isActivityTab ? portfolios.find((p) => p.name === resultTab) : null;
  const activeCorrectionItem = activePortfolio 
    ? (correctionData?.items as unknown as CorrectionResultItemReqDTO[])?.find((item) => item.portfolioId === activePortfolio.id)
    : null;

  return (
    <div className='relative z-20 rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-t-0 border-[#E9EAEC] bg-[#FFFFFF] px-[2.5rem] py-[3rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
      {resultTab === '지원 정보' && (
        <CorrectionResultSupportInfo correctionId={correctionId} />
      )}
      {resultTab === '총평' && <CorrectionResultSummary overallReview={correctionData?.overallReview} />}
      {isActivityTab && activePortfolio && activeCorrectionItem && (
        <CorrectionResultActivityDetail
          portfolio={activePortfolio}
          correctionItem={activeCorrectionItem}
          detailInfoButton={detailInfoButton}
          setDetailInfoButton={setDetailInfoButton}
          responsibilityButton={responsibilityButton}
          setResponsibilityButton={setResponsibilityButton}
          problemSolvingButton={problemSolvingButton}
          setProblemSolvingButton={setProblemSolvingButton}
          lessonsButton={lessonsButton}
          setLessonsButton={setLessonsButton}
        />
      )}
    </div>
  );
}

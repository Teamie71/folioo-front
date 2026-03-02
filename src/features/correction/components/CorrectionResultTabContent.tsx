'use client';

import type { ResultTab } from './CorrectionResultTabs';
import type { ResultButtonValue } from './CorrectionResultActivityDetail';
import { CorrectionResultSupportInfo } from './CorrectionResultSupportInfo';
import { CorrectionResultSummary } from './CorrectionResultSummary';
import { CorrectionResultActivityDetail } from './CorrectionResultActivityDetail';

export interface CorrectionResultTabContentProps {
  resultTab: ResultTab;
  correctionId?: string;
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
  detailInfoButton,
  setDetailInfoButton,
  responsibilityButton,
  setResponsibilityButton,
  problemSolvingButton,
  setProblemSolvingButton,
  lessonsButton,
  setLessonsButton,
}: CorrectionResultTabContentProps) {
  return (
    <div className='relative z-20 rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-t-0 border-[#E9EAEC] bg-[#FFFFFF] px-[2.5rem] py-[3rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
      {resultTab === '지원 정보' && (
        <CorrectionResultSupportInfo correctionId={correctionId} />
      )}
      {resultTab === '총평' && <CorrectionResultSummary />}
      {(resultTab === '활동 A' || resultTab === '활동 B') && (
        <CorrectionResultActivityDetail
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

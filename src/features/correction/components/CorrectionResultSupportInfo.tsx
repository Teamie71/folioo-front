'use client';

import type { PortfolioCorrectionControllerGetCorrection200 } from '@/api/models';
import { usePortfolioCorrectionControllerGetCorrection } from '@/api/endpoints/portfolio-correction/portfolio-correction';

export interface CorrectionResultSupportInfoProps {
  correctionId?: string;
}

export function CorrectionResultSupportInfo({
  correctionId,
}: CorrectionResultSupportInfoProps) {
  const numericId = correctionId ? Number(correctionId) : NaN;
  const enabled = !!correctionId && !Number.isNaN(numericId);

  const { data } = usePortfolioCorrectionControllerGetCorrection(
    numericId || 0,
    { query: { enabled } },
  );

  const responseData = data as
    | PortfolioCorrectionControllerGetCorrection200
    | undefined;
  const result = responseData?.result;

  const companyName = result?.companyName?.trim() || '—';
  const positionName = result?.positionName?.trim() || '—';
  const jobDescription = result?.jobDescription?.trim() || '—';
  const companyInsight = result?.companyInsight?.trim() || '—';
  const highlightPoint = result?.highlightPoint?.trim() || '—';

  return (
    <div className='flex flex-col gap-[3.75rem]'>
      <div className='grid grid-cols-2 gap-[1.5rem]'>
        <div className='flex flex-col gap-[1rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
            <span>지원 기업명</span>
          </div>
          <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
            {companyName}
          </div>
        </div>
        <div className='flex flex-col gap-[1rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
            <span>지원 직무명</span>
          </div>
          <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
            {positionName}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>Job Description</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          {jobDescription}
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>기업 분석 정보</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          {companyInsight}
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>강조 포인트</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          {highlightPoint}
        </div>
      </div>
    </div>
  );
}

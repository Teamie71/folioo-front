'use client';

export interface CorrectionResultSupportInfoProps {
  correctionId?: string;
}

export function CorrectionResultSupportInfo({}: CorrectionResultSupportInfoProps) {
  return (
    <div className='flex flex-col gap-[3.75rem]'>
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

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>Job Description</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          —
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>기업 분석 정보</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          —
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>강조 포인트</span>
        </div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] text-[#74777D]'>
          —
        </div>
      </div>
    </div>
  );
}

'use client';

import InputArea from '@/components/InputArea';

export interface CorrectionCompanyJobFieldsProps {
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  informationErrors: {
    companyName: boolean;
    jobTitle: boolean;
  };
  limitAllowedInput: (value: string, maxLength: number) => string;
}

export function CorrectionCompanyJobFields({
  companyName,
  onCompanyNameChange,
  jobTitle,
  onJobTitleChange,
  informationErrors,
  limitAllowedInput,
}: CorrectionCompanyJobFieldsProps) {
  return (
    <div className='grid grid-cols-2 gap-[1.5rem]'>
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>지원 기업명</span>
          <span className='text-[#DC0000]'>*</span>
          {informationErrors.companyName && (
            <span className='ml-[0.25rem] text-[0.875rem] font-normal text-[#DC0000]'>
              지원 기업명을 입력해주세요.
            </span>
          )}
        </div>
        <InputArea
          placeholder='기업명을 입력해주세요.'
          value={companyName}
          maxLength={20}
          onChange={(e) => {
            const next = limitAllowedInput(e.target.value, 20);
            onCompanyNameChange(next);
          }}
        />
      </div>
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>지원 직무명</span>
          <span className='text-[#DC0000]'>*</span>
          {informationErrors.jobTitle && (
            <span className='ml-[0.25rem] text-[0.875rem] font-normal text-[#DC0000]'>
              지원 직무명을 입력해주세요.
            </span>
          )}
        </div>
        <InputArea
          placeholder='직무명을 입력해주세요.'
          value={jobTitle}
          maxLength={20}
          onChange={(e) => {
            const next = limitAllowedInput(e.target.value, 20);
            onJobTitleChange(next);
          }}
        />
      </div>
    </div>
  );
}

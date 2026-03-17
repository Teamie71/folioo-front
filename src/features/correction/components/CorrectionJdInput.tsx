'use client';

import TextField from '@/components/TextField';

export interface CorrectionJdInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  informationErrors: {
    jobDescription: boolean;
  };
}

export function CorrectionJdInput({
  jobDescription,
  onJobDescriptionChange,
  informationErrors,
}: CorrectionJdInputProps) {
  return (
    <div className='flex flex-col gap-[0.5rem] overflow-visible'>
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
        </div>
        {informationErrors.jobDescription && (
          <p className='text-[0.875rem] mt-[0.5rem] text-[#DC0000]'>
            Job Description을 입력해주세요.
          </p>
        )}
      </div>
      <div className='flex flex-col gap-[0.75rem]'>
        <TextField
          variant='wide'
          height='23.5rem'
          className='rounded-[1.25rem] px-[1.625rem] py-[1.25rem]'
          placeholder='채용공고의 JD를 복사 후 붙여넣기 해주세요.'
          value={jobDescription}
          maxLength={700}
          onChange={(e) => {
            onJobDescriptionChange(e.target.value.slice(0, 700));
          }}
        />
      </div>
    </div>
  );
}

'use client';

import TextField from '@/components/TextField';

export interface CorrectionJdInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  informationErrors: {
    jobDescription: boolean;
  };
  limitAllowedInput: (value: string, maxLength: number) => string;
}

export function CorrectionJdInput({
  jobDescription,
  onJobDescriptionChange,
  informationErrors,
  limitAllowedInput,
}: CorrectionJdInputProps) {
  return (
    <div className='flex flex-col gap-[0.5rem] overflow-visible'>
      <div>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] leading-[1.3] font-bold'>
          <span>Job Description</span>
          <span className='text-[#DC0000]'>*</span>
        </div>
        <div
          className={`flex items-center justify-between ${
            informationErrors.jobDescription ? 'mb-0' : 'mb-[1.25rem]'
          }`}
        >
          <span className='font-regular mb-[1.25rem] text-[0.875rem] leading-[1.5] text-[#74777D]'>
            JD는 채용공고에 명시된 직무 설명서로, 주로 담당할 업무, 자격요건,
            우대사항 등이 포함돼요.
          </span>
        </div>
        {informationErrors.jobDescription && (
          <p className='mt-[0.5rem] text-[0.875rem] leading-[1.5] text-[#DC0000]'>
            Job Description을 입력해주세요.
          </p>
        )}
      </div>

      <TextField
        variant='wide'
        height='23.5rem'
        className='rounded-[1.25rem] px-[1.625rem] py-[1.25rem]'
        placeholder='채용공고의 JD를 복사 후 붙여넣기 해주세요.'
        value={jobDescription}
        maxLength={1000}
        onChange={(event) =>
          onJobDescriptionChange(limitAllowedInput(event.target.value, 1000))
        }
      />
    </div>
  );
}

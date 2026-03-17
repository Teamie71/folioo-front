'use client';

import { CommonButton } from '@/components/CommonButton';
import { CorrectionIcon } from '@/components/icons/CorrectionIcon';
import { CorrectionCompanyJobFields } from './CorrectionCompanyJobFields';
import { CorrectionJdInput } from './CorrectionJdInput';

export interface CorrectionInformationStepProps {
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  informationErrors: {
    companyName: boolean;
    jobTitle: boolean;
    jobDescription: boolean;
  };
  limitAllowedInput: (value: string, maxLength: number) => string;
  onStartCorrectionClick: () => void;
}

export function CorrectionInformationStep({
  companyName,
  onCompanyNameChange,
  jobTitle,
  onJobTitleChange,
  jobDescription,
  onJobDescriptionChange,
  informationErrors,
  limitAllowedInput,
  onStartCorrectionClick,
}: CorrectionInformationStepProps) {
  return (
    <>
      <CorrectionCompanyJobFields
        companyName={companyName}
        onCompanyNameChange={onCompanyNameChange}
        jobTitle={jobTitle}
        onJobTitleChange={onJobTitleChange}
        informationErrors={informationErrors}
        limitAllowedInput={limitAllowedInput}
      />

      <CorrectionJdInput
        jobDescription={jobDescription}
        onJobDescriptionChange={onJobDescriptionChange}
        informationErrors={informationErrors}
      />

      {/* 첨삭 시작하기 버튼 */}
      <div className='flex justify-center pb-[6.25rem]'>
        <CommonButton
          variantType='Primary'
          px='2.25rem'
          py='0.75rem'
          className='gap-[0.75rem] rounded-[3.75rem] [&_svg]:h-[1.5rem] [&_svg]:w-[1.5rem]'
          onClick={onStartCorrectionClick}
        >
          <CorrectionIcon />
          첨삭 시작하기
        </CommonButton>
      </div>
    </>
  );
}

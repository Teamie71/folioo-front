'use client';

import { type RefObject } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { CorrectionIcon } from '@/components/icons/CorrectionIcon';
import type { JdMode } from '@/types/correction';
import { CorrectionCompanyJobFields } from './CorrectionCompanyJobFields';
import { CorrectionJdInput } from './CorrectionJdInput';

export interface CorrectionInformationStepProps {
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  jdMode: JdMode;
  onJdModeChange: (value: JdMode) => void;
  informationErrors: {
    companyName: boolean;
    jobTitle: boolean;
    jobDescription: boolean;
  };
  jdImageError: null | 'required' | 'too_large' | 'too_many';
  jdUploadedFiles: Array<{ name: string; size: number; previewUrl: string }>;
  limitAllowedInput: (value: string, maxLength: number) => string;
  onStartCorrectionClick: () => void;
  jdFileInputRef: RefObject<HTMLInputElement | null>;
  onRequestFileDelete: (index: number) => void;
  onRequestJdViewer: (index: number) => void;
  onJdImageFile: (file: File) => void;
  onPasteJdImage: () => void;
}

export function CorrectionInformationStep({
  companyName,
  onCompanyNameChange,
  jobTitle,
  onJobTitleChange,
  jobDescription,
  onJobDescriptionChange,
  jdMode,
  onJdModeChange,
  informationErrors,
  jdImageError,
  jdUploadedFiles,
  limitAllowedInput,
  onStartCorrectionClick,
  jdFileInputRef,
  onRequestFileDelete,
  onRequestJdViewer,
  onJdImageFile,
  onPasteJdImage,
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
        jdMode={jdMode}
        onJdModeChange={onJdModeChange}
        informationErrors={informationErrors}
        jdImageError={jdImageError}
        jdUploadedFiles={jdUploadedFiles}
        limitAllowedInput={limitAllowedInput}
        jdFileInputRef={jdFileInputRef}
        onRequestFileDelete={onRequestFileDelete}
        onRequestJdViewer={onRequestJdViewer}
        onJdImageFile={onJdImageFile}
        onPasteJdImage={onPasteJdImage}
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

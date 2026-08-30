'use client';

import { type RefObject } from 'react';
import TextField from '@/components/TextField';
import { ToggleSmall } from '@/components/ToggleSmall';
import { FileCloseIcon } from '@/components/icons/FileCloseIcon';
import { FileImageIcon } from '@/components/icons/FileImageIcon';
import { FullIcon } from '@/components/icons/FullIcon';
import type { JdMode } from '@/types/correction';

export interface CorrectionJdInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  jdMode: JdMode;
  onJdModeChange: (value: JdMode) => void;
  informationErrors: {
    jobDescription: boolean;
  };
  jdImageError: null | 'required' | 'too_large' | 'too_many';
  jdUploadedFiles: Array<{
    name: string;
    size: number;
    previewUrl: string;
  }>;
  jdFileInputRef: RefObject<HTMLInputElement | null>;
  onRequestFileDelete: (index: number) => void;
  onRequestJdViewer: (index: number) => void;
  onJdImageFile: (file: File) => void;
  onPasteJdImage: () => void;
  limitAllowedInput: (value: string, maxLength: number) => string;
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024).toFixed(1)} KB`;
}

interface JdImagePreviewProps {
  file: { name: string; size: number; previewUrl: string };
  index: number;
  onRequestFileDelete: (index: number) => void;
  onRequestJdViewer: (index: number) => void;
}

function JdImagePreview({
  file,
  index,
  onRequestFileDelete,
  onRequestJdViewer,
}: JdImagePreviewProps) {
  return (
    <div className='flex h-[19.125rem] w-[32.25rem] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-[#74777D] bg-[#FFFFFF]'>
      <div className='group relative flex flex-1 items-center justify-center overflow-hidden p-[1.5rem]'>
        <img
          src={file.previewUrl}
          alt={`${file.name} 미리보기`}
          className='h-full w-full object-contain'
        />
        <button
          type='button'
          aria-label='파일 삭제'
          className='absolute top-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#74777D] opacity-0 transition-opacity group-hover:opacity-100'
          onClick={() => onRequestFileDelete(index)}
        >
          <FileCloseIcon />
        </button>
        <button
          type='button'
          aria-label='이미지 전체보기'
          className='absolute right-[0.75rem] bottom-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#FFFFFF] shadow-[0_0_0.5rem_0_rgba(0,0,0,0.25)]'
          onClick={() => onRequestJdViewer(index)}
        >
          <FullIcon />
        </button>
      </div>
      <div className='flex h-[4.125rem] shrink-0 items-center gap-[0.75rem] border-t border-[#9EA4A9] px-[1rem] py-[0.75rem]'>
        <div className='flex h-[2.5rem] w-[2.5rem] shrink-0 items-center justify-center'>
          <FileImageIcon />
        </div>
        <div className='min-w-0'>
          <p className='truncate text-[0.875rem] leading-[1.5] font-bold text-[#1A1A1A]'>
            {file.name}
          </p>
          <p className='text-[0.75rem] leading-[1.5] text-[#74777D]'>
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CorrectionJdInput({
  jobDescription,
  onJobDescriptionChange,
  jdMode,
  onJdModeChange,
  informationErrors,
  jdImageError,
  jdUploadedFiles,
  jdFileInputRef,
  onRequestFileDelete,
  onRequestJdViewer,
  onJdImageFile,
  onPasteJdImage,
  limitAllowedInput,
}: CorrectionJdInputProps) {
  const showImageError = jdMode === 'image' && informationErrors.jobDescription;

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
          <span className='font-regular text-[0.875rem] leading-[1.5] text-[#74777D]'>
            JD는 채용공고에 명시된 직무 설명서로, 주로 담당할 업무, 자격요건,
            우대사항 등이 포함돼요.
          </span>
          <ToggleSmall
            options={[
              { value: 'text', label: '텍스트' },
              { value: 'image', label: '이미지' },
            ]}
            value={jdMode}
            onChange={(value) => onJdModeChange(value as JdMode)}
          />
        </div>
        {informationErrors.jobDescription && (
          <p className='mt-[0.5rem] text-[0.875rem] leading-[1.5] text-[#DC0000]'>
            {showImageError
              ? jdImageError === 'too_large' || jdImageError === 'too_many'
                ? '1MB 이하의 이미지 파일만 업로드 가능하며, 최대 2개까지만 업로드 가능해요.'
                : 'Job Description 이미지를 업로드해주세요.'
              : 'Job Description을 입력해주세요.'}
          </p>
        )}
      </div>

      {jdMode === 'text' ? (
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
      ) : (
        <div className='flex gap-[1.5rem]'>
          <input
            ref={jdFileInputRef}
            type='file'
            accept='.jpg,.jpeg,.png,image/jpeg,image/png'
            className='hidden'
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onJdImageFile(file);
            }}
          />

          {jdUploadedFiles.length >= 2 ? (
            <JdImagePreview
              file={jdUploadedFiles[1]}
              index={1}
              onRequestFileDelete={onRequestFileDelete}
              onRequestJdViewer={onRequestJdViewer}
            />
          ) : (
            <div className='flex h-[19.125rem] w-[32.25rem] shrink-0 flex-col gap-[0.5rem] rounded-[1.25rem] bg-[#F6F8FA] px-[1.5rem] py-[1.25rem]'>
              <button
                type='button'
                className='flex h-[7.125rem] cursor-pointer items-center justify-center gap-[3.625rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
                onClick={() => jdFileInputRef.current?.click()}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='40'
                  height='40'
                  viewBox='0 0 60 60'
                  fill='none'
                  aria-hidden
                >
                  <path
                    d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                    stroke='#9EA4A9'
                    strokeWidth='4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-left text-[0.875rem] leading-[1.5] text-[#1A1A1A]'>
                  클릭하여 JD 파일을 업로드 하세요.
                  <br />
                  <span className='text-[#74777D]'>
                    (JPG, PNG 파일만 업로드 가능)
                  </span>
                </span>
              </button>
              <div className='relative flex h-[1.375rem] items-center'>
                <div className='h-px w-full bg-[#CDD0D5]' />
                <span className='absolute left-1/2 -translate-x-1/2 bg-[#F6F8FA] px-[1rem] text-[0.875rem] leading-[1.5] text-[#1A1A1A]'>
                  또는
                </span>
              </div>
              <button
                type='button'
                className='flex h-[7.125rem] cursor-pointer items-center justify-center gap-[2rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
                onClick={onPasteJdImage}
              >
                <svg
                  width='40'
                  height='40'
                  viewBox='0 0 60 60'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden
                >
                  <path
                    d='M3.21484 10.2338V7.5C3.21484 6.50544 3.60993 5.55161 4.31319 4.84835C5.01645 4.14509 5.97028 3.75 6.96484 3.75H14.4648V7.5H6.96484V52.5H21.9648V56.25H6.96484C5.97028 56.25 5.01645 55.8549 4.31319 55.1516C3.60993 54.4484 3.21484 53.4946 3.21484 52.5V10.2338ZM48.2148 18.75V7.5C48.2148 6.50544 47.8198 5.55161 47.1165 4.84835C46.4132 4.14509 45.4594 3.75 44.4648 3.75H36.9648V7.5H44.4648V18.75H48.2148ZM44.4648 22.5H51.9648V56.25H25.7148V22.5H44.4648ZM44.4648 18.75H25.7148C24.7203 18.75 23.7665 19.1451 23.0632 19.84835C22.3599 20.5516 21.9648 21.5054 21.9648 22.5V56.25C21.9648 57.2446 22.3599 58.1984 23.0632 58.9016C23.7665 59.6049 24.7203 60 25.7148 60H51.9648C52.9594 60 53.9132 59.6049 54.6165 58.9016C55.3198 58.1984 55.7148 57.2446 55.7148 56.25V22.5C55.7148 21.5054 55.3198 20.5516 54.6165 19.84835C53.9132 19.1451 52.9594 18.75 51.9648 18.75H44.4648Z'
                    fill='#9EA4A9'
                  />
                  <path
                    d='M29.4648 37.5H48.2148V33.75H29.4648V37.5ZM29.4648 30H48.2148V26.25H29.4648V30ZM29.4648 45H48.2148V41.25H29.4648V45ZM29.4648 52.5H48.2148V48.75H29.4648V52.5ZM36.9648 7.5V3.75C36.9648 2.75544 36.5698 1.80161 35.8665 1.09835C35.1632 0.395088 34.2094 0 33.2148 0L18.2148 0C17.2203 0 16.2665 0.395088 15.5632 1.09835C14.8599 1.80161 14.4648 2.75544 14.4648 3.75V7.5H18.2148V3.75H33.2148V7.5H36.9648ZM14.4648 11.25H36.9648V7.5H14.4648V11.25Z'
                    fill='#9EA4A9'
                  />
                </svg>
                <span className='text-[0.875rem] leading-[1.5] text-[#1A1A1A]'>
                  클릭하여 복사한 JD 이미지를 업로드 하세요.
                </span>
              </button>
            </div>
          )}

          {jdUploadedFiles.length > 0 ? (
            <JdImagePreview
              file={jdUploadedFiles[0]}
              index={0}
              onRequestFileDelete={onRequestFileDelete}
              onRequestJdViewer={onRequestJdViewer}
            />
          ) : (
            <div className='h-[19.125rem] w-[32.25rem] shrink-0 rounded-[1.25rem] border border-dashed border-[#CDD0D5] bg-[#FDFDFD]' />
          )}
        </div>
      )}
    </div>
  );
}

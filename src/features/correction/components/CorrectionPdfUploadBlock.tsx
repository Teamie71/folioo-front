'use client';

import { type RefObject } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { FileCloseIcon } from '@/components/icons/FileCloseIcon';
import { PdfIcon } from '@/components/icons/PdfIcon';

export interface CorrectionPdfUploadBlockProps {
  pdfUploadedFile: { name: string } | null;
  pdfUploadError: null | 'too_large' | 'too_many';
  pdfFileInputRef: RefObject<HTMLInputElement | null>;
  onPdfFileSelect: (file: File) => void;
  onRequestPdfFileDelete: () => void;
  onRequestPdfExtract: () => void;
  isPdfTextExtracted: boolean;
  /** 추출 모달 확인 후·추출 중에는 파일 삭제(호버) 비활성 */
  isPdfTextExtracting: boolean;
}

export function CorrectionPdfUploadBlock({
  pdfUploadedFile,
  pdfUploadError,
  pdfFileInputRef,
  onPdfFileSelect,
  onRequestPdfFileDelete,
  onRequestPdfExtract,
  isPdfTextExtracted,
  isPdfTextExtracting,
}: CorrectionPdfUploadBlockProps) {
  const showFileDeleteOnHover =
    pdfUploadedFile && !isPdfTextExtracted && !isPdfTextExtracting;
  /** 재진입 복원: 파일 객체는 없지만 이미 추출된 상태 */
  const isRestoredWithoutFile = isPdfTextExtracted && !pdfUploadedFile;

  return (
    <div className='mt-[4.75rem] flex flex-col gap-[1.25rem]'>
      <div>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>PDF 포트폴리오 업로드</span>
          <span className='text-[#DC0000]'>*</span>
        </div>
        {pdfUploadError === 'too_large' && (
          <p className='mt-[0.5rem] text-[0.875rem] text-[#DC0000]'>
            최대 10MB의 PDF 파일만 업로드 가능해요.
          </p>
        )}
      </div>
      <div className='rounded-[1rem] border border-[#E9EAEC] bg-[#FDFDFD] p-[1rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
        <div className='grid grid-cols-2 gap-[4rem] pl-[2.75rem]'>
          <div className='flex flex-col justify-center gap-[1.5rem]'>
            <div className='flex flex-col'>
              <span className='text-[0.875rem] text-[#1A1A1A]'>
                업로드하신 포트폴리오 파일의 텍스트를 추출하여 첨삭을
                진행해요.
              </span>
              <span className='text-[0.875rem] text-[#1A1A1A]'>
                최대 10MB의 파일, 최대 5개의 활동 첨삭이 가능해요.
              </span>
            </div>
            <CommonButton
              variantType='Primary'
              px='2.25rem'
              py='0.75rem'
              disabled={!pdfUploadedFile || isPdfTextExtracted}
              className='self-start rounded-[3.75rem]'
              onClick={() => pdfUploadedFile && onRequestPdfExtract()}
            >
              텍스트 추출하기
            </CommonButton>
          </div>

          <input
            ref={pdfFileInputRef}
            type='file'
            accept='.pdf,application/pdf'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) onPdfFileSelect(file);
            }}
          />
          <div
            role='button'
            tabIndex={0}
            className='group relative flex flex-col items-center justify-center gap-[0.75rem] rounded-[1rem] border border-[#CDD0D5] bg-[#FFFFFF] p-[3rem] cursor-pointer'
            onClick={() =>
              pdfUploadedFile
                ? undefined
                : pdfFileInputRef.current?.click()
            }
            onKeyDown={(e) => {
              if (
                !pdfUploadedFile &&
                (e.key === 'Enter' || e.key === ' ')
              ) {
                e.preventDefault();
                pdfFileInputRef.current?.click();
              }
            }}
          >
            {pdfUploadedFile || isRestoredWithoutFile ? (
              <>
                <PdfIcon />
                <span className='text-center text-[0.875rem] text-[#1A1A1A]'>
                  {pdfUploadedFile
                    ? pdfUploadedFile.name.endsWith('.pdf')
                      ? pdfUploadedFile.name
                      : `${pdfUploadedFile.name}.pdf`
                    : 'PDF 파일'}
                </span>
                {showFileDeleteOnHover && (
                  <button
                    type='button'
                    className='absolute top-[0.75rem] right-[0.75rem] flex h-[1.5rem] w-[1.5rem] cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#74777D] opacity-0 transition-opacity duration-150 group-hover:opacity-100'
                    aria-label='파일 삭제'
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestPdfFileDelete();
                    }}
                  >
                    <FileCloseIcon />
                  </button>
                )}
              </>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='40'
                  height='40'
                  viewBox='0 0 60 60'
                  fill='none'
                >
                  <path
                    d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                    stroke='#74777D'
                    strokeWidth='4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-center text-[0.875rem] text-[#74777D]'>
                  클릭하여 파일을 업로드하세요.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

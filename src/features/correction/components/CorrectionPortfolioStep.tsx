'use client';

import { type MutableRefObject, type RefObject } from 'react';
import { PortfolioCard } from '@/components/PortfolioCard';
import { PortfolioTypeCard } from '@/components/PortfolioTypeCard';
import { CommonButton } from '@/components/CommonButton';
import { FileCloseIcon } from '@/components/icons/FileCloseIcon';
import { PdfIcon } from '@/components/icons/PdfIcon';
import ActivityDeleteIcon from '@/components/icons/ActivityDeleteIcon';
import RedDotIcon from '@/components/icons/RedDotIcon';
import {
  PDF_CATEGORY_CHAR_LIMIT,
  PDF_CATEGORY_NAMES,
  createPdfActivityBlock,
} from '@/features/correction/constants';
import type {
  PdfActivityBlock,
  PdfCategoryName,
  PortfolioType,
} from '@/types/correction';

export interface TextPortfolioItem {
  id: string;
  title: string;
  tag: string;
  date: string;
}

export interface CorrectionPortfolioStepProps {
  selectedPortfolioType: PortfolioType | null;
  onPortfolioSelect: (type: PortfolioType) => void;
  showTextPortfolioWarning: boolean;
  textPortfolios: TextPortfolioItem[];
  selectedTextPortfolioIds: string[];
  onTextPortfolioToggle: (portfolioId: string) => void;
  pdfUploadedFile: { name: string } | null;
  pdfUploadError: null | 'too_large' | 'too_many';
  pdfFileInputRef: RefObject<HTMLInputElement | null>;
  onPdfFileSelect: (file: File) => void;
  onRequestPdfFileDelete: () => void;
  onRequestPdfExtract: () => void;
  isPdfTextExtracted: boolean;
  isPdfTextExtracting: boolean;
  pdfActivities: PdfActivityBlock[];
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  selectedActivityId: string;
  onActivitySelect: (id: string) => void;
  selectedTab: PdfCategoryName;
  onTabSelect: (tab: PdfCategoryName) => void;
  PDF_CATEGORY_NAMES: readonly PdfCategoryName[];
  PDF_CATEGORY_CHAR_LIMIT: number;
  createPdfActivityBlock: (id: string, label: string) => PdfActivityBlock;
  bulletTextareaRefs: MutableRefObject<(HTMLTextAreaElement | null)[]>;
  lastBulletEnterAt: MutableRefObject<number>;
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
  handleNextStep: () => void;
  pdfCategoryOverLimit: boolean;
}

export function CorrectionPortfolioStep({
  selectedPortfolioType,
  onPortfolioSelect,
  showTextPortfolioWarning,
  textPortfolios,
  selectedTextPortfolioIds,
  onTextPortfolioToggle,
  pdfUploadedFile,
  pdfUploadError,
  pdfFileInputRef,
  onPdfFileSelect,
  onRequestPdfFileDelete,
  onRequestPdfExtract,
  isPdfTextExtracted,
  isPdfTextExtracting,
  pdfActivities,
  setPdfActivities,
  selectedActivityId,
  onActivitySelect,
  selectedTab,
  onTabSelect,
  PDF_CATEGORY_NAMES,
  PDF_CATEGORY_CHAR_LIMIT,
  createPdfActivityBlock,
  bulletTextareaRefs,
  lastBulletEnterAt,
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
  handleNextStep,
  pdfCategoryOverLimit,
}: CorrectionPortfolioStepProps) {
  return (
    <>
      {/* 포트폴리오 종류 선택 */}
      <div
        className={`flex flex-col gap-[1.25rem] ${!selectedPortfolioType ? 'pb-[6.25rem]' : ''}`}
      >
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
          <span>포트폴리오 종류 선택</span>
          <span className='text-[#DC0000]'>*</span>
        </div>

        <div className='grid grid-cols-2 gap-[1.5rem]'>
          {/* 텍스트형 포트폴리오 */}
          <PortfolioTypeCard
            icon={
              <svg
                width='52'
                height='52'
                viewBox='0 0 52 52'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H32.5V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM6.266 51.5093V40.664H9.958V38.5125H0V40.664H3.6855V51.5093H6.266ZM21.5053 38.5125H18.5998L15.925 43.1892H15.8112L13.1073 38.5125H10.0782L14.0693 44.9573L10.0393 51.5093H12.8407L15.613 46.9105H15.7268L18.4893 51.5093H21.437L17.3647 45.0353L21.5053 38.5125ZM27.7778 40.664V51.5093H25.1972V40.664H21.5117V38.5125H31.4697V40.664H27.7745H27.7778Z'
                  fill='#5060C5'
                />
              </svg>
            }
            title='텍스트형 포트폴리오'
            description='경험 정리를 바탕으로 생성된 텍스트형 포트폴리오를 첨삭해요.'
            selected={selectedPortfolioType === 'text'}
            onClick={() => onPortfolioSelect('text')}
          />

          {/* PDF 포트폴리오 */}
          <PortfolioTypeCard
            icon={
              <svg
                width='52'
                height='52'
                viewBox='0 0 52 52'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H35.75V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM5.2 38.5125H0V51.5093H2.57075V47.1478H5.1805C6.11217 47.1478 6.90517 46.9603 7.5595 46.5855C8.22033 46.2063 8.72192 45.6928 9.06425 45.045C9.42107 44.3673 9.60104 43.6105 9.5875 42.8447C9.5875 42.0322 9.41633 41.2988 9.074 40.6445C8.73105 39.9977 8.21296 39.4604 7.579 39.0942C6.929 38.7043 6.136 38.5103 5.2 38.5125ZM6.97125 42.8447C6.98229 43.2729 6.88739 43.6971 6.695 44.0798C6.52249 44.4132 6.25274 44.6863 5.9215 44.863C5.5429 45.0494 5.12461 45.1409 4.70275 45.1295H2.561V40.56H4.706C5.4145 40.56 5.96917 40.7561 6.37 41.1483C6.77083 41.5448 6.97125 42.1102 6.97125 42.8447ZM10.9265 38.5125V51.5093H15.6715C16.9758 51.5093 18.057 51.2525 18.915 50.739C19.7833 50.2195 20.4613 49.4344 20.8487 48.4998C21.2734 47.5247 21.4858 46.3504 21.4858 44.9767C21.4858 43.6117 21.2734 42.4472 20.8487 41.483C20.465 40.5596 19.7937 39.7845 18.9345 39.273C18.0765 38.766 16.9878 38.5125 15.6683 38.5125H10.9265ZM13.4972 40.6087H15.327C16.1308 40.6087 16.7906 40.7734 17.3062 41.1028C17.841 41.4554 18.2451 41.9737 18.4567 42.5783C18.7124 43.2326 18.8403 44.0483 18.8403 45.0255C18.8503 45.6737 18.776 46.3205 18.6193 46.9495C18.5071 47.4469 18.2899 47.9145 17.9823 48.321C17.6995 48.6855 17.3248 48.9681 16.8967 49.14C16.3951 49.3275 15.8624 49.418 15.327 49.4065H13.4972V40.6087ZM25.662 46.3385V51.5093H23.0945V38.5125H31.3755V40.6348H25.662V44.265H30.8815V46.3385H25.662Z'
                  fill='#5060C5'
                />
              </svg>
            }
            title='PDF 포트폴리오'
            description='업로드한 PDF 포트폴리오의 텍스트를 첨삭해요.'
            selected={selectedPortfolioType === 'pdf'}
            onClick={() => onPortfolioSelect('pdf')}
          />
        </div>

        {/* 텍스트형 포트폴리오 선택 리스트 */}
        {selectedPortfolioType === 'text' && (
          <div className='mt-[4.75rem] flex flex-col'>
            <div className='flex items-center text-[1.125rem] font-bold leading-[1.3]'>
              <span>텍스트형 포트폴리오 선택</span>
            </div>
            <span className='pt-[0.25rem] text-[0.875rem] text-[#74777D]'>
              경험 정리를 통해 생성한 포트폴리오 중, 첨삭을 진행할
              포트폴리오를 최대 5개 클릭하여 선택해주세요.
            </span>
            {showTextPortfolioWarning && (
              <span className='mt-[1.75rem] mb-[0.5rem] text-[0.875rem] text-[#DC0000]'>
                첨삭할 텍스트형 포트폴리오를 선택해주세요
              </span>
            )}
            <div
              className={`grid grid-cols-2 gap-[1.5rem] ${
                showTextPortfolioWarning ? 'mt-[0.5rem]' : 'mt-[1.25rem]'
              }`}
            >
              {textPortfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  title={portfolio.title}
                  tag={portfolio.tag}
                  date={portfolio.date}
                  selected={selectedTextPortfolioIds.includes(portfolio.id)}
                  onClick={() => onTextPortfolioToggle(portfolio.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* PDF 포트폴리오 업로드 섹션 */}
        {selectedPortfolioType === 'pdf' && (
          <div
            className={`mt-[4.75rem] flex flex-col gap-[1.25rem] ${!isPdfTextExtracted || isPdfTextExtracting ? 'pb-[6.25rem]' : ''}`}
          >
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
                      업로드하신 포트폴리오 파일의 텍스트를 추출하여
                      첨삭을 진행해요.
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
                    onClick={() =>
                      pdfUploadedFile && onRequestPdfExtract()
                    }
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
                  {pdfUploadedFile ? (
                    <>
                      <PdfIcon />
                      <span className='text-center text-[0.875rem] text-[#1A1A1A]'>
                        {pdfUploadedFile.name.endsWith('.pdf')
                          ? pdfUploadedFile.name
                          : `${pdfUploadedFile.name}.pdf`}
                      </span>
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
        )}

        {/* PDF 포트폴리오 텍스트 정리 섹션 */}
        {selectedPortfolioType === 'pdf' && isPdfTextExtracted && (
          <div className='mt-[3.75rem] flex flex-col'>
            <div className='mb-[0.5rem] flex items-center text-[1.125rem] font-bold leading-[1.3]'>
              <span>PDF 포트폴리오 텍스트 정리</span>
            </div>
            <div className='mb-[2.5rem] flex flex-col'>
              <span className='text-[0.875rem] text-[#74777D]'>
                업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된
                부분이나 추가하실 부분이 있다면 수정해주세요.
              </span>
              <span className='text-[0.875rem] text-[#74777D]'>
                삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지
                않아요.
              </span>
            </div>

            {isPdfTextExtracting ? (
              <div className='flex flex-col items-center justify-center gap-[2rem] py-[4rem]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='56'
                  height='60'
                  viewBox='0 0 56 60'
                  fill='none'
                >
                  <path
                    opacity='0.1'
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M28 8C22.6957 8 17.6086 10.1071 13.8579 13.8579C10.1071 17.6086 8 22.6957 8 28C8 33.3043 10.1071 38.3914 13.8579 42.1421C17.6086 45.8929 22.6957 48 28 48C33.3043 48 38.3914 45.8929 42.1421 42.1421C45.8929 38.3914 48 33.3043 48 28C48 22.6957 45.8929 17.6086 42.1421 13.8579C38.3914 10.1071 33.3043 8 28 8ZM0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z'
                    fill='#74777D'
                  />
                  <g
                    className='animate-spin'
                    style={{ transformOrigin: '28px 28px' }}
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M28.0007 8.00003C22.8444 7.989 17.8852 9.9805 14.1687 13.5547C13.3987 14.2666 12.3801 14.6477 11.3319 14.6159C10.2838 14.5841 9.29007 14.142 8.56467 13.3848C7.83927 12.6276 7.44023 11.6158 7.45344 10.5673C7.46666 9.51879 7.89108 8.51738 8.63534 7.7787C13.8408 2.77773 20.7822 -0.0105164 28.0007 2.98087e-05C29.0615 2.98087e-05 30.079 0.421457 30.8291 1.1716C31.5792 1.92175 32.0007 2.93916 32.0007 4.00003C32.0007 5.0609 31.5792 6.07831 30.8291 6.82846C30.079 7.5786 29.0615 8.00003 28.0007 8.00003Z'
                      fill='url(#paint0_linear_pdf_extract)'
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id='paint0_linear_pdf_extract'
                      x1='19.7269'
                      y1='0'
                      x2='19.7269'
                      y2='14.6177'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#93B3F4' />
                      <stop offset='1' stopColor='#5060C5' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            ) : (
              <>
                {/* 활동 탭 */}
                <div className='flex'>
                  {pdfActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className='group relative flex'
                      onMouseEnter={() => setPdfActivityHoverId(activity.id)}
                      onMouseLeave={() => setPdfActivityHoverId(null)}
                    >
                      <button
                        type='button'
                        onClick={() => onActivitySelect(activity.id)}
                        className={`relative cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                          selectedActivityId === activity.id
                            ? 'z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                            : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                        }`}
                      >
                        <span className='relative inline-block'>
                          {activity.label}
                          {activity.categories.some(
                            (c) =>
                              c.bullets.reduce((s, b) => s + b.length, 0) >
                              PDF_CATEGORY_CHAR_LIMIT,
                          ) && (
                            <span className='absolute -right-2'>
                              <RedDotIcon />
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        type='button'
                        aria-label='활동 삭제'
                        className={`absolute top-[0.5rem] right-[0.5rem] z-20 flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center transition-opacity duration-150 [&_svg]:h-[0.875rem] [&_svg]:w-[0.875rem] ${
                          pdfActivityHoverId === activity.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestActivityDelete(activity.id);
                        }}
                      >
                        <ActivityDeleteIcon />
                      </button>
                    </div>
                  ))}
                  {pdfActivities.length < 5 && (
                    <button
                      type='button'
                      className='cursor-pointer rounded-t-[1.25rem] border-none bg-[#F6F8FA] px-[3rem] py-[1rem] text-[0.875rem] font-medium text-[#9EA4A9] transition-all'
                      onClick={() => {
                        const usedLetters = pdfActivities.map((a) =>
                          a.label.slice(-1),
                        );
                        const nextLetter = ['A', 'B', 'C', 'D', 'E'].find(
                          (l) => !usedLetters.includes(l),
                        );
                        if (!nextLetter) return;
                        const newId = `pdf-act-${Date.now()}`;
                        setPdfActivities((prev) => [
                          ...prev,
                          createPdfActivityBlock(newId, `활동 ${nextLetter}`),
                        ]);
                        onActivitySelect(newId);
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 16 16'
                        fill='#5060C5'
                      >
                        <path
                          d='M8 3.33333V12.6667M3.33333 8H12.6667'
                          stroke='#5060C5'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* 사이드바 및 내용 영역 */}
                <div className='relative z-20 flex min-h-[397px] rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                  <div className='flex flex-col'>
                    {PDF_CATEGORY_NAMES.map((name) => {
                      const selectedActivity = pdfActivities.find(
                        (a) => a.id === selectedActivityId,
                      );
                      const category = selectedActivity?.categories.find(
                        (c) => c.name === name,
                      );
                      const categoryOverLimit =
                        (category?.bullets.reduce(
                          (s, b) => s + b.length,
                          0,
                        ) ?? 0) > PDF_CATEGORY_CHAR_LIMIT;
                      return (
                        <button
                          key={name}
                          type='button'
                          onClick={() => onTabSelect(name)}
                          className={`relative cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] transition-all ${
                            selectedTab === name
                              ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                              : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                          }`}
                        >
                          <span className='relative inline-block'>
                            {name}
                            {categoryOverLimit && (
                              <span className='absolute -right-2'>
                                <RedDotIcon />
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className='w-[1px] bg-[#CDD0D5]' />

                  {/* 내용 영역 - 불릿 포인트 에디터 */}
                  <div className='flex flex-1 flex-col gap-[0.5rem] rounded-tr-[1.25rem] rounded-br-[1.25rem] bg-[#FFFFFF] px-[2.25rem] py-[1.5rem] text-[0.875rem] text-[#1A1A1A]'>
                    {(() => {
                      const activity = pdfActivities.find(
                        (a) => a.id === selectedActivityId,
                      );
                      const category = activity?.categories.find(
                        (c) => c.name === selectedTab,
                      );
                      const bullets = category?.bullets ?? [''];
                      const categoryCharCount = bullets.reduce(
                        (sum, b) => sum + b.length,
                        0,
                      );
                      const setBullets = (next: string[]) => {
                        if (!activity || !category) return;
                        setPdfActivities((prev) =>
                          prev.map((a) =>
                            a.id !== activity.id
                              ? a
                              : {
                                  ...a,
                                  categories: a.categories.map((c) =>
                                    c.name !== selectedTab
                                      ? c
                                      : { ...c, bullets: next },
                                  ),
                                },
                          ),
                        );
                      };
                      bulletTextareaRefs.current = [];
                      return (
                        <>
                          <div className='flex flex-1 flex-col gap-[0.5rem]'>
                            {bullets.map((text, idx) => (
                              <div
                                key={idx}
                                className='flex items-start gap-[0.5rem]'
                              >
                                <span className='flex h-[1.5em] shrink-0 items-center text-[0.875rem] leading-[1.5] text-[#1A1A1A]'>
                                  •
                                </span>
                                <textarea
                                  className='min-h-[1.5rem] w-full resize-none overflow-hidden border-none bg-transparent p-0 text-[0.875rem] leading-[1.5] text-[#1A1A1A] outline-none placeholder:text-[#9EA4A9]'
                                  placeholder='내용을 입력하세요'
                                  value={text}
                                  ref={(el) => {
                                    bulletTextareaRefs.current[idx] = el;
                                    if (el) {
                                      el.style.height = 'auto';
                                      el.style.height = `${el.scrollHeight}px`;
                                    }
                                  }}
                                  onChange={(e) => {
                                    const next = [...bullets];
                                    next[idx] = e.target.value;
                                    setBullets(next);
                                    const ta = e.target;
                                    ta.style.height = 'auto';
                                    ta.style.height = `${ta.scrollHeight}px`;
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.repeat) return;
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const now = Date.now();
                                      if (now - lastBulletEnterAt.current < 150)
                                        return;
                                      lastBulletEnterAt.current = now;
                                      const next = [...bullets];
                                      next.splice(idx + 1, 0, '');
                                      setBullets(next);
                                      setTimeout(() => {
                                        bulletTextareaRefs.current?.[idx + 1]?.focus();
                                      }, 0);
                                    } else if (
                                      e.key === 'Backspace' &&
                                      text === '' &&
                                      bullets.length > 1
                                    ) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const next = bullets.filter(
                                        (_, i) => i !== idx,
                                      );
                                      setBullets(next);
                                      const prevIdx = idx - 1;
                                      setTimeout(() => {
                                        const prev =
                                          bulletTextareaRefs.current?.[prevIdx];
                                        if (prev) {
                                          prev.focus();
                                          const len = prev.value.length;
                                          prev.setSelectionRange(len, len);
                                        }
                                      }, 0);
                                    } else if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const prevIdx = idx - 1;
                                      setTimeout(() => {
                                        const prev =
                                          bulletTextareaRefs.current?.[prevIdx];
                                        if (
                                          prev &&
                                          prev !== document.activeElement
                                        )
                                          prev.focus();
                                      }, 0);
                                    } else if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const nextIdx = idx + 1;
                                      setTimeout(() => {
                                        const next =
                                          bulletTextareaRefs.current?.[nextIdx];
                                        if (
                                          next &&
                                          next !== document.activeElement
                                        )
                                          next.focus();
                                      }, 0);
                                    }
                                  }}
                                  rows={1}
                                />
                              </div>
                            ))}
                          </div>
                          <div className='mt-[0.5rem] flex justify-end'>
                            <span
                              className={`text-[0.875rem] ${
                                categoryCharCount > 390
                                  ? 'text-[#DC0000]'
                                  : 'text-[#74777D]'
                              }`}
                            >
                              {categoryCharCount} / {PDF_CATEGORY_CHAR_LIMIT}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 다음으로 버튼 */}
      {selectedPortfolioType &&
        !(
          selectedPortfolioType === 'pdf' &&
          (!isPdfTextExtracted || isPdfTextExtracting)
        ) && (
          <div className='flex justify-center pb-[6.25rem]'>
            <CommonButton
              variantType='Primary'
              px='2.25rem'
              py='0.75rem'
              disabled={pdfCategoryOverLimit}
              className={
                pdfCategoryOverLimit
                  ? 'rounded-[3.75rem] cursor-not-allowed !bg-[#CDD0D5] hover:!bg-[#CDD0D5]'
                  : 'rounded-[3.75rem]'
              }
              onClick={handleNextStep}
            >
              다음으로
            </CommonButton>
          </div>
        )}
    </>
  );
}

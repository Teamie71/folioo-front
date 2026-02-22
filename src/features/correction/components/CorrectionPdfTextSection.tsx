'use client';

import { type MutableRefObject } from 'react';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';
import { CorrectionPdfActivityTabs } from './CorrectionPdfActivityTabs';
import { CorrectionPdfBulletEditor } from './CorrectionPdfBulletEditor';

export interface CorrectionPdfTextSectionProps {
  isPdfTextExtracting: boolean;
  pdfActivities: PdfActivityBlock[];
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  onAddActivity: () => Promise<void>;
  selectedActivityId: string;
  onActivitySelect: (id: string) => void;
  selectedTab: PdfCategoryName;
  onTabSelect: (tab: PdfCategoryName) => void;
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
  bulletTextareaRefs: MutableRefObject<(HTMLTextAreaElement | null)[]>;
  lastBulletEnterAt: MutableRefObject<number>;
}

export function CorrectionPdfTextSection({
  isPdfTextExtracting,
  pdfActivities,
  setPdfActivities,
  onAddActivity,
  selectedActivityId,
  onActivitySelect,
  selectedTab,
  onTabSelect,
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
  bulletTextareaRefs,
  lastBulletEnterAt,
}: CorrectionPdfTextSectionProps) {
  return (
    <div className='mt-[3.75rem] flex flex-col'>
      <div className='mb-[0.5rem] flex items-center text-[1.125rem] font-bold leading-[1.3]'>
        <span>PDF 포트폴리오 텍스트 정리</span>
      </div>
      <div className='mb-[2.5rem] flex flex-col'>
        <span className='text-[0.875rem] text-[#74777D]'>
          업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된 부분이나
          추가하실 부분이 있다면 수정해주세요.
        </span>
        <span className='text-[0.875rem] text-[#74777D]'>
          삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지 않아요.
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
          <CorrectionPdfActivityTabs
            pdfActivities={pdfActivities}
            selectedActivityId={selectedActivityId}
            onActivitySelect={onActivitySelect}
            setPdfActivities={setPdfActivities}
            onAddActivity={onAddActivity}
            onRequestActivityDelete={onRequestActivityDelete}
            pdfActivityHoverId={pdfActivityHoverId}
            setPdfActivityHoverId={setPdfActivityHoverId}
          />
          <CorrectionPdfBulletEditor
            pdfActivities={pdfActivities}
            setPdfActivities={setPdfActivities}
            selectedActivityId={selectedActivityId}
            selectedTab={selectedTab}
            onTabSelect={onTabSelect}
            bulletTextareaRefs={bulletTextareaRefs}
            lastBulletEnterAt={lastBulletEnterAt}
          />
        </>
      )}
    </div>
  );
}

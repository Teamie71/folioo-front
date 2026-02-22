'use client';

import ActivityDeleteIcon from '@/components/icons/ActivityDeleteIcon';
import RedDotIcon from '@/components/icons/RedDotIcon';
import { PDF_CATEGORY_CHAR_LIMIT } from '@/features/correction/constants';
import type { PdfActivityBlock } from '@/types/correction';

export interface CorrectionPdfActivityTabsProps {
  pdfActivities: PdfActivityBlock[];
  selectedActivityId: string;
  onActivitySelect: (id: string) => void;
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  onAddActivity: () => Promise<void>;
  onRequestActivityDelete: (activityId: string) => void;
  pdfActivityHoverId: string | null;
  setPdfActivityHoverId: (id: string | null) => void;
}

export function CorrectionPdfActivityTabs({
  pdfActivities,
  selectedActivityId,
  onActivitySelect,
  setPdfActivities,
  onAddActivity,
  onRequestActivityDelete,
  pdfActivityHoverId,
  setPdfActivityHoverId,
}: CorrectionPdfActivityTabsProps) {
  return (
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
              pdfActivityHoverId === activity.id ? 'opacity-100' : 'opacity-0'
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
          onClick={() => onAddActivity()}
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
  );
}

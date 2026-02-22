'use client';

import { type MutableRefObject } from 'react';
import RedDotIcon from '@/components/icons/RedDotIcon';
import {
  PDF_CATEGORY_CHAR_LIMIT,
  PDF_CATEGORY_NAMES,
} from '@/features/correction/constants';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';

export interface CorrectionPdfBulletEditorProps {
  pdfActivities: PdfActivityBlock[];
  setPdfActivities: React.Dispatch<React.SetStateAction<PdfActivityBlock[]>>;
  selectedActivityId: string;
  selectedTab: PdfCategoryName;
  onTabSelect: (tab: PdfCategoryName) => void;
  bulletTextareaRefs: MutableRefObject<(HTMLTextAreaElement | null)[]>;
  lastBulletEnterAt: MutableRefObject<number>;
}

export function CorrectionPdfBulletEditor({
  pdfActivities,
  setPdfActivities,
  selectedActivityId,
  selectedTab,
  onTabSelect,
  bulletTextareaRefs,
  lastBulletEnterAt,
}: CorrectionPdfBulletEditorProps) {
  const activity = pdfActivities.find((a) => a.id === selectedActivityId);
  const category = activity?.categories.find((c) => c.name === selectedTab);
  const bullets = category?.bullets ?? [''];

  const setBullets = (next: string[]) => {
    if (!activity || !category) return;
    setPdfActivities((prev) =>
      prev.map((a) =>
        a.id !== activity.id
          ? a
          : {
              ...a,
              categories: a.categories.map((c) =>
                c.name !== selectedTab ? c : { ...c, bullets: next },
              ),
            },
      ),
    );
  };

  const categoryCharCount = bullets.reduce((sum, b) => sum + b.length, 0);

  bulletTextareaRefs.current = [];

  return (
    <div className='relative z-20 flex min-h-[397px] rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
      <div className='flex flex-col'>
        {PDF_CATEGORY_NAMES.map((name) => {
          const selectedActivity = pdfActivities.find(
            (a) => a.id === selectedActivityId,
          );
          const cat = selectedActivity?.categories.find((c) => c.name === name);
          const categoryOverLimit =
            (cat?.bullets.reduce((s, b) => s + b.length, 0) ?? 0) >
            PDF_CATEGORY_CHAR_LIMIT;
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

      <div className='flex flex-1 flex-col gap-[0.5rem] rounded-tr-[1.25rem] rounded-br-[1.25rem] bg-[#FFFFFF] px-[2.25rem] py-[1.5rem] text-[0.875rem] text-[#1A1A1A]'>
        <div className='flex flex-1 flex-col gap-[0.5rem]'>
          {bullets.map((text, idx) => (
            <div key={idx} className='flex items-start gap-[0.5rem]'>
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
                    if (now - lastBulletEnterAt.current < 150) return;
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
                    const next = bullets.filter((_, i) => i !== idx);
                    setBullets(next);
                    const prevIdx = idx - 1;
                    setTimeout(() => {
                      const prev = bulletTextareaRefs.current?.[prevIdx];
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
                      const prev = bulletTextareaRefs.current?.[prevIdx];
                      if (prev && prev !== document.activeElement) prev.focus();
                    }, 0);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    e.stopPropagation();
                    const nextIdx = idx + 1;
                    setTimeout(() => {
                      const next = bulletTextareaRefs.current?.[nextIdx];
                      if (next && next !== document.activeElement) next.focus();
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
              categoryCharCount > 390 ? 'text-[#DC0000]' : 'text-[#74777D]'
            }`}
          >
            {categoryCharCount} / {PDF_CATEGORY_CHAR_LIMIT}
          </span>
        </div>
      </div>
    </div>
  );
}

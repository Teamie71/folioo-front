'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export interface CorrectionResultSummaryProps {
  overallReview?: string | null;
}

export function CorrectionResultSummary({ overallReview }: CorrectionResultSummaryProps) {
  return (
    <div className='flex flex-col gap-[3rem]'>
      <div className='flex flex-col gap-[1rem]'>
        <div className='text-[1.125rem] font-bold leading-[1.3]'>총평</div>
        <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
          <div className="prose prose-sm max-w-none text-[1rem] font-normal text-[#1A1A1A] leading-[1.6] focus:outline-none h-full break-words [&_h1]:!text-[2rem] [&_h1]:!font-bold [&_h1]:!mt-[1.5em] [&_h1]:!mb-[0.5em] [&_h1]:!border-b [&_h1]:!border-gray-200 [&_h1]:!pb-2 [&_h1]:!leading-tight [&_h2]:!text-[1.5rem] [&_h2]:!font-bold [&_h2]:!mt-[1.5em] [&_h2]:!mb-[0.5em] [&_h2]:!border-b [&_h2]:!border-gray-200 [&_h2]:!pb-2 [&_h2]:!leading-tight [&_h3]:!text-[1.25rem] [&_h3]:!font-bold [&_h3]:!mt-[1.5em] [&_h3]:!mb-[0.5em] [&_h3]:!leading-snug [&_p]:!my-[1em] [&_a]:!text-blue-600 [&_a]:!underline [&_a]:!underline-offset-2 [&_strong]:!font-bold [&_strong]:!text-black [&_ul]:!list-disc [&_ul]:!pl-[1.5em] [&_ul]:!my-[1em] [&_ol]:!list-decimal [&_ol]:!pl-[1.5em] [&_ol]:!my-[1em] [&_li]:!my-[0.25em] [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-600 [&_blockquote]:!my-[1em] [&_hr]:!border-t [&_hr]:!border-gray-300 [&_hr]:!my-[2em] [&_table]:!w-full [&_table]:!border-collapse [&_table]:!my-[1em] [&_th]:!border [&_th]:!border-gray-300 [&_th]:!bg-gray-50 [&_th]:!px-4 [&_th]:!py-2 [&_th]:!font-bold [&_th]:!text-left [&_td]:!border [&_td]:!border-gray-300 [&_td]:!px-4 [&_td]:!py-2">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {overallReview || '총평이 없습니다.'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { ToggleLarge } from '@/components/ToggleLarge';
import type { PortfolioDetailResDTO, CorrectionResultItemReqDTO, CorrectionLineItemReqDTO } from '@/api/models';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

export type ResultButtonValue = '축소 또는 제외' | '구체화하여 강조';

export interface CorrectionResultActivityDetailProps {
  portfolio: PortfolioDetailResDTO;
  correctionItem: CorrectionResultItemReqDTO;
  detailInfoButton: ResultButtonValue;
  setDetailInfoButton: (value: ResultButtonValue) => void;
  responsibilityButton: ResultButtonValue;
  setResponsibilityButton: (value: ResultButtonValue) => void;
  problemSolvingButton: ResultButtonValue;
  setProblemSolvingButton: (value: ResultButtonValue) => void;
  lessonsButton: ResultButtonValue;
  setLessonsButton: (value: ResultButtonValue) => void;
}

const buttonClass = (selected: boolean) =>
  selected
    ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
    : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]';

function hasPortfolioOriginText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

function EmptyActivityOriginMessage() {
  return (
    <div className='flex min-h-[15.375rem] w-full flex-1 items-center justify-center text-center text-[1rem] font-normal text-[#74777D]'>
      첨삭할 내용이 존재하지 않아요.
    </div>
  );
}

function highlightText(text: string, lines: CorrectionLineItemReqDTO[] = [], activeFilter: 'reduce' | 'emphasize') {
  if (!text) return '';
  let result = text;
  // Sort by length descending to replace longer strings first and avoid partial replacements
  const sortedLines = [...lines].sort((a, b) => b.originalText.length - a.originalText.length);
  
  sortedLines.forEach((line) => {
    if (!line.originalText) return;
    const type = line.type.toLowerCase();
    if (type === 'reduce' && activeFilter === 'reduce') {
      result = result.split(line.originalText).join(`<span class="bg-[#FFF2F2]">${line.originalText}</span>`);
    } else if (type === 'emphasize' && activeFilter === 'emphasize') {
      result = result.split(line.originalText).join(`<span class="bg-[#F1FEF0]">${line.originalText}</span>`);
    }
  });
  return result;
}

function renderComments(lines: CorrectionLineItemReqDTO[] = [], filterType: 'reduce' | 'emphasize') {
  const filteredLines = lines.filter((line) => {
    // API 응답을 보면 comment 필드가 객체가 아니라 단순 문자열로 오고 있음
    const commentContent = typeof line.comment === 'string' ? line.comment : (line.comment as { content?: string })?.content;
    return line.type.toLowerCase() === filterType && typeof commentContent === 'string' && commentContent;
  });

  if (filteredLines.length === 0) {
    return <></>;
  }

  return filteredLines.map((line, index) => {
    const commentContent = typeof line.comment === 'string' ? line.comment : (line.comment as { content?: string })?.content;
    return (
      <li key={index} className='text-[1rem] text-[#1A1A1A]'>
        {commentContent}
      </li>
    );
  });
}

export function CorrectionResultActivityDetail({
  portfolio,
  correctionItem,
  detailInfoButton,
  setDetailInfoButton,
  responsibilityButton,
  setResponsibilityButton,
  problemSolvingButton,
  setProblemSolvingButton,
  lessonsButton,
  setLessonsButton,
}: CorrectionResultActivityDetailProps) {
  const renderMarkdown = (text: string, lines: CorrectionLineItemReqDTO[], activeFilter: 'reduce' | 'emphasize') => {

    // 하이라이팅 처리
    let highlightedText = text ?? '';
    const sortedLines = [...lines].sort((a, b) => b.originalText.length - a.originalText.length);
    
    sortedLines.forEach((line) => {
      if (!line.originalText) return;
      const type = line.type.toLowerCase();
      const escapedOriginalText = line.originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:-)?${escapedOriginalText}`, 'g');
      
      if (type === 'reduce' && activeFilter === 'reduce') {
        highlightedText = highlightedText.replace(regex, (match) => `<span class="bg-[#FFF2F2]">${match}</span>`);
      } else if (type === 'emphasize' && activeFilter === 'emphasize') {
        highlightedText = highlightedText.replace(regex, (match) => `<span class="bg-[#F1FEF0]">${match}</span>`);
      }
    });

    return (
      <div className="prose prose-sm max-w-none text-[1rem] font-normal text-[#1A1A1A] leading-[1.6] focus:outline-none h-full break-words [&>*:first-child]:!mt-0 [&_h1]:!text-[2rem] [&_h1]:!font-bold [&_h1]:!mt-[1.5em] [&_h1]:!mb-[0.5em] [&_h1]:!border-b [&_h1]:!border-gray-200 [&_h1]:!pb-2 [&_h1]:!leading-tight [&_h2]:!text-[1.5rem] [&_h2]:!font-bold [&_h2]:!mt-[1.5em] [&_h2]:!mb-[0.5em] [&_h2]:!border-b [&_h2]:!border-gray-200 [&_h2]:!pb-2 [&_h2]:!leading-tight [&_h3]:!text-[1.25rem] [&_h3]:!font-bold [&_h3]:!mt-[1.5em] [&_h3]:!mb-[0.5em] [&_h3]:!leading-snug [&_p]:!my-[1em] [&_a]:!text-blue-600 [&_a]:!underline [&_a]:!underline-offset-2 [&_strong]:!font-bold [&_strong]:!text-black [&_ul]:!list-disc [&_ul]:!pl-[1.5em] [&_ul]:!my-[1em] [&_ol]:!list-decimal [&_ol]:!pl-[1.5em] [&_ol]:!my-[1em] [&_li]:!my-[0.25em] [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-600 [&_blockquote]:!my-[1em] [&_hr]:!border-t [&_hr]:!border-gray-300 [&_hr]:!my-[2em] [&_table]:!w-full [&_table]:!border-collapse [&_table]:!my-[1em] [&_th]:!border [&_th]:!border-gray-300 [&_th]:!bg-gray-50 [&_th]:!px-4 [&_th]:!py-2 [&_th]:!font-bold [&_th]:!text-left [&_td]:!border [&_td]:!border-gray-300 [&_td]:!px-4 [&_td]:!py-2">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
          {highlightedText}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-[3rem]'>
      <div className='flex flex-col gap-[1rem]'>
        <div className='text-[1.125rem] font-bold leading-[1.3]'>
          상세정보
        </div>
        <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
          <div className='min-h-[15.375rem] min-w-0 flex-1'>
            {hasPortfolioOriginText(portfolio.description) ? (
              renderMarkdown(
                portfolio.description,
                correctionItem.description?.lines || [],
                detailInfoButton === '축소 또는 제외' ? 'reduce' : 'emphasize',
              )
            ) : (
              <EmptyActivityOriginMessage />
            )}
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem]'>
            <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
              <button
                onClick={() => setDetailInfoButton('축소 또는 제외')}
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(detailInfoButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setDetailInfoButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(detailInfoButton === '구체화하여 강조')}`}
              >
                구체화하여 강조
              </button>
            </div>
            <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
              {renderComments(
                correctionItem.description?.lines,
                detailInfoButton === '축소 또는 제외' ? 'reduce' : 'emphasize'
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='text-[1.125rem] font-bold leading-[1.3]'>
          담당업무
        </div>
        <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
          <div className='min-h-[15.375rem] min-w-0 flex-1'>
            {hasPortfolioOriginText(portfolio.responsibilities) ? (
              renderMarkdown(
                portfolio.responsibilities,
                correctionItem.responsibilities?.lines || [],
                responsibilityButton === '축소 또는 제외' ? 'reduce' : 'emphasize',
              )
            ) : (
              <EmptyActivityOriginMessage />
            )}
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem]'>
            <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
              <button
                onClick={() => setResponsibilityButton('축소 또는 제외')}
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(responsibilityButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setResponsibilityButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(responsibilityButton === '구체화하여 강조')}`}
              >
                구체화하여 강조
              </button>
            </div>
            <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
              {renderComments(
                correctionItem.responsibilities?.lines,
                responsibilityButton === '축소 또는 제외' ? 'reduce' : 'emphasize'
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='text-[1.125rem] font-bold leading-[1.3]'>
          문제 해결
        </div>
        <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
          <div className='min-h-[15.375rem] min-w-0 flex-1'>
            {hasPortfolioOriginText(portfolio.problemSolving) ? (
              renderMarkdown(
                portfolio.problemSolving,
                correctionItem.problemSolving?.lines || [],
                problemSolvingButton === '축소 또는 제외' ? 'reduce' : 'emphasize',
              )
            ) : (
              <EmptyActivityOriginMessage />
            )}
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem]'>
            <ToggleLarge
              options={[
                { value: '축소 또는 제외', label: '축소 또는 제외' },
                { value: '구체화하여 강조', label: '구체화하여 강조' },
              ]}
              value={problemSolvingButton}
              onChange={(value) =>
                setProblemSolvingButton(value as ResultButtonValue)
              }
            />
            <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
              {renderComments(
                correctionItem.problemSolving?.lines,
                problemSolvingButton === '축소 또는 제외' ? 'reduce' : 'emphasize'
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[1rem]'>
        <div className='text-[1.125rem] font-bold leading-[1.3]'>
          배운 점
        </div>
        <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
          <div className='min-h-[15.375rem] min-w-0 flex-1'>
            {hasPortfolioOriginText(portfolio.learnings) ? (
              renderMarkdown(
                portfolio.learnings,
                correctionItem.learnings?.lines || [],
                lessonsButton === '축소 또는 제외' ? 'reduce' : 'emphasize',
              )
            ) : (
              <EmptyActivityOriginMessage />
            )}
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem]'>
            <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
              <button
                onClick={() => setLessonsButton('축소 또는 제외')}
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(lessonsButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setLessonsButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(lessonsButton === '구체화하여 강조')}`}
              >
                구체화하여 강조
              </button>
            </div>
            <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
              {renderComments(
                correctionItem.learnings?.lines,
                lessonsButton === '축소 또는 제외' ? 'reduce' : 'emphasize'
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

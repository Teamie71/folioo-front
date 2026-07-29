'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContributionBar } from '@/features/experience/components/ContributionBar';

interface TextPortfolioCardProps {
  portfolio: any;
  handleContributionSave: (value: number) => void;
  hopeJobTag: string;
  exportContentRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  portfolioId: number;
  detailInfo: string;
  roleContent: string;
  problemContent: string;
  learnContent: string;
}

const TextPortfolioCard = ({
  portfolio,
  handleContributionSave,
  hopeJobTag,
  exportContentRef,
  isLoading,
  portfolioId,
  detailInfo,
  roleContent,
  problemContent,
  learnContent,
}: TextPortfolioCardProps) => {
  return (
    <div className='flex flex-col rounded-[2.5rem] px-[3.5rem] py-[4rem] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.2)]'>
      {/* 기여도 & 태그 영역 */}
      <div className='flex items-center justify-between'>
        {/* 기여도 */}
        <ContributionBar
          initialValue={
            portfolio?.contributionRate != null
              ? Math.min(100, Math.max(0, portfolio.contributionRate))
              : 0
          }
          duration={300}
          onSave={handleContributionSave}
        />

        {/* 직무 태그 */}
        <div className='rounded-[3.75rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[1.75rem] py-[0.25rem] text-[1rem] font-semibold text-[#5060C5]'>
          {hopeJobTag}
        </div>
      </div>

      {/* 생성 내용 - 상세정보~배운 점 (내보내기 대상) */}
      <div
        ref={exportContentRef}
        className='flex flex-col gap-[3.75rem] pt-[3.75rem] pb-[3.75rem]'
      >
        {isLoading && !portfolio ? (
          <p className='text-[1rem] text-[#74777D]'></p>
        ) : !portfolioId ? (
          <p className='text-[1rem] text-[#74777D]'></p>
        ) : (
          <>
            {/* 상세정보 */}
            <div className='flex flex-col gap-[1rem]'>
              <span className='text-[1.125rem] font-bold'>상세정보</span>
              <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                <ReactMarkdown>{detailInfo || '내용'}</ReactMarkdown>
              </div>
            </div>

            {/* 담당업무 */}
            <div className='flex flex-col gap-[1rem]'>
              <span className='text-[1.125rem] font-bold'>담당업무</span>
              <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                <ReactMarkdown>{roleContent || '내용'}</ReactMarkdown>
              </div>
            </div>

            {/* 문제해결 */}
            <div className='flex flex-col gap-[1rem]'>
              <span className='text-[1.125rem] font-bold'>문제해결</span>
              <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                <ReactMarkdown>{problemContent || '내용'}</ReactMarkdown>
              </div>
            </div>

            {/* 배운 점 */}
            <div className='flex flex-col gap-[1rem]'>
              <span className='text-[1.125rem] font-bold'>배운 점</span>
              <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                <ReactMarkdown>{learnContent || '내용'}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TextPortfolioCard;

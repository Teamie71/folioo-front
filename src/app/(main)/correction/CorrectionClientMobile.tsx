'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import type { PortfolioCorrectionControllerGetCorrections200 } from '@/api/models';
import { usePortfolioCorrectionControllerGetCorrections } from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { PortfolioCard } from '@/components/PortfolioCard';

function formatDate(createdAt: string): string {
  return createdAt.slice(0, 10);
}

export default function CorrectionClientMobile() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  const { data, isLoading } = usePortfolioCorrectionControllerGetCorrections(
    { keyword: debouncedKeyword.trim() || undefined },
    { query: { enabled: true } },
  );

  const responseData = data as
    | PortfolioCorrectionControllerGetCorrections200
    | undefined;
  const list = responseData?.result ?? [];
  const items = list.map((c) => ({
    title: c.title,
    tag: c.positionName,
    date: formatDate(c.createdAt),
    href: `/correction/${c.id}`,
  }));

  return (
    <div className='flex min-h-screen w-full flex-col bg-white'>
      {/* Global Navbar 숨기기용 스타일 (모바일 전용 뷰일 때만) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          nav { display: none !important; }
          .banner-beta { display: none !important; }
          .layout-content-below-header { padding-top: 0 !important; }
        `
      }} />

      {/* Mobile Header -> 추후 Navbar, Sidebar로 대체 */}
      <header className='sticky top-0 z-50 flex h-[3.5rem] items-center justify-between bg-white px-4'>
        <button onClick={() => router.back()} className='p-2 -ml-2'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className='text-[1.125rem] pr-[10rem] font-bold'>포트폴리오 첨삭</h1>
        <button className='p-2 -mr-2'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Purple Banner */}
      <div className='flex flex-col gap-4 bg-[#F6F5FF] px-4 py-6'>
        <p className='text-[0.875rem] leading-[1.4] text-[#464B53]'>
          지원하는 포지션에 딱 맞는 서류를 만들 수 있도록,<br />
          AI 컨설턴트가 포트폴리오를 첨삭해드려요.
        </p>
        <div className='flex items-center justify-center rounded-[0.5rem] bg-white py-[0.5rem]'>
          <span className='text-[0.875rem] font-medium text-[#5060C5]'>새로운 포트폴리오 첨삭은 PC에서만 할 수 있어요.</span>
        </div>
      </div>

      {/* Content Area */}
      <div className='flex flex-col px-4 pt-8 pb-[6.25rem]'>
        <h2 className='mb-4 text-[1.25rem] font-bold'>나의 첨삭</h2>
        
        {/* Search Input */}
        <div className='relative mb-6 flex items-center'>
          <input
            className='w-full rounded-[6.25rem] border border-[#74777D] bg-white px-[1.25rem] py-[0.75rem] text-[1rem] outline-none focus:border-[#5060C5]'
            placeholder='검색어를 입력하세요.'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <svg
            className='absolute right-[1.25rem]'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M21.4073 19.7527L16.9969 15.3422C18.0588 13.9286 18.632 12.208 18.63 10.44C18.63 5.92406 14.9559 2.25 10.44 2.25C5.92406 2.25 2.25 5.92406 2.25 10.44C2.25 14.9559 5.92406 18.63 10.44 18.63C12.208 18.632 13.9286 18.0588 15.3422 16.9969L19.7527 21.4073C19.9759 21.6069 20.2671 21.7135 20.5664 21.7051C20.8658 21.6967 21.1506 21.574 21.3623 21.3623C21.574 21.1506 21.6967 20.8658 21.7051 20.5664C21.7135 20.2671 21.6069 19.9759 21.4073 19.7527ZM4.59 10.44C4.59 9.28298 4.9331 8.15194 5.5759 7.18992C6.21871 6.22789 7.13235 5.47808 8.2013 5.03531C9.27025 4.59253 10.4465 4.47668 11.5813 4.70241C12.7161 4.92813 13.7584 5.48529 14.5766 6.30343C15.3947 7.12156 15.9519 8.16393 16.1776 9.29872C16.4033 10.4335 16.2875 11.6098 15.8447 12.6787C15.4019 13.7476 14.6521 14.6613 13.6901 15.3041C12.7281 15.9469 11.597 16.29 10.44 16.29C8.88906 16.2881 7.40217 15.6712 6.30548 14.5745C5.2088 13.4778 4.59186 11.9909 4.59 10.44Z'
              fill='black'
            />
          </svg>
        </div>

        {/* List */}
        {isLoading ? (
          <div className='mt-8 flex justify-center'>
            <CorrectionLoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className='mt-[3.25rem] whitespace-pre-line text-center text-[1rem] font-bold text-[#9EA4A9]'>
            {debouncedKeyword.trim()
              ? '앗, 일치하는 결과가 없어요.'
              : '아직 진행된 첨삭이 없어요.\n지원 상황에 딱 맞는 첨삭을 경험해보세요!'}
          </p>
        ) : (
          <div className='flex flex-col gap-4'>
            {items.map((item) => (
              <PortfolioCard
                key={item.href + item.title}
                title={item.title}
                tag={item.tag}
                date={item.date}
                href={item.href}
                className='px-[1.25rem] py-[1.25rem]'
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  CorrectionListGrid,
  type CorrectionListItem,
} from '@/features/correction/components/CorrectionListGrid';
import { CorrectionListHeader } from '@/features/correction/components/CorrectionListHeader';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import { CorrectionListSearch } from '@/features/correction/components/CorrectionListSearch';
import type { PortfolioCorrectionControllerGetCorrections200 } from '@/api/models';
import { usePortfolioCorrectionControllerGetCorrections } from '@/api/endpoints/portfolio-correction/portfolio-correction';

function formatDate(createdAt: string): string {
  return createdAt.slice(0, 10);
}

export default function CorrectionPage() {
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

  const responseData = data?.data as PortfolioCorrectionControllerGetCorrections200 | undefined;
  const list = responseData?.result ?? [];
  const items: CorrectionListItem[] = list.map((c) => ({
    title: c.title,
    tag: c.positionName,
    date: formatDate(c.createdAt),
    href: `/correction/${c.id}`,
  }));

  return (
    <div className='flex flex-col gap-[4.5rem] pb-[6.25rem]'>
      <CorrectionListHeader />
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <CorrectionListSearch value={keyword} onChange={setKeyword} />
        {isLoading ? (
          <CorrectionLoadingSpinner />
        ) : items.length === 0 ? (
          <p className='whitespace-pre-line text-[1.125rem] text-center font-bold mt-[3.25rem] text-[#9EA4A9]'>
            {debouncedKeyword.trim()
              ? '앗, 일치하는 결과가 없어요.'
              : '아직 진행된 첨삭이 없어요.\n지원 상황에 딱 맞는 첨삭을 경험해보세요!'}
          </p>
        ) : (
          <CorrectionListGrid items={items} />
        )}
      </div>
    </div>
  );
}

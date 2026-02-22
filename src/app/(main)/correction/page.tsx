'use client';

import { useEffect, useState } from 'react';
import {
  CorrectionListGrid,
  type CorrectionListItem,
} from '@/features/correction/components/CorrectionListGrid';
import { CorrectionListHeader } from '@/features/correction/components/CorrectionListHeader';
import { CorrectionListSearch } from '@/features/correction/components/CorrectionListSearch';
import { getPortfolioCorrections } from '@/services/correction';

function formatDate(createdAt: string): string {
  return createdAt.slice(0, 10);
}

export default function CorrectionPage() {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [items, setItems] = useState<CorrectionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    getPortfolioCorrections(debouncedKeyword.trim() || undefined)
      .then((list) =>
        setItems(
          list.map((c) => ({
            title: c.title,
            tag: c.positionName,
            date: formatDate(c.createdAt),
            href: `/correction/${c.id}`,
          })),
        ),
      )
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [debouncedKeyword]);

  return (
    <div className='flex flex-col gap-[4.5rem] pb-[6.25rem]'>
      <CorrectionListHeader />
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <CorrectionListSearch value={keyword} onChange={setKeyword} />
        {!loading && items.length === 0 ? (
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

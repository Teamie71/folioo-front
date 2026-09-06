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
import { useAuthStore } from '@/store/useAuthStore';

function formatDate(createdAt: string): string {
  return createdAt.slice(0, 10);
}

export default function CorrectionClient() {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const isLoggedIn = accessToken != null;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  const { data, isLoading } = usePortfolioCorrectionControllerGetCorrections(
    { keyword: debouncedKeyword.trim() || undefined },
    { query: { enabled: sessionRestoreAttempted && isLoggedIn } },
  );

  const responseData = data as
    | PortfolioCorrectionControllerGetCorrections200
    | undefined;
  // 로그아웃 직후 비활성화된 쿼리가 기존 data를 보존할 수 있으므로,
  // 인증이 없을 때는 어떤 캐시 값도 목록에 사용하지 않는다.
  const list = isLoggedIn ? (responseData?.result ?? []) : [];
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
        {!sessionRestoreAttempted || (isLoggedIn && isLoading) ? (
          <CorrectionLoadingSpinner />
        ) : items.length === 0 ? (
          <p className='mt-[3.25rem] text-center text-[1.125rem] font-bold whitespace-pre-line text-[#9EA4A9]'>
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

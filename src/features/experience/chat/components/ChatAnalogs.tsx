'use client';

import { useMemo, useState, useEffect } from 'react';
import { LogCard } from '@/features/log/components/LogCard';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';
import { ChatLoadingMessage } from '@/features/experience/chat/components/ChatLoadingMessage';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import type { InsightLogResDTO } from '@/api/models';
import { ChatErrorReloadMessage } from '@/features/experience/chat/components/ChatErrorReloadMessage';

interface ChatAnalogsProps {
  /* 대화/질문 키워드로 유사 인사이트 검색 */
  searchKeyword?: string;
}

function formatDate(createdAt: string): string {
  try {
    return createdAt.slice(0, 10);
  } catch {
    return '';
  }
}

export const ChatAnalogs = ({ searchKeyword }: ChatAnalogsProps) => {
  const { data, isLoading, isError, refetch } = useInsightControllerGetLogs(
    searchKeyword?.trim() ? { keyword: searchKeyword.trim() } : undefined,
    { query: { enabled: !!searchKeyword?.trim() } },
  );

  const insights = useMemo(
    (): InsightLogResDTO[] => data?.result ?? [],
    [data?.result],
  );

  if (!searchKeyword?.trim()) {
    return (
      <div className='flex flex-col gap-[1.75rem]'>
        <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
          대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
        </p>
        <p className='text-[0.875rem] text-[#74777D]'>
          AI가 응답하면 이곳에 유사 인사이트가 표시돼요.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <ChatLoadingMessage />;
  }

  if (isError) {
    return <ChatErrorReloadMessage onRetry={() => refetch()} />;
  }

  if (insights.length === 0) {
    return <ChatLoadingMessage />;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, insights.length - 1)));
  }, [insights.length]);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < insights.length - 1;

  return (
    <div className='flex flex-col gap-[1.75rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
      </p>

      <div className='flex w-full items-center gap-[1.25rem]'>
        <button
          type='button'
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={!canGoPrev}
          className={`shrink-0 focus:outline-none rounded ${!canGoPrev ? 'invisible pointer-events-none' : ''}`}
          aria-label='이전 인사이트'
        >
          <ChevronColorLeftIcon />
        </button>
        <div className='min-w-0 flex-1 overflow-hidden'>
          {insights.slice(0, 3).map((log, index) => (
            <div
              key={log.id}
              className={index === currentIndex ? 'block' : 'hidden'}
            >
              <LogCard
                className='w-full max-w-[32.25rem]'
                title={log.title}
                date={formatDate(log.createdAt)}
                content={log.description}
                activityName={log.activityNames?.[0] ?? ''}
                category={log.category}
              />
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() =>
            setCurrentIndex((i) => Math.min(insights.length - 1, i + 1))
          }
          disabled={!canGoNext}
          className={`shrink-0 rotate-180 focus:outline-none rounded ${!canGoNext ? 'invisible pointer-events-none' : ''}`}
          aria-label='다음 인사이트'
        >
          <ChevronColorLeftIcon />
        </button>
      </div>
    </div>
  );
};

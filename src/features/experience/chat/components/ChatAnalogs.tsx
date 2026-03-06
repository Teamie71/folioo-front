'use client';

import { useMemo } from 'react';
import { LogCard } from '@/features/log/components/LogCard';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';
import { ChatLoadingMessage } from '@/features/experience/chat/components/ChatLoadingMessage';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import type { InsightLogResDTO } from '@/api/models';

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
  const { data, isLoading, isError } = useInsightControllerGetLogs(
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

  if (isError || insights.length === 0) {
    return (
      <div className='flex flex-col gap-[1.75rem]'>
        <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
          대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
        </p>
        <p className='text-[0.875rem] text-[#74777D]'>
          {insights.length === 0
            ? '이번 대화와 유사한 인사이트 로그가 없어요.'
            : '인사이트를 불러오지 못했어요.'}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-[1.75rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
      </p>

      <div className='flex w-full items-center gap-[1.25rem]'>
        <div className='invisible shrink-0' aria-hidden>
          <ChevronColorLeftIcon />
        </div>
        <div className='w-full min-w-0 flex-1 space-y-[1.25rem]'>
          {insights.slice(0, 3).map((log) => (
            <LogCard
              key={log.id}
              className='w-full'
              title={log.title}
              date={formatDate(log.createdAt)}
              content={log.description}
              activityName={log.activityNames?.[0] ?? ''}
              category={log.category}
            />
          ))}
        </div>
        <div className='rotate-180'>
          <ChevronColorLeftIcon />
        </div>
      </div>
    </div>
  );
};

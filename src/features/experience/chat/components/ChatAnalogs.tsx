'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { LogCard } from '@/features/log/components/LogCard';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';
import { ChatLoadingMessage } from '@/features/experience/chat/components/ChatLoadingMessage';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import type { InsightLogResDTO } from '@/api/models';
import { ChatErrorReloadMessage } from '@/features/experience/chat/components/ChatErrorReloadMessage';

const ANALOGS_LOAD_TIMEOUT_MS = 3 * 60 * 1000; // 3분

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadTimeoutReached, setLoadTimeoutReached] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const keyword = searchKeyword?.trim() ?? '';
  const { data, isLoading, isFetching, isError, refetch } =
    useInsightControllerGetLogs(
      { keyword },
      { query: { enabled: !!keyword } },
    );

  const insights = useMemo(
    (): InsightLogResDTO[] => data?.result ?? [],
    [data?.result],
  );

  // 로딩/재요청이 3분 넘어가면 "다시 시도하기" 표시
  useEffect(() => {
    if (!keyword) return;
    const loading = isLoading || isFetching;
    if (loading) {
      setLoadTimeoutReached(false);
      timeoutRef.current = setTimeout(() => {
        setLoadTimeoutReached(true);
      }, ANALOGS_LOAD_TIMEOUT_MS);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoadTimeoutReached(false);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [keyword, isLoading, isFetching]);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, insights.length - 1)));
  }, [insights.length]);

  if (!keyword) {
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

  if (loadTimeoutReached) {
    return (
      <ChatErrorReloadMessage
        message={
          <>
            유사 인사이트 검색이 3분 이상 걸리고 있어요.
            <br />
            아래 버튼을 눌러 다시 시도해주세요.
          </>
        }
        onRetry={() => {
          setLoadTimeoutReached(false);
          refetch();
        }}
      />
    );
  }

  // 로딩 중이거나 refetch 중에는 스피너 표시 (요청이 나가고 있음을 보여줌)
  if (isLoading || isFetching) {
    return <ChatLoadingMessage />;
  }

  // 네트워크/서버 에러: 요청 실패 시에만 "오류" + 다시 시도하기
  if (isError) {
    return (
      <ChatErrorReloadMessage
        message={
          <>
            유사 인사이트 검색 중 오류가 발생했어요.
            <br />
            아래 버튼을 눌러 다시 시도해주세요.
          </>
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (insights.length === 0) {
    return <ChatErrorReloadMessage onRetry={() => refetch()} />;
  }

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
          className={`shrink-0 rounded focus:outline-none ${!canGoPrev ? 'pointer-events-none invisible' : ''}`}
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
          className={`shrink-0 rotate-180 rounded focus:outline-none ${!canGoNext ? 'pointer-events-none invisible' : ''}`}
          aria-label='다음 인사이트'
        >
          <ChevronColorLeftIcon />
        </button>
      </div>
    </div>
  );
};

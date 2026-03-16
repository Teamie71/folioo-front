'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { LogCard } from '@/features/log/components/LogCard';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';
import { ChatLoadingMessage } from '@/features/experience/chat/components/ChatLoadingMessage';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import type { InsightLogResDTO, InsightSummaryResDTO } from '@/api/models';
const ANALOGS_LOAD_TIMEOUT_MS = 3 * 60 * 1000; // 3분

export interface ChatAnalogsProps {
  /* 대화/질문 키워드로 유사 인사이트 검색 (preloaded 없을 때만 사용) */
  searchKeyword?: string;
  /* 조회/SSE로 받은 인사이트가 있으면 키워드 검색 없이 이 목록 표시 */
  preloadedInsights?: InsightSummaryResDTO[];
}

function formatDate(createdAt: string): string {
  try {
    return createdAt.slice(0, 10);
  } catch {
    return '';
  }
}

export const ChatAnalogs = ({
  searchKeyword,
  preloadedInsights,
}: ChatAnalogsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadTimeoutReached, setLoadTimeoutReached] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const keyword = searchKeyword?.trim() ?? '';
  const hasPreloaded =
    Array.isArray(preloadedInsights) && preloadedInsights.length > 0;

  const { data, isLoading, isFetching, isError, refetch } =
    useInsightControllerGetLogs(
      { keyword },
      { query: { enabled: !!keyword && !hasPreloaded } },
    );

  const fetchedInsights = useMemo(
    (): InsightLogResDTO[] => data?.result ?? [],
    [data?.result],
  );

  const insights: Array<{
    id: string;
    title: string;
    content: string;
    activityName: string;
    category: string;
  }> = hasPreloaded
    ? preloadedInsights.map((i) => ({
        id: i.id,
        title: i.title,
        content: i.content,
        activityName: i.activityName ?? '',
        category: i.category,
      }))
    : fetchedInsights.map((log) => ({
        id: String(log.id),
        title: log.title,
        content: log.description ?? '',
        activityName: log.activityNames?.[0] ?? '',
        category: log.category,
      }));

  // 로딩/재요청이 3분 넘어가면 "다시 시도하기" 표시 (키워드 검색 시에만)
  useEffect(() => {
    if (!keyword || hasPreloaded) return;
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
  }, [keyword, hasPreloaded, isLoading, isFetching]);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, insights.length - 1)));
  }, [insights.length]);

  if (!keyword && !hasPreloaded) {
    return <></>;
  }

  // 유사도 검색 실패시 하단 답변만 출력
  if (!hasPreloaded && loadTimeoutReached) return null;
  if (!hasPreloaded && isError) return null;
  if (insights.length === 0) return null;

  // 로딩 중이거나 refetch 중에는 스피너 표시 (키워드 검색 시에만)
  if (!hasPreloaded && (isLoading || isFetching)) {
    return <ChatLoadingMessage />;
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < insights.length - 1;

  return (
    <div className='flex flex-col gap-[1.75rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
      </p>

      <div className='flex w-full items-stretch gap-[1.25rem]'>
        <button
          type='button'
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={!canGoPrev}
          className={`shrink-0 cursor-pointer self-center rounded focus:outline-none ${!canGoPrev ? 'pointer-events-none invisible' : ''}`}
          aria-label='이전 인사이트'
        >
          <ChevronColorLeftIcon />
        </button>
        {/* 패딩으로 그림자 여유 확보, overflow-visible로 그림자 잘림 방지 */}
        <div className='min-w-0 flex-1 overflow-visible px-[0.125rem] py-1'>
          {insights.slice(0, 3).map((log, index) => (
            <div
              key={log.id}
              className={index === currentIndex ? 'block w-full' : 'hidden'}
            >
              <LogCard
                className='w-full min-w-0'
                title={log.title}
                date={
                  hasPreloaded
                    ? ''
                    : formatDate(fetchedInsights[index]?.createdAt ?? '')
                }
                content={log.content}
                activityName={log.activityName}
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
          className={`shrink-0 rotate-180 cursor-pointer self-center rounded focus:outline-none ${!canGoNext ? 'pointer-events-none invisible' : ''}`}
          aria-label='다음 인사이트'
        >
          <ChevronColorLeftIcon />
        </button>
      </div>
    </div>
  );
};

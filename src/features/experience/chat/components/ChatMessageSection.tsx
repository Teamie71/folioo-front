'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import Image from 'next/image';
import type { ContentPart } from './ChatInput';
import type { InsightSummaryResDTO } from '@/api/models';
import { ChatAnalogs } from './ChatAnalogs';
import { ChatErrorReloadMessage } from './ChatErrorReloadMessage';
import { ChatLoadingMessage } from './ChatLoadingMessage';
import { PdfIcon } from '@/components/icons/PdfIcon';

export type MessageFile = {
  name: string;
  size: number;
  type: string;
  preview?: string;
};

export type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
  /* 멘션 + 텍스트 파트(있으면 말풍선에서 멘션 디자인 유지) */
  contentParts?: ContentPart[];
  files?: MessageFile[];
  /** AI 응답 생성 실패 시 true → 에러 문구 + 다시 시도하기 버튼 표시 */
  isError?: boolean;
};

const MAX_TITLE_LENGTH = 20;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function truncateFileName(
  name: string,
  maxTitleLen: number = MAX_TITLE_LENGTH,
): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0) {
    return name.length <= maxTitleLen
      ? name
      : `${name.slice(0, maxTitleLen)}...`;
  }
  const title = name.slice(0, lastDot);
  const ext = name.slice(lastDot);
  if (title.length <= maxTitleLen) return name;
  return `${title.slice(0, maxTitleLen)}...${ext}`;
}

interface ChatMessageSectionProps {
  messages: ChatMessage[];
  onAIMessageClick?: () => void;
  onUserMessageClick?: () => void;
  /** AI 메시지 생성 실패 시 해당 인덱스로 재시도 */
  onRetryAIMessage?: (aiMessageIndex: number) => void;
  /* AI 메시지가 스트리밍 중일 때 true*/
  isStreaming?: boolean;
  /** 조회 시 복원된 턴별 인사이트 이력 (insight_turn_history) */
  insightTurnHistory?: Array<{ insights: InsightSummaryResDTO[] }>;
  /** SSE retriever로 받은 턴별 인사이트 (턴 인덱스 → insights) */
  insightsByTurn?: Record<number, InsightSummaryResDTO[]>;
  /** 새로고침 후 세션 스트림 실패 시 true → ChatErrorReloadMessage 표시 */
  sessionLoadFailed?: boolean;
  /** 세션 스트림 재시도 (새로고침 후 답변 없을 때) */
  onRetrySession?: () => void;
  /* 대화가 완료된 상태인지 여부 */
  conversationCompleted?: boolean;
}

export function ChatMessageSection({
  messages,
  onAIMessageClick,
  onUserMessageClick,
  onRetryAIMessage,
  isStreaming = false,
  insightTurnHistory = [],
  insightsByTurn = {},
  sessionLoadFailed = false,
  onRetrySession,
  conversationCompleted = false,
}: ChatMessageSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가되면(사용자 입력 등) 스크롤을 최하단으로
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const from = el.scrollTop;
    let controls: { stop: () => void } | null = null;
    const frameId = requestAnimationFrame(() => {
      const to = el.scrollHeight;
      controls = animate(from, to, {
        type: 'tween',
        duration: 0.75,
        ease: 'easeOut',
        onUpdate: (v) => {
          el.scrollTop = v;
        },
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      controls?.stop();
    };
  }, [messages]);

  return (
    <div className='relative flex min-h-0 flex-1 flex-col'>
      {/* 위쪽 페이드: 스크롤 영역 위에 겹쳐서 그라디언트가 보이도록 z-[3] */}
      <div
        className='pointer-events-none absolute top-0 right-0 left-0 z-[3] h-[2.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className='scrollbar-hide relative z-[2] flex min-h-0 flex-1 flex-col gap-[3.75rem] overflow-y-auto pt-[1rem] pb-[3rem]'
      >
        <div className='flex flex-col gap-[3.75rem]'>
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;

            // 내용이 전혀 없고(빈 문자열) 스트리밍도 아니며 에러/세션 실패 플래그도 없는 AI 메시지는
            // UI 상 의미가 없으므로 아예 렌더하지 않는다.
            if (
              msg.role === 'ai' &&
              !msg.isError &&
              !msg.content &&
              !isStreaming &&
              !sessionLoadFailed &&
              !isLast
            ) {
              return null;
            }

            if (
              msg.role === 'ai' &&
              !msg.isError &&
              !msg.content &&
              !isStreaming &&
              isLast &&
              conversationCompleted
            ) {
              return null;
            }

            const turnIndex =
              index >= 2 ? Math.floor((index - 2) / 2) : -1;
            const preloaded: InsightSummaryResDTO[] | undefined =
              turnIndex >= 0
                ? (insightTurnHistory[turnIndex]?.insights ??
                    insightsByTurn[turnIndex])
                : undefined;
            const searchKeywordForTurn =
              index >= 1 && messages[index - 1]?.role === 'user'
                ? (messages[index - 1].content ?? '').trim()
                : '';

            return msg.role === 'ai' ? (
              <div
                key={`ai-${index}`}
                role={onAIMessageClick ? 'button' : undefined}
                className={`flex items-start gap-[1.5rem] text-left ${onAIMessageClick ? '' : ''}`}
                onClick={onAIMessageClick}
                onKeyDown={
                  onAIMessageClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onAIMessageClick();
                        }
                      }
                    : undefined
                }
                tabIndex={onAIMessageClick ? 0 : undefined}
              >
                <Image
                  src='/ChataiIcon.svg'
                  alt='AI Message Icon'
                  width={48}
                  height={48}
                />
                <div className='font-regular max-w-[53.75rem] flex flex-col gap-[1.5rem] rounded-tl-[0.25rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2.25rem] py-[1.75rem] text-[1rem] whitespace-pre-wrap text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
                  {/* 1. 맨 위: 인사이트 문구 + 로그 카드 */}
                  {(msg.content || (preloaded?.length ?? 0) > 0) && index > 0 ? (
                    <ChatAnalogs
                      searchKeyword={searchKeywordForTurn}
                      preloadedInsights={preloaded}
                    />
                  ) : index === 0 && !msg.content && !isStreaming ? (
                    <ChatAnalogs
                      searchKeyword=''
                      preloadedInsights={undefined}
                    />
                  ) : null}
                  {/* 2. 하단: AI 메시지(에러/재시도/로딩/본문) */}
                  {msg.isError ? (
                    <div className='flex flex-col gap-[1rem]'>
                      <p className='text-[1rem] leading-[160%]'>
                        앗, 답변 생성 중 오류가 발생했어요.
                        <br />
                        아래 버튼을 눌러 다시 시도해주세요.
                      </p>
                      <button
                        type='button'
                        style={{ width: '10rem', height: '2.5rem' }}
                        className='relative z-[999] shrink-0 cursor-pointer rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-4 py-2 text-[1rem] font-semibold text-[#5060C5] hover:bg-[#EEEDF7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5]'
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetryAIMessage?.(index);
                        }}
                      >
                        다시 시도하기
                      </button>
                    </div>
                  ) : !msg.content && !isStreaming && isLast ? (
                    <ChatErrorReloadMessage onRetry={onRetrySession} />
                  ) : msg.content ? (
                    msg.content
                  ) : isStreaming && isLast ? (
                    <ChatLoadingMessage />
                  ) : null}
                </div>
              </div>
            ) : (
              <div
                key={`user-${index}`}
                tabIndex={0}
                className='flex w-full justify-end text-left select-text'
                onClick={onUserMessageClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onUserMessageClick?.();
                  }
                }}
              >
                <div className='font-regular mr-[0.5rem] max-w-[53.75rem] rounded-tl-[2rem] rounded-tr-[0.25rem] rounded-br-[2rem] rounded-bl-[2rem] border border-none bg-[#F6F5FF] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033] select-text'>
                  <div className='flex flex-col gap-[0.75rem]'>
                    {msg.files && msg.files.length > 0 && (
                      <div className='flex flex-wrap gap-[0.75rem]'>
                        {msg.files.map((file, fileIdx) => {
                          const isImage = file.type.startsWith('image/');
                          const isPdf = file.type === 'application/pdf';
                          return (
                            <div
                              key={fileIdx}
                              className='relative flex h-[4.125rem] w-[17.875rem] items-center gap-[0.75rem] rounded-[0.75rem] border border-[#D1D5DB] bg-white px-[1rem] py-[0.75rem]'
                            >
                              {isImage && file.preview ? (
                                <div className='h-[2.5rem] w-[2.5rem] shrink-0 overflow-hidden'>
                                  <Image
                                    src={file.preview}
                                    alt={file.name}
                                    width={40}
                                    height={40}
                                    className='h-full w-full object-cover'
                                  />
                                </div>
                              ) : isPdf ? (
                                <div className='shrink-0'>
                                  <PdfIcon />
                                </div>
                              ) : null}
                              <div className='flex flex-col'>
                                <span
                                  className='truncate text-[1rem] font-semibold text-[#1A1A1A]'
                                  title={file.name}
                                >
                                  {truncateFileName(file.name)}
                                </span>
                                <span className='text-[0.75rem] text-[#74777D]'>
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {msg.contentParts && msg.contentParts.length > 0 ? (
                      <span className='whitespace-pre-wrap'>
                        {msg.contentParts.map((part, i) =>
                          part.type === 'mention' ? (
                            <span
                              key={i}
                              className='mx-[0.125rem] inline-flex items-center rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[1rem] py-[0.125rem] align-baseline text-[0.875rem] font-semibold text-[#5060C5]'
                            >
                              @ {part.title}
                            </span>
                          ) : (
                            <span key={i}>{part.text}</span>
                          ),
                        )}
                      </span>
                    ) : msg.content ? (
                      <span className='whitespace-pre-wrap'>{msg.content}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 아래쪽 페이드: 스크롤 영역 위에 겹쳐서 그라디언트가 보이도록 z-[3] */}
      <div
        className='pointer-events-none absolute right-0 bottom-0 left-0 z-[3] h-[1.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
    </div>
  );
}

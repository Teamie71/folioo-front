'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import Image from 'next/image';
import type { ContentPart } from './ChatInput';
import { ChatAnalogs } from './ChatAnalogs';
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
  /* AI 메시지가 스트리밍 중일 때 true*/
  isStreaming?: boolean;
}

export function ChatMessageSection({
  messages,
  onAIMessageClick,
  onUserMessageClick,
  isStreaming = false,
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
      {/* 위쪽 페이드 */}
      <div
        className='pointer-events-none absolute top-0 right-0 left-0 z-[5] h-[2.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className='scrollbar-hide flex min-h-0 flex-1 flex-col gap-[3.75rem] overflow-y-auto pt-[1rem] pb-[1rem]'
      >
        <div className='flex flex-col gap-[3.75rem]'>
          {messages.map((msg, index) =>
            msg.role === 'ai' ? (
              <button
                key={`ai-${index}`}
                type='button'
                className='flex cursor-pointer items-start gap-[1.5rem] text-left'
                onClick={onAIMessageClick}
              >
                <Image
                  src='/ChataiIcon.svg'
                  alt='AI Message Icon'
                  width={48}
                  height={48}
                />
                <div className='font-regular max-w-[53.75rem] rounded-tl-[0.25rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2.25rem] py-[1.75rem] text-[1rem] whitespace-pre-wrap text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
                  {msg.content ? (
                    msg.content
                  ) : isStreaming && index === messages.length - 1 ? (
                    <ChatLoadingMessage />
                  ) : (
                    <ChatAnalogs />
                  )}
                </div>
              </button>
            ) : (
              <button
                key={`user-${index}`}
                type='button'
                className='flex w-full cursor-pointer justify-end text-left'
                onClick={onUserMessageClick}
              >
                <div className='font-regular mr-[0.5rem] max-w-[53.75rem] rounded-tl-[2rem] rounded-tr-[0.25rem] rounded-br-[2rem] rounded-bl-[2rem] border border-none bg-[#F6F5FF] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
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
              </button>
            ),
          )}
        </div>
      </div>
      {/* 아래쪽 페이드 */}
      <div
        className='pointer-events-none absolute right-0 bottom-0 left-0 z-[5] h-[2.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
    </div>
  );
}

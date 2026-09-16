'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import styles from '@/styles/experience-agent.module.css';
import {
  ExperienceAgentConversation,
  type AgentConversation,
} from './ExperienceAgentConversation';
import { AgentIcon } from '@/components/icons/agent/AgentIcon';
import { AttachIcon } from '@/components/icons/AttachIcon';
import { AgentValidationToast } from './AgentValidationToast';
import { PdfIcon } from '@/components/icons/PdfIcon';
import { FileText, X } from 'lucide-react';
import { SendArrowIcon } from '@/components/icons/SendArrowIcon';

const SCENARIOS = [
  {
    title: '채팅에 나의 경험 입력하기',
    file: false,
    prompts: [
      '고객 문의 200건을 살펴보니 비슷한 질문이 많아서 안내 문구를 바꿨고, 반복 문의가 30% 줄었어.',
      '팀원마다 자료 정리 방식이 달라서 보기 힘들었어. 그래서 공용 템플릿을 만들었더니, 쓰기도 편하고 보기도 편했어.',
    ],
  },
  {
    title: '파일로 나의 경험 업로드하기',
    file: true,
    prompts: [
      '이 자기소개서에서 사용한 소재를 경험으로 정리해줘.',
      '이 회의록을 바탕으로 문제 해결 경험을 정리해줘.',
    ],
  },
] as const;

type Props = {
  conversation?: AgentConversation;
  dailyChatCount?: number;
  input: string;
  onInputChange: (value: string) => void;
  attachment: File | null;
  onAttachmentChange: (file: File | null) => void;
};

export function ExperienceAgentMain({
  conversation,
  dailyChatCount = 0,
  input,
  onInputChange,
  attachment,
  onAttachmentChange,
}: Props) {
  const hasConversation = Boolean(
    conversation &&
    (conversation.messages.length ||
      conversation.isWorking ||
      conversation.failure),
  );
  const usedCount = Math.max(0, Math.min(10, Math.floor(dailyChatCount)));
  const showCount = usedCount >= 7;
  const limitReached = usedCount >= 10;
  const limitMessage =
    '오늘 사용 가능한 10회를 모두 사용했어요. 내일 다시 이어서 도와드릴게요.';
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const composer = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const composerContent = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = composer.current;
    const content = composerContent.current;
    if (!container || !content) return;
    const updateHeight = () => {
      container.style.height = `${content.getBoundingClientRect().height}px`;
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  const [multiline, setMultiline] = useState(false);
  const expanded = Boolean(attachment) || multiline;
  useLayoutEffect(() => {
    const update = () => {
      if (measure.current)
        setMultiline(measure.current.getBoundingClientRect().height > 22);
    };
    const observer = new ResizeObserver(update);
    if (measure.current) observer.observe(measure.current);
    update();
    return () => observer.disconnect();
  }, [input]);
  const [notice, setNotice] = useState<{ message: string; id: number } | null>(
    null,
  );
  const showNotice = (message: string) =>
    setNotice((prev) => ({ message, id: (prev?.id ?? 0) + 1 }));

  return (
    <div
      className='min-h-0 flex-1 overflow-y-auto px-[20px] pb-[32px]'
      data-agent-main
    >
      {hasConversation && conversation ? (
        <ExperienceAgentConversation {...conversation} />
      ) : (
        <div className='flex flex-col items-center pt-[172px]'>
          <AgentIcon className='size-[48px] shrink-0' />
          <p className='text-gray9 mt-[20px] text-center text-[18px] leading-[130%] font-semibold tracking-normal'>
            편하게 활동 내용을 알려주시면,
            <br />
            활용 가능한 경험으로 정리할게요.
          </p>
        </div>
      )}
      <div
        ref={composer}
        className={`${styles.composer} ${hasConversation ? 'mt-[28px]' : 'mt-[100px]'}`}
        data-agent-composer
      >
        <div
          ref={composerContent}
          className={`relative flex max-h-[204px] min-h-[48px] w-full rounded-[20px] bg-white ${expanded ? 'flex-col pt-[16px] pb-[48px]' : showCount ? 'items-center pr-[126px]' : 'items-center pr-[80px]'}`}
        >
          <div
            ref={measure}
            aria-hidden
            style={{ width: `calc(100% - ${showCount ? 154 : 108}px)` }}
            className='pointer-events-none invisible absolute top-0 left-[16px] text-[14px] leading-[22px] break-words whitespace-pre-wrap'
          >
            {input || ' '}
            {input.endsWith('\n') ? '\u200b' : ''}
          </div>
          <div
            data-agent-input-scroll
            className={`${styles.inputScroll} relative z-10 min-h-0 ${expanded ? 'mx-0 mr-[12px] ml-[16px] max-h-[188px] overflow-y-auto pr-[8px]' : 'min-w-0 flex-1 overflow-hidden pr-[8px] pl-[16px]'}`}
          >
            {attachment && (
              <div
                data-agent-attachment
                className='border-gray3 relative mb-[8px] flex w-[260px] max-w-full items-center gap-[8px] rounded-[12px] border bg-white p-[10px] pr-[28px]'
              >
                <span
                  aria-hidden
                  className='flex size-[40px] shrink-0 items-center justify-center'
                >
                  {/\.pdf$/i.test(attachment.name) ? (
                    <PdfIcon />
                  ) : (
                    <FileText className='text-gray5 size-[32px]' />
                  )}
                </span>
                <div className='min-w-0 flex-1'>
                  <p
                    title={attachment.name}
                    className='text-gray9 truncate text-[14px] leading-[21px]'
                  >
                    {attachment.name}
                  </p>
                  <p className='text-gray6 text-[12px] leading-[18px]'>
                    {(attachment.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => onAttachmentChange(null)}
                  aria-label='첨부 파일 삭제'
                  className='bg-gray6 absolute top-[8px] right-[8px] flex size-[18px] cursor-pointer items-center justify-center rounded-[4px] text-white'
                >
                  <X aria-hidden className='size-[16px]' />
                </button>
              </div>
            )}
            <textarea
              ref={textarea}
              rows={1}
              value={input}
              aria-label='에이전트 채팅 입력'
              placeholder='내용 또는 파일을 추가해 주세요.'
              onChange={(event) => {
                const value = event.target.value;
                if (value.length > 500) {
                  showNotice('입력 가능한 최대 글자수(500자)를 초과했어요.');
                  return;
                }
                if (limitReached) showNotice(limitMessage);
                else setNotice(null);
                onInputChange(value);
              }}
              onKeyDown={(event) => {
                if (limitReached && event.key === 'Enter')
                  showNotice(limitMessage);
                // 전송 API 연결 전에는 Enter로도 목업 대화를 생성하지 않는다.
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                )
                  event.preventDefault();
              }}
              className={`text-gray9 placeholder:text-gray5 block [field-sizing:content] min-h-[22px] w-full resize-none overflow-hidden bg-transparent text-[14px] leading-[22px] outline-none ${expanded ? 'p-0' : 'py-[13px]'}`}
            />
          </div>
          <input
            ref={fileInput}
            type='file'
            className='hidden'
            accept='.pdf,.png,.jpg,.jpeg,.docx,.pptx,.txt'
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              if (!/\.(pdf|png|jpe?g|docx|pptx|txt)$/i.test(file.name)) {
                showNotice(
                  'PDF, PNG, JPG/JPEG, DOCX, TXT 형식만 업로드 가능해요.',
                );
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                showNotice('업로드 가능한 최대 용량(5MB)을 초과했어요.');
                return;
              }
              if (limitReached) showNotice(limitMessage);
              else setNotice(null);
              onAttachmentChange(file);
            }}
          />
        </div>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.25)]'
        />
        <div className='absolute right-0 bottom-[8px] z-10 flex items-center'>
          {showCount && (
            <span
              aria-label={`오늘 채팅 ${usedCount}회 사용, 최대 10회`}
              className={`${styles.dailyCount} ${limitReached ? styles.dailyCountLimit : ''}`}
            >
              {usedCount}/10
            </span>
          )}
          <button
            type='button'
            onClick={() => fileInput.current?.click()}
            aria-label='파일 첨부'
            className='relative z-10 mr-[8px] flex size-[28px] shrink-0 cursor-pointer items-center justify-center'
          >
            <AttachIcon className='h-[23px] w-[20px]' />
          </button>
          <button
            type='button'
            disabled
            aria-label='전송'
            title={
              limitReached
                ? '오늘 사용 가능한 채팅 횟수를 모두 사용했어요.'
                : '채팅 전송 기능은 준비 중이에요.'
            }
            className='bg-main disabled:bg-gray4 relative z-10 mr-[12px] flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed'
          >
            <SendArrowIcon className='h-[17px] w-[14px]' />
          </button>
        </div>
      </div>

      {!hasConversation && (
        <div className='mt-[20px] flex flex-col gap-[8px]'>
          {SCENARIOS.map((scenario) => (
            <section key={scenario.title} aria-label={scenario.title}>
              <h3 className='text-main flex items-center gap-[6px] text-[14px] leading-[24px] font-normal'>
                <span
                  aria-hidden
                  className='size-[9px] shrink-0 rounded-full bg-gradient-to-b from-[#93B3F4]/75 to-[#5060C5]/75'
                />
                {scenario.title}
              </h3>
              <div className='border-gray4 ml-[4px] flex flex-col gap-[8px] border-l pl-[7px]'>
                {scenario.prompts.map((prompt, index) => (
                  <button
                    key={prompt}
                    type='button'
                    onClick={() => {
                      onInputChange(prompt);
                      if (limitReached) showNotice(limitMessage);
                      else setNotice(null);
                      textarea.current?.focus({ preventScroll: true });
                      if (scenario.file) fileInput.current?.click();
                    }}
                    className={`border-gray3 text-gray7 cursor-pointer rounded-[12px] border p-[10px] text-left text-[14px] leading-[150%] font-normal tracking-normal ${!scenario.file && index === 0 ? 'bg-white' : 'bg-gray2'} focus-visible:outline-main focus-visible:outline-2`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      {notice && (
        <AgentValidationToast
          key={notice.id}
          message={notice.message}
          anchor={composer}
          onDismiss={() => setNotice(null)}
        />
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MOCK_AGENT_MESSAGES, type MockAgentMessage } from '@/features/experience/list/mock';
import { EXPERIENCE_LIST_ASSET } from '@/features/experience/list/constants';
import { useExperienceListStore } from '@/store/useExperienceListStore';

export function ExperienceListAgentPanel() {
  const open = useExperienceListStore((s) => s.agentOpen);
  const onToggle = useExperienceListStore((s) => s.toggleAgent);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MockAgentMessage[]>(MOCK_AGENT_MESSAGES);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: MockAgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const aiMsg: MockAgentMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      content:
        '지금은 와이어프레임 목업이에요. 실제 AI 응답은 이후 연동에서 연결됩니다.',
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  if (!open) {
    return (
      <aside className='absolute top-[27px] right-[20px] z-20'>
        <button
          type='button'
          onClick={onToggle}
          className='flex size-[32px] items-center justify-center rounded-[8px]'
          aria-label='AI 에이전트 열기'
        >
          <Image
            src={`${EXPERIENCE_LIST_ASSET}/icon-sidebar.svg`}
            alt=''
            width={20}
            height={20}
            unoptimized
          />
        </button>
      </aside>
    );
  }

  return (
    <aside className='flex h-full w-[400px] shrink-0 flex-col border-l border-gray3 bg-[#f7f7f8]'>
      <header className='flex shrink-0 items-center gap-[12px] px-[19px] pt-[28px] pb-[20px]'>
        <button
          type='button'
          onClick={onToggle}
          className='flex size-[32px] items-center justify-center rounded-[8px]'
          aria-label='AI 에이전트 접기'
        >
          <Image
            src={`${EXPERIENCE_LIST_ASSET}/icon-sidebar.svg`}
            alt=''
            width={20}
            height={20}
            unoptimized
          />
        </button>
        <h2 className='typo-b2-b text-gray9'>AI 에이전트</h2>
      </header>

      <div className='flex flex-1 flex-col gap-[16px] overflow-y-auto px-[19px] pb-[16px]'>
        {messages.length === 0 ? (
          <p className='typo-b2 text-gray6'>
            경험 정리에 대해 질문해 보세요.
          </p>
        ) : (
          messages.map((message) =>
            message.role === 'user' ? (
              <div key={message.id} className='flex justify-end'>
                <div className='max-w-[calc(100%-60px)] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[2px] rounded-bl-[10px] bg-white py-[4px] pr-[4px] pl-[10px]'>
                  <p className='typo-b2 text-gray9'>{message.content}</p>
                </div>
              </div>
            ) : (
              <p
                key={message.id}
                className='typo-b2 max-w-[calc(100%-60px)] text-gray9'
              >
                {message.content}
              </p>
            ),
          )
        )}
      </div>

      <div className='shrink-0 px-[20px] pt-[8px] pb-[24px]'>
        <div className='relative flex h-[48px] w-full items-center rounded-[32px] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]'>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.25)]'
          />
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // IME 조합 중 Enter 무시
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            placeholder='질문하세요.'
            className='typo-b2 relative z-10 h-full min-w-0 flex-1 bg-transparent pr-[8px] pl-[24px] text-gray9 outline-none placeholder:text-gray6'
          />
          <button
            type='button'
            className='relative z-10 mr-[8px] flex size-[28px] shrink-0 items-center justify-center'
            aria-label='파일 첨부'
          >
            <Image
              src={`${EXPERIENCE_LIST_ASSET}/icon-attach.svg`}
              alt=''
              width={20}
              height={23}
              unoptimized
            />
          </button>
          <button
            type='button'
            onClick={send}
            className='relative z-10 mr-[8px] flex size-[32px] shrink-0 items-center justify-center rounded-full bg-main'
            aria-label='전송'
          >
            <Image
              src={`${EXPERIENCE_LIST_ASSET}/icon-send-arrow.svg`}
              alt=''
              width={14}
              height={17}
              unoptimized
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

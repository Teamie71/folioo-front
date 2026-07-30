'use client';

import { useState } from 'react';
import { MOCK_AGENT_MESSAGES, type MockAgentMessage } from '@/features/experience/list/mock';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { AttachIcon } from '@/components/icons/AttachIcon';
import { SendArrowIcon } from '@/components/icons/SendArrowIcon';
import { SidebarPanelIcon } from '@/components/icons/SidebarPanelIcon';

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
          <SidebarPanelIcon className='size-[20px]' />
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
          <SidebarPanelIcon className='size-[20px]' />
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
            <AttachIcon className='h-[23px] w-[20px]' />
          </button>
          <button
            type='button'
            onClick={send}
            className='relative z-10 mr-[8px] flex size-[32px] shrink-0 items-center justify-center rounded-full bg-main'
            aria-label='전송'
          >
            <SendArrowIcon className='h-[17px] w-[14px]' />
          </button>
        </div>
      </div>
    </aside>
  );
}

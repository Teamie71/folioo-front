'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MOCK_AGENT_MESSAGES,
  type MockAgentMessage,
} from '@/features/experience/list/mock';
import { AGENT_PANEL_MODE } from '@/features/experience/list/constants';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { AttachIcon } from '@/components/icons/AttachIcon';
import { SendArrowIcon } from '@/components/icons/SendArrowIcon';
import { SidebarPanelIcon } from '@/components/icons/SidebarPanelIcon';

const PANEL_WIDTH = '400px';
const PANEL_TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

function AgentComingSoonBody() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center px-[24px] text-center'>
      <p className='typo-b1-sb text-gray9'>
        경험정리를 도와주는
        <br />
        AI 에이전트를 준비 중이에요.
      </p>
      <p className='typo-c2 text-gray9 mt-[20px]'>
        경험정리 과정에서 어렵거나 불편한 점이 있다면
        <br />
        <Link
          href='/feedback'
          className='text-main underline underline-offset-2'
        >
          피드백
        </Link>
        을 통해 알려주세요.
        <br />
        보내주신 의견을 바탕으로 더 나은 서비스를 만들겠습니다.
      </p>
    </div>
  );
}

function AgentChatBody({
  messages,
  panelOpen,
}: {
  messages: MockAgentMessage[];
  panelOpen: boolean;
}) {
  return (
    <div
      className='flex flex-1 flex-col gap-[16px] overflow-y-auto px-[19px] pb-[16px]'
      aria-hidden={!panelOpen}
    >
      {messages.length === 0 ? (
        <p className='typo-b2 text-gray6'>경험 정리에 대해 질문해 보세요.</p>
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
              className='typo-b2 text-gray9 max-w-[calc(100%-60px)]'
            >
              {message.content}
            </p>
          ),
        )
      )}
    </div>
  );
}

function AgentComposer({
  enabled,
  panelOpen,
  input,
  onInputChange,
  onSend,
}: {
  enabled: boolean;
  panelOpen: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  const tabIndex = panelOpen && enabled ? 0 : -1;

  return (
    <div className='shrink-0 px-[20px] pt-[8px] pb-[24px]'>
      <div className='relative flex h-[48px] w-full items-center rounded-[32px] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.25)]'
        />
        <input
          type='text'
          value={input}
          disabled={!enabled}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (!enabled) return;
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={enabled ? '질문하세요.' : 'placeholder'}
          tabIndex={tabIndex}
          className='typo-b2 text-gray9 placeholder:text-gray5 relative z-10 h-full min-w-0 flex-1 bg-transparent pr-[8px] pl-[24px] outline-none disabled:cursor-not-allowed'
        />
        <button
          type='button'
          disabled={!enabled}
          tabIndex={tabIndex}
          className='relative z-10 mr-[8px] flex size-[28px] shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60'
          aria-label='파일 첨부'
        >
          <AttachIcon className='h-[23px] w-[20px]' />
        </button>
        <button
          type='button'
          disabled={!enabled}
          onClick={onSend}
          tabIndex={tabIndex}
          className='bg-main relative z-10 mr-[8px] flex size-[32px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60'
          aria-label='전송'
        >
          <SendArrowIcon className='h-[17px] w-[14px]' />
        </button>
      </div>
    </div>
  );
}

export function ExperienceListAgentPanel() {
  const open = useExperienceListStore((s) => s.agentOpen);
  const onToggle = useExperienceListStore((s) => s.toggleAgent);
  const isChat = AGENT_PANEL_MODE === 'chat';
  const [input, setInput] = useState('');
  const [messages, setMessages] =
    useState<MockAgentMessage[]>(MOCK_AGENT_MESSAGES);

  const send = () => {
    if (!isChat) return;
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

  return (
    <motion.aside
      initial={false}
      animate={{
        width: open ? PANEL_WIDTH : 0,
        opacity: open ? 1 : 0,
      }}
      transition={PANEL_TRANSITION}
      style={{ overflow: 'hidden' }}
      className='border-gray3 flex h-full shrink-0 flex-col border-l bg-[#f7f7f8]'
      aria-hidden={!open}
    >
      <div className='flex h-full w-[400px] flex-col'>
        <header className='flex h-[79px] shrink-0 items-center gap-[12px] px-[20px]'>
          <button
            type='button'
            onClick={onToggle}
            className='flex size-[32px] cursor-pointer items-center justify-center rounded-[8px]'
            aria-label='AI 에이전트 접기'
            tabIndex={open ? 0 : -1}
          >
            <SidebarPanelIcon className='size-[20px]' />
          </button>
          {isChat ? (
            <h2 className='typo-b2-b text-gray9'>AI 에이전트</h2>
          ) : null}
        </header>

        {isChat ? (
          <AgentChatBody messages={messages} panelOpen={open} />
        ) : (
          <AgentComingSoonBody />
        )}

        <AgentComposer
          enabled={isChat}
          panelOpen={open}
          input={input}
          onInputChange={setInput}
          onSend={send}
        />
      </div>
    </motion.aside>
  );
}

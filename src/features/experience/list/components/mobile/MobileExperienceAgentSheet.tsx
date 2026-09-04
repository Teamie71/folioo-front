'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import {
  AGENT_COMING_SOON_COPY,
  AGENT_PANEL_MODE,
} from '@/features/experience/list/constants';
import {
  MOCK_AGENT_MESSAGES,
  type MockAgentMessage,
} from '@/features/experience/list/mock';
import { AttachIcon } from '@/components/icons/AttachIcon';
import { SendArrowIcon } from '@/components/icons/SendArrowIcon';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HALF_VH = 52;
const FULL_VH = 90;

const NUDGE_PX = 36;
const FLICK_VELOCITY = 0.45;

type Snap = 'half' | 'full';

function AgentComingSoon() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center px-[24px] text-center'>
      <p className='typo-b1-sb text-gray9'>
        {AGENT_COMING_SOON_COPY.titleFirstLine}
        <br />
        {AGENT_COMING_SOON_COPY.titleSecondLine}
      </p>
      <p className='typo-c2 text-gray9 mt-[20px]'>
        {AGENT_COMING_SOON_COPY.feedbackLead}
        <br />
        <Link
          href='/feedback'
          className='text-main underline underline-offset-2'
        >
          {AGENT_COMING_SOON_COPY.feedbackLinkLabel}
        </Link>
        {AGENT_COMING_SOON_COPY.feedbackTail}
      </p>
    </div>
  );
}

function AgentMessages({ messages }: { messages: MockAgentMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pt-[12px] pb-[8px]'>
      {messages.length === 0 ? (
        <p className='typo-b2 text-gray6'>경험 정리에 대해 질문해 보세요.</p>
      ) : (
        messages.map((message) =>
          message.role === 'user' ? (
            <div key={message.id} className='flex justify-end'>
              <div className='max-w-[calc(100%-60px)] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[2px] rounded-bl-[10px] bg-white px-[10px] py-[4px]'>
                <p className='typo-b2 text-gray9'>{message.content}</p>
              </div>
            </div>
          ) : (
            <p key={message.id} className='typo-b2 text-gray9 w-full'>
              {message.content}
            </p>
          ),
        )
      )}
      <div ref={endRef} />
    </div>
  );
}

function AgentComposer({
  enabled,
  input,
  onInputChange,
  onSend,
}: {
  enabled: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className='shrink-0 px-[16px] pt-[8px] pb-[calc(24px+env(safe-area-inset-bottom))]'>
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
          placeholder='내용 또는 파일을 추가해 주세요.'
          className='typo-b2 text-gray9 placeholder:text-gray5 relative z-10 h-full min-w-0 flex-1 bg-transparent pr-[8px] pl-[24px] outline-none disabled:cursor-not-allowed'
        />
        <button
          type='button'
          disabled={!enabled}
          className='relative z-10 mr-[8px] flex size-[28px] shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60'
          aria-label='파일 첨부'
        >
          <AttachIcon className='h-[23px] w-[20px]' />
        </button>
        <button
          type='button'
          disabled={!enabled || !input.trim()}
          onClick={onSend}
          className='bg-main relative z-10 mr-[8px] flex size-[32px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60'
          aria-label='전송'
        >
          <SendArrowIcon className='h-[17px] w-[14px]' />
        </button>
      </div>
    </div>
  );
}

export function MobileExperienceAgentSheet({ open, onOpenChange }: Props) {
  const isChat = AGENT_PANEL_MODE === 'chat';
  const [input, setInput] = useState('');
  const [messages, setMessages] =
    useState<MockAgentMessage[]>(MOCK_AGENT_MESSAGES);
  const [snap, setSnap] = useState<Snap>('half');
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [entered, setEntered] = useState(false);

  const startYRef = useRef(0);
  const startDragYRef = useRef(0);
  const dragYRef = useRef(0);
  const draggingRef = useRef(false);
  const lastMoveRef = useRef<{ y: number; t: number } | null>(null);
  const velocityRef = useRef(0);
  const snapRef = useRef<Snap>('half');

  useEffect(() => {
    snapRef.current = snap;
  }, [snap]);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      setDragY(0);
      dragYRef.current = 0;
      setSnap('half');
      snapRef.current = 'half';
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [open]);

  const sheetVh = snap === 'half' ? HALF_VH : FULL_VH;
  const pullUpPx = dragY < 0 ? -dragY : 0;
  const pushDownPx = dragY > 0 ? dragY : 0;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startDragYRef.current = dragYRef.current;
    lastMoveRef.current = { y: e.clientY, t: performance.now() };
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    let next = startDragYRef.current + delta;
    if (snapRef.current === 'half') {
      next = Math.max(-80, next);
    } else {
      next = Math.max(0, next);
    }
    dragYRef.current = next;
    setDragY(next);

    const now = performance.now();
    const last = lastMoveRef.current;
    if (last) {
      const dt = now - last.t;
      if (dt > 0) velocityRef.current = (e.clientY - last.y) / dt;
    }
    lastMoveRef.current = { y: e.clientY, t: now };
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    const y = dragYRef.current;
    const v = velocityRef.current;
    const flickDown = v > FLICK_VELOCITY;
    const flickUp = v < -FLICK_VELOCITY;

    if (snapRef.current === 'full') {
      if (flickDown || y > NUDGE_PX) {
        setSnap('half');
        snapRef.current = 'half';
        dragYRef.current = 0;
        setDragY(0);
        return;
      }
      dragYRef.current = 0;
      setDragY(0);
      return;
    }

    if (flickUp || y < -NUDGE_PX) {
      setSnap('full');
      snapRef.current = 'full';
      dragYRef.current = 0;
      setDragY(0);
      return;
    }

    if (flickDown || y > NUDGE_PX) {
      dragYRef.current = 0;
      setDragY(0);
      setEntered(false);
      window.setTimeout(() => onOpenChange(false), 200);
      return;
    }

    dragYRef.current = 0;
    setDragY(0);
  };

  const close = () => {
    setEntered(false);
    dragYRef.current = 0;
    setDragY(0);
    window.setTimeout(() => onOpenChange(false), 200);
  };

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

  if (!open) return null;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[80] bg-black/20 transition-opacity duration-200',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={close}
      />

      <div
        className={cn(
          'fixed right-0 bottom-0 left-0 z-[80] flex flex-col will-change-transform',
          !isDragging && 'transition-[transform,height] duration-200 ease-out',
        )}
        style={{
          height: `calc(${sheetVh}vh + ${pullUpPx}px)`,
          maxHeight: `${FULL_VH}vh`,
          transform: `translateY(${
            !entered && !isDragging ? '100%' : `${pushDownPx}px`
          })`,
        }}
      >
        <div className='flex h-full min-h-0 flex-col overflow-hidden rounded-t-[20px] bg-[#f7f7f8]'>
          <div
            className='flex h-[56px] shrink-0 touch-none flex-col items-center pt-[16px] active:cursor-grabbing'
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className='bg-gray4 h-[4px] w-[60px] rounded-[8px]' />
            <p className='typo-c1-b text-gray9 mt-[8px]'>AI 에이전트</p>
          </div>

          {isChat ? <AgentMessages messages={messages} /> : <AgentComingSoon />}

          <AgentComposer
            enabled={isChat}
            input={input}
            onInputChange={setInput}
            onSend={send}
          />
        </div>
      </div>
    </>
  );
}

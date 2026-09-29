'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';

/** Portal로 패널의 overflow에 잘리지 않으며 입력창 우측/상단을 따라간다. */
export function AgentValidationToast({
  message,
  anchor,
  onDismiss,
}: {
  message: string;
  anchor: RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}) {
  const toast = useRef<HTMLDivElement>(null);
  const dismiss = useRef(onDismiss);
  useLayoutEffect(() => {
    dismiss.current = onDismiss;
  }, [onDismiss]);

  useLayoutEffect(() => {
    const update = () => {
      if (!anchor.current || !toast.current) return;
      const rect = anchor.current.getBoundingClientRect();
      toast.current.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
      toast.current.style.bottom = `${window.innerHeight - rect.top + 20}px`;
      toast.current.style.maxWidth = `${Math.max(0, rect.right - 8)}px`;
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    if (anchor.current) observer.observe(anchor.current);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [anchor]);

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss.current(), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  return createPortal(
    <div
      ref={toast}
      role='alert'
      className='text-gray9 border-gray3 pointer-events-none fixed z-[1000] flex w-max items-center gap-[12px] rounded-[12px] border bg-[#f5f4ff] px-[32px] py-[16px] font-sans text-[16px] leading-[24px] font-semibold tracking-normal shadow-[0_4px_8px_rgba(0,0,0,0.2)]'
    >
      <span
        aria-hidden
        className='bg-main flex size-[20px] shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white'
      >
        !
      </span>
      <span>{message}</span>
    </div>,
    document.body,
  );
}

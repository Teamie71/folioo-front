'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/utils';

type Placement = 'top' | 'bottom';

type HoverTooltipProps = {
  label: string;
  children: React.ReactNode;
  placement?: Placement;
  align?: 'center' | 'start';
  className?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  suppressUntilPointerLeave?: boolean;
};

const GAP = 6;
const VIEWPORT_PAD = 8;

// 브라우저의 :hover는 포인터가 실제로 움직일 때만 갱신된다.
// 캔버스 줌/이동처럼 요소만 움직이는 경우엔 갱신되지 않으므로
// 마지막 포인터 좌표를 직접 추적해서 hit-test 한다.
const pointer = { x: -1, y: -1 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    true,
  );
}

export function HoverTooltip({
  label,
  children,
  placement = 'top',
  align: preferAlign = 'center',
  className,
  disabled = false,
  wrapperClassName,
  suppressUntilPointerLeave = false,
}: HoverTooltipProps) {
  const tipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const blockedRef = useRef(suppressUntilPointerLeave);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    align: 'center' | 'start';
  } | null>(null);

  useLayoutEffect(() => {
    if (!suppressUntilPointerLeave) {
      blockedRef.current = false;
      return;
    }
    blockedRef.current = !!triggerRef.current?.matches(':hover');
    if (blockedRef.current) setOpen(false);
  }, [suppressUntilPointerLeave]);

  useLayoutEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const close = () => setOpen(false);
    trigger.addEventListener('dragstart', close, true);
    window.addEventListener('dragend', close, true);
    return () => {
      trigger.removeEventListener('dragstart', close, true);
      window.removeEventListener('dragend', close, true);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    // 휠 조작(캔버스 줌/이동 등)으로 트리거가 포인터 아래에서 벗어나면
    // mouseleave가 발생하지 않아 툴팁이 남는다.
    // 열려 있는 동안 실제 hover 여부를 감시해서, 벗어나면 닫는다.
    let rafId = 0;
    // 포커스(키보드)로 열린 경우는 hover 감시 대상이 아니다.
    if (triggerRef.current?.matches(':hover')) {
      const checkHover = () => {
        const trigger = triggerRef.current;
        if (trigger && pointer.x >= 0) {
          const r = trigger.getBoundingClientRect();
          const inside =
            pointer.x >= r.left &&
            pointer.x <= r.right &&
            pointer.y >= r.top &&
            pointer.y <= r.bottom;
          if (!inside) {
            setOpen(false);
            return;
          }
        }
        rafId = requestAnimationFrame(checkHover);
      };
      rafId = requestAnimationFrame(checkHover);
    }

    document.addEventListener('pointerdown', closeOnOutsidePointerDown);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || disabled || !triggerRef.current) {
      setPos(null);
      return;
    }

    const update = () => {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const tipWidth = tip?.offsetWidth ?? 0;
      const tipHeight = tip?.offsetHeight ?? 0;
      const vw = window.innerWidth;
      const minLeft = VIEWPORT_PAD;
      const maxRight = vw - VIEWPORT_PAD;

      const top =
        placement === 'top' ? rect.top - GAP - tipHeight : rect.bottom + GAP;

      if (preferAlign === 'start') {
        let left = rect.left;
        if (tipWidth > 0 && left + tipWidth > maxRight) {
          left = Math.max(minLeft, maxRight - tipWidth);
        }
        if (left < minLeft) left = minLeft;
        setPos({ top, left, align: 'start' });
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const canCenter =
        tipWidth === 0 ||
        (centerX - tipWidth / 2 >= minLeft &&
          centerX + tipWidth / 2 <= maxRight);

      if (canCenter) {
        setPos({ top, left: centerX, align: 'center' });
        return;
      }

      let left = Math.max(rect.left, minLeft);
      if (tipWidth > 0 && left + tipWidth > maxRight) {
        left = Math.max(minLeft, maxRight - tipWidth);
      }
      setPos({ top, left, align: 'start' });
    };

    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, disabled, placement, label, preferAlign]);

  const show = () => {
    if (disabled || blockedRef.current) return;
    setOpen(true);
  };
  const hide = () => {
    blockedRef.current = false;
    setOpen(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn('inline-flex max-w-full', wrapperClassName)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {open &&
        !disabled &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role='tooltip'
            className={cn(
              'pointer-events-none fixed z-[300]',
              pos?.align === 'center' && '-translate-x-1/2',
              className,
            )}
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              visibility: pos ? 'visible' : 'hidden',
            }}
          >
            <div className='bg-gray7 typo-c1 rounded-[6px] px-[8px] py-[4px] whitespace-nowrap text-white'>
              {label}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

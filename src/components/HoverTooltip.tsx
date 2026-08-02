'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
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

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/utils';

export function MobileBottomSheet({
  open,
  onOpenChange,
  children,
  footer,
  zIndexClassName = 'z-50',
  heightClassName = 'h-[80vh]',
  overlayClassName,
  contentClassName,
  contentBottomPaddingClassName,
  showCloseButton = false,
  draggable = true,
  dismissOnSwipeDown = true,
  initialHeightVh = 80,
  maxHeightVh = 92,
  closeThresholdVh = 20,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  zIndexClassName?: string;
  heightClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  contentBottomPaddingClassName?: string;
  showCloseButton?: boolean;
  draggable?: boolean;
  dismissOnSwipeDown?: boolean;
  initialHeightVh?: number;
  maxHeightVh?: number;
  closeThresholdVh?: number;
}) {
  const [heightVh, setHeightVh] = useState(initialHeightVh);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(initialHeightVh);
  const draggingRef = useRef(false);
  const enableHeightDrag = draggable || dismissOnSwipeDown;

  const clampForDrag = (v: number) => Math.min(maxHeightVh, Math.max(10, v));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableHeightDrag) return;
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = heightVh;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const rawDeltaY = e.clientY - startYRef.current;
    // draggable=true면 위/아래 모두 허용, false면 아래로 줄이기만 허용
    const deltaY = draggable ? rawDeltaY : Math.max(0, rawDeltaY);
    if (!enableHeightDrag) return;
    const deltaVh = (deltaY / window.innerHeight) * 100;
    setHeightVh(clampForDrag(startHeightRef.current - deltaVh));
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (heightVh < closeThresholdVh) {
      onOpenChange(false);
      setHeightVh(initialHeightVh);
      return;
    }
    // 스냅 포인트 없이 손을 뗀 높이를 유지합니다.
  };

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

  if (!open) return null;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 animate-in fade-in duration-200',
          zIndexClassName,
          overlayClassName,
        )}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 flex flex-col animate-in slide-in-from-bottom duration-300',
          !isDragging && 'transition-[height] duration-250 ease-out',
          zIndexClassName,
          !enableHeightDrag && heightClassName,
        )}
        style={enableHeightDrag ? { height: `${heightVh}vh`, maxHeight: `${maxHeightVh}vh` } : undefined}
      >
        <div className='bg-white rounded-t-[1.25rem] flex flex-1 min-h-0 flex-col relative'>
          <div
            className={cn(
              'flex h-[3rem] shrink-0 justify-center pt-[1rem] pb-[0.5rem]',
              enableHeightDrag && 'touch-none cursor-grab active:cursor-grabbing',
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className='w-[3.75rem] h-[0.25rem] rounded-[0.5rem] bg-[#CDD0D5]' />
          </div>

          {showCloseButton && (
            <button
              type='button'
              className='absolute top-[0.75rem] right-[0.75rem] z-20 flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-[0.5rem] touch-manipulation'
              onClick={() => onOpenChange(false)}
              aria-label='닫기'
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke='#1A1A1A'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          )}

          <div
            className={cn(
              'flex-1 min-h-0 overflow-y-auto px-[1.5rem]',
              footer ? 'pb-[5rem]' : 'pb-[1rem]',
              contentBottomPaddingClassName,
              contentClassName,
            )}
          >
            {children}
          </div>

          {footer && (
            <div className='absolute right-0 bottom-0 left-0 z-10 border-t border-[#E9EAEC] bg-white px-[1rem] py-[1.5rem] pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

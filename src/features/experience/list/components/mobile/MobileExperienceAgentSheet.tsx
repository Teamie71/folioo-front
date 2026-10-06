'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/utils/utils';
import { MobileConnectedAgent } from '@/features/experience/list/components/mobile/MobileConnectedAgent';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experienceId?: string;
  view?: WorkspaceView;
};

const HALF_VH = 52;
const FULL_VH = 90;

const NUDGE_PX = 36;
const FLICK_VELOCITY = 0.45;

type Snap = 'half' | 'full';

export function MobileExperienceAgentSheet({
  open,
  onOpenChange,
  experienceId,
  view = 'list',
}: Props) {
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
        <div className='relative flex h-full min-h-0 flex-col overflow-hidden rounded-t-[20px] bg-[#f7f7f8]'>
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

          {experienceId ? (
            <MobileConnectedAgent
              key={experienceId}
              experienceId={experienceId}
              view={view}
            />
          ) : (
            <p className='typo-b2 text-gray6 flex flex-1 items-center justify-center'>
              활동을 선택해 주세요.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

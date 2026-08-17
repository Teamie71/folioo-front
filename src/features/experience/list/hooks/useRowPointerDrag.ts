'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  type DragPayload,
  type DragSize,
  setActiveDragPayload,
} from '@/features/experience/list/components/DropIndicator';

const LONG_PRESS_MS = 180;
const SCROLL_CANCEL_PX = 28;

function eventElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof Node) return target.parentElement;
  return null;
}

function isExcludedTarget(target: EventTarget | null) {
  const el = eventElement(target);
  if (!el) return true;
  return Boolean(
    el.closest(
      'button, a, input, textarea, [data-no-row-drag], [role="menuitem"]',
    ),
  );
}

type Options = {
  payload: DragPayload;
  measureEl: () => HTMLElement | null;
  onDragBegin: (size: DragSize) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: (clientX: number, clientY: number) => void;
  onDragCancel?: () => void;
  onTap?: () => void;
};

export function useRowPointerDrag({
  payload,
  measureEl,
  onDragBegin,
  onDragMove,
  onDragEnd,
  onDragCancel,
  onTap,
}: Options) {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number; pointerId: number } | null>(
    null,
  );
  const draggingRef = useRef(false);
  const pressedRef = useRef(false);
  const captureElRef = useRef<HTMLElement | null>(null);
  const measureElRef = useRef(measureEl);
  measureElRef.current = measureEl;

  useEffect(() => {
    const el = measureElRef.current();
    if (!el) return;
    const blockScrollWhileDragging = (e: TouchEvent) => {
      if (draggingRef.current) e.preventDefault();
    };
    el.addEventListener('touchmove', blockScrollWhileDragging, {
      passive: false,
    });
    return () => el.removeEventListener('touchmove', blockScrollWhileDragging);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    startRef.current = null;
    pressedRef.current = false;
    draggingRef.current = false;
    captureElRef.current = null;
  }, [clearTimer]);

  const beginDrag = useCallback(
    (clientX: number, clientY: number, pointerId: number) => {
      if (draggingRef.current || !pressedRef.current) return;
      draggingRef.current = true;
      const el = measureEl();
      const rect = el?.getBoundingClientRect();
      setActiveDragPayload(payload);
      onDragBegin({
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
      });
      onDragMove(clientX, clientY);
      try {
        captureElRef.current?.setPointerCapture(pointerId);
      } catch {}
    },
    [measureEl, onDragBegin, onDragMove, payload],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      if (isExcludedTarget(e.target)) return;

      pressedRef.current = true;
      draggingRef.current = false;
      captureElRef.current = e.currentTarget;
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        pointerId: e.pointerId,
      };

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}

      clearTimer();
      const pointerId = e.pointerId;
      const clientX = e.clientX;
      const clientY = e.clientY;
      timerRef.current = window.setTimeout(() => {
        beginDrag(clientX, clientY, pointerId);
      }, LONG_PRESS_MS);
    },
    [beginDrag, clearTimer],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start || start.pointerId !== e.pointerId) return;

      if (!draggingRef.current) {
        const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
        if (dist > SCROLL_CANCEL_PX) {
          clearTimer();
          pressedRef.current = false;
          startRef.current = null;
          try {
            captureElRef.current?.releasePointerCapture(e.pointerId);
          } catch {}
        }
        return;
      }

      e.preventDefault();
      onDragMove(e.clientX, e.clientY);
    },
    [clearTimer, onDragMove],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start || start.pointerId !== e.pointerId) {
        reset();
        return;
      }

      const wasDragging = draggingRef.current;
      const wasPressed = pressedRef.current;
      clearTimer();

      try {
        captureElRef.current?.releasePointerCapture(e.pointerId);
      } catch {}

      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();
        onDragEnd(e.clientX, e.clientY);
      } else if (wasPressed && !isExcludedTarget(e.target)) {
        onTap?.();
      }

      reset();
    },
    [clearTimer, onDragEnd, onTap, reset],
  );

  const onPointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (draggingRef.current) {
        onDragCancel?.();
      }
      try {
        captureElRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
      reset();
    },
    [onDragCancel, reset],
  );

  return {
    rowDragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onContextMenu: (e: ReactMouseEvent<HTMLElement>) => e.preventDefault(),
      className: 'select-none',
      style: {
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
      } as const,
    },
  };
}

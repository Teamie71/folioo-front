'use client';

import type { DragEvent } from 'react';
import { cn } from '@/utils/utils';

const LINE_INSET = 4;
const CHILD_INDENT = 24;

export function DropIndicator({
  visible,
  size,
  place = 'before',
  gap = 0,
  offset = 0,
  variant = 'sibling',
  className,
}: {
  visible: boolean;
  size?: DragSize | null;
  place?: 'before' | 'after';
  gap?: number;
  offset?: number;
  variant?: 'sibling' | 'child';
  className?: string;
}) {
  if (!visible) return null;

  const indent = variant === 'child' ? CHILD_INDENT : 0;
  const left = indent + LINE_INSET;
  const right = LINE_INSET;
  const edge = offset - gap / 2;

  const width =
    size?.width != null
      ? Math.max(size.width - indent - LINE_INSET * 2, 0)
      : undefined;

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute right-0 left-0 z-20 h-0',
        className,
      )}
      style={place === 'before' ? { top: edge } : { bottom: edge }}
    >
      <div
        className='bg-main absolute top-[-1px] h-[2px]'
        style={width != null ? { left, width } : { left, right }}
      />
    </div>
  );
}

export type DragPayload =
  | { type: 'group'; id: string }
  | { type: 'experience'; id: string }
  | { type: 'block'; experienceId: string; id: string };

export type DragSize = { width: number; height: number };

/** dragOver에서 React state보다 먼저 읽기 위한 동기 페이로드 */
let activeDrag: DragPayload | null = null;

export function getActiveDrag(): DragPayload | null {
  return activeDrag;
}

export function getActiveBlockDrag(
  experienceId: string,
): Extract<DragPayload, { type: 'block' }> | null {
  if (
    activeDrag?.type === 'block' &&
    activeDrag.experienceId === experienceId
  ) {
    return activeDrag;
  }
  return null;
}

export function clearActiveDrag() {
  activeDrag = null;
}

/** Safari는 커스텀 MIME을 막아서 text/plain 사용 */
export function setDragPayload(e: DragEvent, payload: DragPayload) {
  activeDrag = payload;
  const raw = JSON.stringify(payload);
  e.dataTransfer.setData('text/plain', raw);
  e.dataTransfer.effectAllowed = 'move';
}

export function getDragPayload(e: DragEvent): DragPayload | null {
  if (activeDrag) return activeDrag;
  const raw = e.dataTransfer.getData('text/plain');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
}

export function placeFromY(e: DragEvent, el: HTMLElement): 'before' | 'after' {
  const rect = el.getBoundingClientRect();
  const mid = rect.top + rect.height / 2;
  return e.clientY < mid ? 'before' : 'after';
}

/** before/after 경계 떨림 방지(히스테리시스) */
export function siblingDropKindFromY(
  e: DragEvent,
  el: HTMLElement,
  stickyKind?: 'before' | 'after' | null,
): 'before' | 'after' {
  const rect = el.getBoundingClientRect();
  const h = Math.max(rect.height, 1);
  const y = e.clientY - rect.top;
  if (y < 0) return 'before';
  if (y > h) return 'after';
  const ratio = y / h;

  if (stickyKind === 'before' && ratio < 0.62) return 'before';
  if (stickyKind === 'after' && ratio > 0.38) return 'after';
  return ratio < 0.5 ? 'before' : 'after';
}

export function blockDropKindFromY(
  e: DragEvent,
  rowEl: HTMLElement,
  allowInside: boolean,
  stickyKind?: 'before' | 'after' | 'inside' | null,
  fullMeasureEl?: HTMLElement | null,
): 'before' | 'after' | 'inside' {
  if (allowInside) {
    const rowRect = rowEl.getBoundingClientRect();
    const measureEl = fullMeasureEl ?? rowEl;
    const measureRect = measureEl.getBoundingClientRect();
    const y = e.clientY;
    const rowH = Math.max(rowRect.height, 1);
    const pad = 4;
    const hasChildrenArea = measureRect.height > rowRect.height + 4;

    if (!hasChildrenArea) {
      const edge = Math.min(Math.max(6, rowH * 0.22), rowH * 0.3);
      if (stickyKind === 'before' && y < rowRect.top + edge + pad) {
        return 'before';
      }
      if (stickyKind === 'after' && y > rowRect.bottom - edge - pad) {
        return 'after';
      }
      if (
        stickyKind === 'inside' &&
        y >= rowRect.top + edge - pad &&
        y <= rowRect.bottom - edge + pad
      ) {
        return 'inside';
      }
      if (y < rowRect.top + edge) return 'before';
      if (y > rowRect.bottom - edge) return 'after';
      return 'inside';
    }

    const topEdge = Math.min(Math.max(6, rowH * 0.18), rowH * 0.28);
    const bottomEdge = 14;

    if (stickyKind === 'before' && y < rowRect.top + topEdge + pad) {
      return 'before';
    }
    if (stickyKind === 'after' && y > measureRect.bottom - bottomEdge - pad) {
      return 'after';
    }
    if (
      stickyKind === 'inside' &&
      y >= rowRect.top + topEdge - pad &&
      y <= measureRect.bottom - bottomEdge + pad
    ) {
      return 'inside';
    }

    if (y < rowRect.top + topEdge) return 'before';
    if (y > measureRect.bottom - bottomEdge) return 'after';
    return 'inside';
  }

  return siblingDropKindFromY(
    e,
    fullMeasureEl ?? rowEl,
    stickyKind === 'before' || stickyKind === 'after' ? stickyKind : null,
  );
}

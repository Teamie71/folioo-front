'use client';

import { createPortal } from 'react-dom';
import type { MapDropTarget } from '@/features/experience/map/hooks/useMapBlockDrag';

const SIDE_INSET = 4;
const GAP = 8;

/**
 * 드래그 중 표시되는 드롭 인디케이터.
 * 대상 블록보다 좌우 4px씩 줄어든 너비로, 대상의 위/아래 8px 위치에 그린다.
 */
export function MapDropIndicator({ target }: { target: MapDropTarget }) {
  if (typeof document === 'undefined') return null;

  const { rect, place } = target;
  const top = place === 'before' ? rect.top - GAP : rect.bottom + GAP;

  return createPortal(
    <div
      aria-hidden
      className='bg-main pointer-events-none fixed z-[300] h-[2px] rounded-full'
      style={{
        top,
        left: rect.left + SIDE_INSET,
        width: Math.max(rect.width - SIDE_INSET * 2, 0),
      }}
    />,
    document.body,
  );
}

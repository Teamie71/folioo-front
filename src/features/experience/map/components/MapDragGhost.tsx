'use client';

import { createPortal } from 'react-dom';
import type { MapDragGhost as MapDragGhostState } from '@/features/experience/map/hooks/useMapBlockDrag';

const OFFSET_X = 12;
const OFFSET_Y = 12;

/** 드래그 중 커서를 따라다니는 블록 미리보기 */
export function MapDragGhost({ ghost }: { ghost: MapDragGhostState }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-hidden
      className='border-gray3 typo-c1 text-gray9 pointer-events-none fixed z-[300] max-w-[240px] truncate rounded-[8px] border bg-white px-[12px] py-[6px] opacity-90 shadow-[0px_4px_12px_0px_#00000026]'
      style={{ top: ghost.y + OFFSET_Y, left: ghost.x + OFFSET_X }}
    >
      {ghost.text}
    </div>,
    document.body,
  );
}

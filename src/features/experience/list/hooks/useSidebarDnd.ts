'use client';

import { useState } from 'react';
import {
  type DragSize,
  clearActiveDrag,
} from '@/features/experience/list/components/DropIndicator';

export type SidebarDropHint =
  | { kind: 'group'; id: string; place: 'before' | 'after' }
  | { kind: 'experience'; id: string; place: 'before' | 'after' }
  | { kind: 'group-end'; id: string }
  | null;

export function useSidebarDnd() {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragSize, setDragSize] = useState<DragSize | null>(null);
  const [dropHint, setDropHint] = useState<SidebarDropHint>(null);

  const clearDrag = () => {
    clearActiveDrag();
    setDraggingId(null);
    setDragSize(null);
    setDropHint(null);
  };

  return {
    draggingId,
    setDraggingId,
    dragSize,
    setDragSize,
    dropHint,
    setDropHint,
    clearDrag,
  };
}

export type SidebarDndState = ReturnType<typeof useSidebarDnd>;

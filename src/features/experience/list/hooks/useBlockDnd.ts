'use client';

import { createContext, useContext } from 'react';
import type { DragSize } from '@/features/experience/list/components/DropIndicator';
import type { Block } from '@/features/experience/list/types';

export type BlockDropHint = {
  targetId: string;
  kind: 'before' | 'after' | 'inside';
} | null;

export type EditRequest = { id: string; caret: number } | null;

export type BlockDndCtx = {
  experienceId: string;
  rootBlocks: Block[];
  draggingId: string | null;
  dragSize: DragSize | null;
  dropHint: BlockDropHint;
  editRequest: EditRequest;
  setDraggingId: (id: string | null) => void;
  setDragSize: (size: DragSize | null) => void;
  setDropHint: (hint: BlockDropHint) => void;
  setEditRequest: (req: EditRequest) => void;
  clearDrag: () => void;
  getDropHint: () => BlockDropHint;
  markDropped: () => void;
  finishDrag: (draggedId: string) => void;
  handlePointerDragMove: (clientX: number, clientY: number) => void;
  handlePointerDragEnd: (clientX: number, clientY: number) => void;
};

export const BlockDndContext = createContext<BlockDndCtx | null>(null);

export function useBlockDnd() {
  const ctx = useContext(BlockDndContext);
  if (!ctx) throw new Error('BlockDndContext missing');
  return ctx;
}

'use client';

import { useMemo, useRef, useState, type DragEvent } from 'react';
import {
  type DragSize,
  clearActiveDrag,
  getActiveBlockDrag,
  getDragPayload,
} from '@/features/experience/list/components/ui/DropIndicator';
import {
  type BlockDndCtx,
  type BlockDropHint,
  type EditRequest,
} from '@/features/experience/list/hooks/useBlockDnd';
import type { Block } from '@/features/experience/list/types';
import { isMeaningfulDrop } from '@/features/experience/list/utils/blockTreeUtils';
import { useExperienceListStore } from '@/store/useExperienceListStore';

export function useBlockTreeDnd(experienceId: string, blocks: Block[]) {
  const moveBlock = useExperienceListStore((s) => s.moveBlock);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragSize, setDragSize] = useState<DragSize | null>(null);
  const [dropHint, setDropHintState] = useState<BlockDropHint>(null);
  const [editRequest, setEditRequest] = useState<EditRequest>(null);
  const dropHintRef = useRef<BlockDropHint>(null);
  const didDropRef = useRef(false);

  const setDropHint = (hint: BlockDropHint) => {
    dropHintRef.current = hint;
    setDropHintState(hint);
  };

  const clearDrag = () => {
    clearActiveDrag();
    dropHintRef.current = null;
    didDropRef.current = false;
    setDraggingId(null);
    setDragSize(null);
    setDropHintState(null);
  };

  const applyCurrentDrop = (draggedId: string) => {
    const hint = dropHintRef.current;
    if (!hint) return false;
    if (!isMeaningfulDrop(blocks, draggedId, hint.targetId, hint.kind))
      return false;
    moveBlock(experienceId, draggedId, {
      kind: hint.kind,
      targetId: hint.targetId,
    });
    return true;
  };

  const value: BlockDndCtx = useMemo(
    () => ({
      experienceId,
      rootBlocks: blocks,
      draggingId,
      dragSize,
      dropHint,
      editRequest,
      setDraggingId,
      setDragSize,
      setDropHint,
      setEditRequest,
      clearDrag,
      getDropHint: () => dropHintRef.current,
      markDropped: () => {
        didDropRef.current = true;
      },
      finishDrag: (draggedId: string) => {
        if (!didDropRef.current) {
          applyCurrentDrop(draggedId);
        }
        clearDrag();
      },
    }),
    [experienceId, blocks, draggingId, dragSize, dropHint, editRequest],
  );

  const onRootDragOver = (e: DragEvent<HTMLDivElement>) => {
    const active = getActiveBlockDrag(experienceId);
    if (!active) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'none';
      setDropHint(null);
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onRootDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = getDragPayload(e);
    if (
      !payload ||
      payload.type !== 'block' ||
      payload.experienceId !== experienceId
    ) {
      clearDrag();
      return;
    }
    didDropRef.current = true;
    applyCurrentDrop(payload.id);
    clearDrag();
  };

  return { value, onRootDragOver, onRootDrop };
}

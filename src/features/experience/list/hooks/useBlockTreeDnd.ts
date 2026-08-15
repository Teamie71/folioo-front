'use client';

import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react';
import {
  type DragSize,
  clearActiveDrag,
  getActiveBlockDrag,
  getDragPayload,
  siblingDropKindFromClientY,
} from '@/features/experience/list/components/DropIndicator';
import {
  type BlockDndCtx,
  type BlockDropHint,
  type EditRequest,
} from '@/features/experience/list/hooks/useBlockDnd';
import type { Block } from '@/features/experience/list/types';
import {
  findBlockLocation,
  isMeaningfulDrop,
} from '@/features/experience/list/utils/blockTreeUtils';
import { useExperienceListStore } from '@/store/useExperienceListStore';

function sectionTitleEl(section: HTMLElement): HTMLElement {
  return (
    (section.querySelector(
      '[data-section-title-dnd]',
    ) as HTMLElement | null) ?? section
  );
}

function findSectionDropTarget(
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    const section = node.closest('[data-section-dnd]') as HTMLElement | null;
    if (section?.dataset.blockId) return section;
  }
  return null;
}

function hintForSectionPointerDrop(
  rootBlocks: Block[],
  draggedId: string,
  targetSection: HTMLElement,
  clientY: number,
  sticky: BlockDropHint,
): BlockDropHint {
  const targetId = targetSection.dataset.blockId;
  if (!targetId || targetId === draggedId) return null;

  const draggedLoc = findBlockLocation(rootBlocks, draggedId);
  const targetLoc = findBlockLocation(rootBlocks, targetId);
  if (!draggedLoc || !targetLoc) return null;

  if (draggedLoc.level !== 3 || targetLoc.level !== 3) return null;

  const measure = sectionTitleEl(targetSection);
  const stickyKind =
    sticky?.targetId === targetId &&
    (sticky.kind === 'before' || sticky.kind === 'after')
      ? sticky.kind
      : null;
  const kind = siblingDropKindFromClientY(clientY, measure, stickyKind);

  if (!isMeaningfulDrop(rootBlocks, draggedId, targetId, kind)) return null;
  return { targetId, kind };
}

export function useBlockTreeDnd(experienceId: string, blocks: Block[]) {
  const moveBlock = useExperienceListStore((s) => s.moveBlock);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragSize, setDragSize] = useState<DragSize | null>(null);
  const [dropHint, setDropHintState] = useState<BlockDropHint>(null);
  const [editRequest, setEditRequest] = useState<EditRequest>(null);
  const dropHintRef = useRef<BlockDropHint>(null);
  const didDropRef = useRef(false);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const setDropHint = useCallback((hint: BlockDropHint) => {
    dropHintRef.current = hint;
    setDropHintState(hint);
  }, []);

  const clearDrag = useCallback(() => {
    clearActiveDrag();
    dropHintRef.current = null;
    didDropRef.current = false;
    setDraggingId(null);
    setDragSize(null);
    setDropHintState(null);
  }, []);

  const applyCurrentDrop = useCallback(
    (draggedId: string) => {
      const hint = dropHintRef.current;
      if (!hint) return false;
      if (!isMeaningfulDrop(blocksRef.current, draggedId, hint.targetId, hint.kind))
        return false;
      moveBlock(experienceId, draggedId, {
        kind: hint.kind,
        targetId: hint.targetId,
      });
      return true;
    },
    [experienceId, moveBlock],
  );

  const handlePointerDragMove = useCallback(
    (clientX: number, clientY: number) => {
      const active = getActiveBlockDrag(experienceId);
      if (!active) {
        setDropHint(null);
        return;
      }
      const target = findSectionDropTarget(clientX, clientY);
      if (!target) {
        setDropHint(null);
        return;
      }
      setDropHint(
        hintForSectionPointerDrop(
          blocksRef.current,
          active.id,
          target,
          clientY,
          dropHintRef.current,
        ),
      );
    },
    [experienceId, setDropHint],
  );

  const handlePointerDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      const active = getActiveBlockDrag(experienceId);
      if (active) {
        const target = findSectionDropTarget(clientX, clientY);
        if (target) {
          setDropHint(
            hintForSectionPointerDrop(
              blocksRef.current,
              active.id,
              target,
              clientY,
              dropHintRef.current,
            ),
          );
        } else {
          setDropHint(null);
        }
        didDropRef.current = true;
        applyCurrentDrop(active.id);
      }
      clearDrag();
    },
    [experienceId, setDropHint, applyCurrentDrop, clearDrag],
  );

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
      handlePointerDragMove,
      handlePointerDragEnd,
    }),
    [
      experienceId,
      blocks,
      draggingId,
      dragSize,
      dropHint,
      editRequest,
      setDropHint,
      clearDrag,
      applyCurrentDrop,
      handlePointerDragMove,
      handlePointerDragEnd,
    ],
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

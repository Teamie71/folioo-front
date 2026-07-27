'use client';

import { type DragEvent } from 'react';
import {
  blockDropKindFromY,
  siblingDropKindFromY,
  getActiveBlockDrag,
  getDragPayload,
} from '@/features/experience/list/components/ui/DropIndicator';
import { useBlockDnd } from '@/features/experience/list/hooks/useBlockDnd';
import type { Block } from '@/features/experience/list/types';
import {
  canDropAt,
  findBlockLocation,
  isDescendant,
  isMeaningfulDrop,
} from '@/features/experience/list/utils/blockTreeUtils';
import { useExperienceListStore } from '@/store/useExperienceListStore';

function sectionDropMeasureEl(from: HTMLElement): HTMLElement {
  const section = from.closest('[data-section-dnd]') as HTMLElement | null;
  const title = section?.querySelector(
    '[data-section-title-dnd]',
  ) as HTMLElement | null;
  return title ?? section ?? from;
}

function blockMeasureEl(from: HTMLElement): HTMLElement {
  return (
    (from.closest('[data-dnd-measure]') as HTMLElement | null) ?? from
  );
}

function parentBlockMeasureEl(from: HTMLElement): HTMLElement | null {
  const self = from.closest('[data-dnd-measure]') as HTMLElement | null;
  if (!self?.parentElement) return null;
  return self.parentElement.closest('[data-dnd-measure]');
}

export function useBlockNodeDnd({
  block,
  level,
}: {
  block: Block;
  level: number;
  index: number;
}) {
  const dnd = useBlockDnd();
  const moveBlock = useExperienceListStore((s) => s.moveBlock);

  const isDragging = dnd.draggingId === block.id;
  const isInDragSubtree =
    isDragging ||
    (dnd.draggingId != null &&
      isDescendant(dnd.rootBlocks, dnd.draggingId, block.id));
  const hint =
    dnd.dropHint?.targetId === block.id ? dnd.dropHint.kind : null;

  const setHintOrClear = (
    e: DragEvent<HTMLElement>,
    draggedId: string,
    targetId: string,
    kind: 'before' | 'after' | 'inside',
  ) => {
    if (!isMeaningfulDrop(dnd.rootBlocks, draggedId, targetId, kind)) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }
    e.dataTransfer.dropEffect = 'move';
    dnd.setDropHint({ targetId, kind });
  };

  const applySiblingHint = (
    e: DragEvent<HTMLElement>,
    draggedId: string,
    targetId: string,
    measureEl: HTMLElement,
  ) => {
    const stickyKind =
      dnd.dropHint?.targetId === targetId ? dnd.dropHint.kind : null;
    const kind = siblingDropKindFromY(
      e,
      measureEl,
      stickyKind === 'before' || stickyKind === 'after' ? stickyKind : null,
    );
    setHintOrClear(e, draggedId, targetId, kind);
  };

  const onDragOverRow = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const active = getActiveBlockDrag(dnd.experienceId);
    if (!active) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }
    const draggedId = active.id;

    if (draggedId === block.id) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }

    const draggedLoc = findBlockLocation(dnd.rootBlocks, draggedId);
    if (!draggedLoc) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }

    if (draggedLoc.level === 3 && level > 3) {
      const loc = findBlockLocation(dnd.rootBlocks, block.id);
      if (!loc) {
        e.dataTransfer.dropEffect = 'none';
        dnd.setDropHint(null);
        return;
      }
      let sectionId: string | null = null;
      if (loc.level === 4) sectionId = loc.parentId;
      else if (loc.level === 5 && loc.parentId) {
        sectionId =
          findBlockLocation(dnd.rootBlocks, loc.parentId)?.parentId ?? null;
      }
      if (!sectionId || sectionId === draggedId) {
        e.dataTransfer.dropEffect = 'none';
        dnd.setDropHint(null);
        return;
      }
      const sectionEl =
        (e.currentTarget.closest('[data-section-dnd]') as HTMLElement | null) ??
        e.currentTarget;
      applySiblingHint(
        e,
        draggedId,
        sectionId,
        sectionDropMeasureEl(sectionEl),
      );
      return;
    }

    if (level === 5 && draggedLoc.level === 4) {
      const loc = findBlockLocation(dnd.rootBlocks, block.id);
      const parentId = loc?.parentId;
      const parentMeasure = parentBlockMeasureEl(e.currentTarget);

      if (
        canDropAt(dnd.rootBlocks, draggedId, block.id, 'before') ||
        canDropAt(dnd.rootBlocks, draggedId, block.id, 'after')
      ) {
        applySiblingHint(
          e,
          draggedId,
          block.id,
          blockMeasureEl(e.currentTarget),
        );
        return;
      }

      if (
        parentId &&
        parentMeasure &&
        canDropAt(dnd.rootBlocks, draggedId, parentId, 'inside')
      ) {
        const parentRow =
          (parentMeasure.querySelector(
            '[data-block-row-dnd]',
          ) as HTMLElement | null) ?? parentMeasure;
        const stickyKind =
          dnd.dropHint?.targetId === parentId ? dnd.dropHint.kind : null;
        const kind = blockDropKindFromY(
          e,
          parentRow,
          true,
          stickyKind,
          parentMeasure,
        );
        setHintOrClear(e, draggedId, parentId, kind);
        return;
      }

      if (parentId && parentMeasure) {
        applySiblingHint(e, draggedId, parentId, parentMeasure);
        return;
      }

      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }

    const allowInside =
      draggedLoc.level !== 3 &&
      level === 4 &&
      canDropAt(dnd.rootBlocks, draggedId, block.id, 'inside');

    const stickyKind =
      dnd.dropHint?.targetId === block.id ? dnd.dropHint.kind : null;

    let kind: 'before' | 'after' | 'inside';
    if (draggedLoc.level === 3 && level === 3) {
      kind = siblingDropKindFromY(
        e,
        sectionDropMeasureEl(e.currentTarget),
        stickyKind === 'before' || stickyKind === 'after' ? stickyKind : null,
      );
    } else if (!allowInside) {
      kind = siblingDropKindFromY(
        e,
        blockMeasureEl(e.currentTarget),
        stickyKind === 'before' || stickyKind === 'after' ? stickyKind : null,
      );
    } else {
      const measureEl = blockMeasureEl(e.currentTarget);
      const rowEl =
        (measureEl.querySelector(
          '[data-block-row-dnd]',
        ) as HTMLElement | null) ?? measureEl;
      kind = blockDropKindFromY(e, rowEl, true, stickyKind, measureEl);
    }

    setHintOrClear(e, draggedId, block.id, kind);
  };

  const onDropRow = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = getDragPayload(e);
    if (
      !payload ||
      payload.type !== 'block' ||
      payload.experienceId !== dnd.experienceId
    ) {
      dnd.clearDrag();
      return;
    }
    dnd.markDropped();
    const dropHint = dnd.getDropHint();
    if (
      dropHint &&
      isMeaningfulDrop(
        dnd.rootBlocks,
        payload.id,
        dropHint.targetId,
        dropHint.kind,
      )
    ) {
      moveBlock(dnd.experienceId, payload.id, {
        kind: dropHint.kind,
        targetId: dropHint.targetId,
      });
    }
    dnd.clearDrag();
  };

  const onDragOverInsideOnly = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const active = getActiveBlockDrag(dnd.experienceId);
    if (!active) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }

    if (level === 3) {
      const draggedLoc = findBlockLocation(dnd.rootBlocks, active.id);
      if (draggedLoc?.level === 3) {
        if (active.id === block.id) {
          e.dataTransfer.dropEffect = 'none';
          dnd.setDropHint(null);
          return;
        }
        const sectionEl =
          (e.currentTarget.closest('[data-section-dnd]') as HTMLElement | null) ??
          e.currentTarget;
        applySiblingHint(
          e,
          active.id,
          block.id,
          sectionDropMeasureEl(sectionEl),
        );
        return;
      }
    }

    if (level !== 4) {
      e.dataTransfer.dropEffect = 'none';
      dnd.setDropHint(null);
      return;
    }

    if (!canDropAt(dnd.rootBlocks, active.id, block.id, 'inside')) {
      applySiblingHint(e, active.id, block.id, blockMeasureEl(e.currentTarget));
      return;
    }

    const measureEl = blockMeasureEl(e.currentTarget);
    const rowEl =
      (measureEl.querySelector(
        '[data-block-row-dnd]',
      ) as HTMLElement | null) ?? measureEl;
    const stickyKind =
      dnd.dropHint?.targetId === block.id ? dnd.dropHint.kind : null;
    const kind = blockDropKindFromY(
      e,
      rowEl,
      true,
      stickyKind,
      measureEl,
    );
    setHintOrClear(e, active.id, block.id, kind);
  };

  const onDropInsideOnly = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = getDragPayload(e);
    if (
      !payload ||
      payload.type !== 'block' ||
      payload.experienceId !== dnd.experienceId
    ) {
      dnd.clearDrag();
      return;
    }

    const dropHint = dnd.getDropHint();
    dnd.markDropped();
    if (level === 3) {
      const draggedLoc = findBlockLocation(dnd.rootBlocks, payload.id);
      if (draggedLoc?.level === 3) {
        if (
          dropHint &&
          (dropHint.kind === 'before' || dropHint.kind === 'after') &&
          isMeaningfulDrop(
            dnd.rootBlocks,
            payload.id,
            dropHint.targetId,
            dropHint.kind,
          )
        ) {
          moveBlock(dnd.experienceId, payload.id, {
            kind: dropHint.kind,
            targetId: dropHint.targetId,
          });
        }
        dnd.clearDrag();
        return;
      }
    }

    if (
      dropHint &&
      isMeaningfulDrop(
        dnd.rootBlocks,
        payload.id,
        dropHint.targetId,
        dropHint.kind,
      )
    ) {
      moveBlock(dnd.experienceId, payload.id, {
        kind: dropHint.kind,
        targetId: dropHint.targetId,
      });
    } else if (
      isMeaningfulDrop(dnd.rootBlocks, payload.id, block.id, 'inside')
    ) {
      moveBlock(dnd.experienceId, payload.id, {
        kind: 'inside',
        targetId: block.id,
      });
    }
    dnd.clearDrag();
  };

  return {
    dnd,
    isDragging,
    isInDragSubtree,
    hint,
    onDragOverRow,
    onDropRow,
    onDragOverInsideOnly,
    onDropInsideOnly,
  };
}

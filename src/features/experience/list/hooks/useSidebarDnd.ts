'use client';

import { useCallback, useState } from 'react';
import {
  type DragSize,
  clearActiveDrag,
  getActiveDrag,
  placeFromClientY,
} from '@/features/experience/list/components/DropIndicator';
import { useExperienceListStore } from '@/store/useExperienceListStore';

export type SidebarDropHint =
  | { kind: 'group'; id: string; place: 'before' | 'after' }
  | { kind: 'experience'; id: string; place: 'before' | 'after' }
  | { kind: 'group-end'; id: string }
  | null;

function findSidebarDropTarget(
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    const target = node.closest('[data-sidebar-dnd]') as HTMLElement | null;
    if (target) return target;
  }
  return null;
}

function hintFromTarget(
  active: Exclude<ReturnType<typeof getActiveDrag>, null>,
  target: HTMLElement,
  clientY: number,
): SidebarDropHint {
  const kind = target.dataset.sidebarDndKind;
  const id = target.dataset.sidebarDndId;
  if (!kind || !id) return null;

  const unclassified = target.dataset.sidebarDndUnclassified === 'true';

  if (kind === 'group') {
    if (active.type === 'block') return null;
    if (unclassified) {
      return active.type === 'experience' ? { kind: 'group-end', id } : null;
    }
    if (active.type === 'group' && active.id !== id) {
      return {
        kind: 'group',
        id,
        place: placeFromClientY(clientY, target),
      };
    }
    if (active.type === 'experience') {
      return { kind: 'group-end', id };
    }
    return null;
  }

  if (kind === 'experience') {
    if (active.type === 'experience' && active.id !== id) {
      return {
        kind: 'experience',
        id,
        place: placeFromClientY(clientY, target),
      };
    }
    return null;
  }

  return null;
}

export function useSidebarDnd() {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragSize, setDragSize] = useState<DragSize | null>(null);
  const [dropHint, setDropHint] = useState<SidebarDropHint>(null);

  const reorderGroup = useExperienceListStore((s) => s.reorderGroup);
  const reorderExperience = useExperienceListStore((s) => s.reorderExperience);

  const clearDrag = useCallback(() => {
    clearActiveDrag();
    setDraggingId(null);
    setDragSize(null);
    setDropHint(null);
  }, []);

  const handlePointerDragMove = useCallback(
    (clientX: number, clientY: number) => {
      const active = getActiveDrag();
      if (!active || active.type === 'block') {
        setDropHint(null);
        return;
      }
      const target = findSidebarDropTarget(clientX, clientY);
      if (!target) {
        setDropHint(null);
        return;
      }
      setDropHint(hintFromTarget(active, target, clientY));
    },
    [],
  );

  const handlePointerDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      const active = getActiveDrag();
      if (!active || active.type === 'block') {
        clearDrag();
        return;
      }

      const target = findSidebarDropTarget(clientX, clientY);
      const hint = target ? hintFromTarget(active, target, clientY) : null;

      if (active.type === 'group' && hint?.kind === 'group') {
        reorderGroup(active.id, hint.id, hint.place);
      } else if (active.type === 'experience') {
        if (hint?.kind === 'experience') {
          reorderExperience(active.id, {
            kind: 'experience',
            id: hint.id,
            place: hint.place,
          });
        } else if (hint?.kind === 'group-end') {
          reorderExperience(active.id, {
            kind: 'group',
            id: hint.id,
          });
        }
      }

      clearDrag();
    },
    [clearDrag, reorderGroup, reorderExperience],
  );

  return {
    draggingId,
    setDraggingId,
    dragSize,
    setDragSize,
    dropHint,
    setDropHint,
    clearDrag,
    handlePointerDragMove,
    handlePointerDragEnd,
  };
}

export type SidebarDndState = ReturnType<typeof useSidebarDnd>;

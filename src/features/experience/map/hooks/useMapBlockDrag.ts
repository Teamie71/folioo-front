'use client';

import { useRef, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  canDropAt,
  findBlockLocation,
} from '@/features/experience/list/utils/blockTreeUtils';
import { parseMapNodeId } from '@/features/experience/map/model/mapNodeId';
import type { MapLayoutNode } from '@/features/experience/map/utils/mapLayout';

const LONG_PRESS_MS = 350;
/** 이 거리 이상 움직이면 long press를 취소하고 일반 클릭으로 처리한다. */
const MOVE_CANCEL_PX = 6;

export type MapDropPlace = 'before' | 'after' | 'inside';

export type MapDropTarget = {
  id: string;
  place: MapDropPlace;
  rect: DOMRect;
};

export type MapDragGhost = {
  x: number;
  y: number;
  text: string;
};

/**
 * 맵 뷰 블록 드래그 앤 드롭 (5-4).
 *
 * xyflow의 nodesDraggable은 꺼져 있다(레이아웃이 자동 배치이기 때문).
 * 대신 long press로 시작하는 커스텀 포인터 드래그를 구현하고,
 * 실제 이동은 리스트 뷰에서 이미 검증된 스토어 액션
 * (reorderGroup / reorderExperience / moveBlock, 그리고 canDropAt의
 * 위계·깊이 제약)을 그대로 재사용한다.
 *
 * 드롭 대상은 화면 좌표 히트테스트(elementsFromPoint)로 찾는다.
 * 각 맵 노드는 xyflow가 DOM에 `data-id`로 노출하므로,
 * 별도의 좌표 변환 없이 실제 화면 rect를 그대로 인디케이터에 쓸 수 있다.
 */
export function useMapBlockDrag() {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const reorderGroup = useExperienceListStore((s) => s.reorderGroup);
  const reorderExperience = useExperienceListStore((s) => s.reorderExperience);
  const moveBlock = useExperienceListStore((s) => s.moveBlock);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<MapDropTarget | null>(null);
  const [ghost, setGhost] = useState<MapDragGhost | null>(null);

  const dropTargetRef = useRef<MapDropTarget | null>(null);
  const suppressClickRef = useRef(false);

  const isCandidate = (dragged: MapLayoutNode, el: HTMLElement): boolean => {
    const id = el.getAttribute('data-id');
    if (!id || id === dragged.id) return false;
    const parsed = parseMapNodeId(id);
    if (!parsed) return false;

    if (dragged.kind === 'group') return parsed.kind === 'group';
    if (dragged.kind === 'experience') {
      return parsed.kind === 'experience' || parsed.kind === 'group';
    }
    return parsed.kind === 'block' && parsed.experienceId === dragged.experienceId;
  };

  const resolvePlace = (
    dragged: MapLayoutNode,
    targetId: string,
    rect: DOMRect,
    clientY: number,
  ): MapDropPlace | null => {
    const parsed = parseMapNodeId(targetId);
    if (!parsed) return null;

    // 1-2단계: 위계 변경이 없으니 순서만 정한다.
    if (dragged.kind === 'group' || dragged.kind === 'experience') {
      if (dragged.kind === 'experience' && parsed.kind === 'group') {
        return 'inside';
      }
      return clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    }

    // 3-5단계: 대상이 5단계 미만이면 내부(inside)로도 놓을 수 있다.
    if (parsed.kind !== 'block') return null;
    const experience = experiences.find((e) => e.id === dragged.experienceId);
    if (!experience) return null;
    const targetLoc = findBlockLocation(experience.blocks, parsed.blockId);
    if (!targetLoc) return null;

    const allowInside = targetLoc.level < 5;
    const h = Math.max(rect.height, 1);
    const y = clientY - rect.top;
    if (!allowInside) return y < h / 2 ? 'before' : 'after';

    const edge = Math.min(Math.max(6, h * 0.25), h * 0.35);
    if (y < edge) return 'before';
    if (y > h - edge) return 'after';
    return 'inside';
  };

  const isValidDrop = (
    dragged: MapLayoutNode,
    targetId: string,
    place: MapDropPlace,
  ): boolean => {
    const parsed = parseMapNodeId(targetId);
    if (!parsed) return false;

    if (dragged.kind === 'group') {
      if (parsed.kind !== 'group') return false;
      const from = groups.find((g) => g.id === dragged.refId);
      const to = groups.find((g) => g.id === parsed.groupId);
      if (!from || !to || from.id === to.id) return false;
      // 미분류 그룹은 순서 변경 대상도, 이동 대상도 될 수 없다.
      return !from.isUnclassified && !to.isUnclassified;
    }

    if (dragged.kind === 'experience') {
      if (parsed.kind === 'group') return true;
      if (parsed.kind === 'experience') return parsed.experienceId !== dragged.refId;
      return false;
    }

    if (parsed.kind !== 'block' || parsed.experienceId !== dragged.experienceId) {
      return false;
    }
    const experience = experiences.find((e) => e.id === dragged.experienceId);
    if (!experience) return false;
    return canDropAt(experience.blocks, dragged.refId, parsed.blockId, place);
  };

  const updateDropTarget = (
    dragged: MapLayoutNode,
    clientX: number,
    clientY: number,
  ) => {
    const stack = document.elementsFromPoint(clientX, clientY);
    const el = stack.find(
      (candidate): candidate is HTMLElement =>
        candidate instanceof HTMLElement && isCandidate(dragged, candidate),
    );

    if (!el) {
      dropTargetRef.current = null;
      setDropTarget(null);
      return;
    }

    const targetId = el.getAttribute('data-id')!;
    const rect = el.getBoundingClientRect();
    const place = resolvePlace(dragged, targetId, rect, clientY);

    if (!place || !isValidDrop(dragged, targetId, place)) {
      dropTargetRef.current = null;
      setDropTarget(null);
      return;
    }

    const next: MapDropTarget = { id: targetId, place, rect };
    dropTargetRef.current = next;
    setDropTarget(next);
  };

  const commitDrop = (dragged: MapLayoutNode) => {
    const target = dropTargetRef.current;
    if (!target) return;
    const parsed = parseMapNodeId(target.id);
    if (!parsed) return;

    if (dragged.kind === 'group' && parsed.kind === 'group') {
      reorderGroup(
        dragged.refId,
        parsed.groupId,
        target.place as 'before' | 'after',
      );
      return;
    }

    if (dragged.kind === 'experience') {
      if (parsed.kind === 'group') {
        reorderExperience(dragged.refId, { kind: 'group', id: parsed.groupId });
      } else if (parsed.kind === 'experience') {
        reorderExperience(dragged.refId, {
          kind: 'experience',
          id: parsed.experienceId,
          place: target.place as 'before' | 'after',
        });
      }
      return;
    }

    if (dragged.kind === 'block' && parsed.kind === 'block' && dragged.experienceId) {
      moveBlock(dragged.experienceId, dragged.refId, {
        kind: target.place,
        targetId: parsed.blockId,
      });
    }
  };

  const endDrag = () => {
    dropTargetRef.current = null;
    setDraggingId(null);
    setDropTarget(null);
    setGhost(null);
  };

  const activateDrag = (node: MapLayoutNode, point: { x: number; y: number }) => {
    setDraggingId(node.id);
    setGhost({ x: point.x, y: point.y, text: node.text || node.placeholder || '' });

    const onMove = (e: PointerEvent) => {
      setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
      updateDropTarget(node, e.clientX, e.clientY);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      commitDrop(node);
      suppressClickRef.current = true;
      endDrag();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onBlockPressStart = (
    node: MapLayoutNode,
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (event.button !== 0) return;

    const start = { x: event.clientX, y: event.clientY };
    let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      timer = null;
      window.removeEventListener('pointermove', onEarlyMove);
      window.removeEventListener('pointerup', onEarlyUp);
      activateDrag(node, start);
    }, LONG_PRESS_MS);

    const cancelPress = () => {
      if (timer != null) clearTimeout(timer);
      timer = null;
      window.removeEventListener('pointermove', onEarlyMove);
      window.removeEventListener('pointerup', onEarlyUp);
    };

    function onEarlyMove(e: PointerEvent) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) cancelPress();
    }
    function onEarlyUp() {
      cancelPress();
    }

    window.addEventListener('pointermove', onEarlyMove);
    window.addEventListener('pointerup', onEarlyUp);
  };

  /** 드래그가 끝난 직후 뒤따라오는 click을 한 번 무시한다. */
  const consumeSuppressedClick = (): boolean => {
    if (!suppressClickRef.current) return false;
    suppressClickRef.current = false;
    return true;
  };

  return { draggingId, dropTarget, ghost, onBlockPressStart, consumeSuppressedClick };
}

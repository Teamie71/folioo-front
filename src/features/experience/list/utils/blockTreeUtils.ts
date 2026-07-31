import type { Block } from '@/features/experience/list/types';

export function getSubtreeDepth(block: Block): number {
  if (block.children.length === 0) return 0;
  return 1 + Math.max(...block.children.map(getSubtreeDepth));
}

export type BlockLocation = {
  parentId: string | null;
  index: number;
  level: number;
};

export function findBlockLocation(
  blocks: Block[],
  blockId: string,
  parentId: string | null = null,
  level = 3,
): BlockLocation | null {
  const idx = blocks.findIndex((b) => b.id === blockId);
  if (idx !== -1) return { parentId, index: idx, level };
  for (const b of blocks) {
    const found = findBlockLocation(b.children, blockId, b.id, level + 1);
    if (found) return found;
  }
  return null;
}

export function findBlock(blocks: Block[], blockId: string): Block | null {
  for (const b of blocks) {
    if (b.id === blockId) return b;
    const found = findBlock(b.children, blockId);
    if (found) return found;
  }
  return null;
}

export function isDescendant(
  blocks: Block[],
  ancestorId: string,
  blockId: string,
): boolean {
  const ancestor = findBlock(blocks, ancestorId);
  if (!ancestor) return false;
  return findBlock(ancestor.children, blockId) != null;
}

export function extractBlock(
  blocks: Block[],
  blockId: string,
): { blocks: Block[]; extracted: Block | null } {
  const idx = blocks.findIndex((b) => b.id === blockId);
  if (idx !== -1) {
    const extracted = blocks[idx];
    return {
      blocks: [...blocks.slice(0, idx), ...blocks.slice(idx + 1)],
      extracted,
    };
  }
  let extracted: Block | null = null;
  const next = blocks.map((b) => {
    if (extracted) return b;
    const res = extractBlock(b.children, blockId);
    if (res.extracted) {
      extracted = res.extracted;
      return { ...b, children: res.blocks };
    }
    return b;
  });
  return { blocks: next, extracted };
}

export function insertBlockAt(
  blocks: Block[],
  parentId: string | null,
  index: number,
  block: Block,
): Block[] {
  if (parentId == null) {
    const next = [...blocks];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, block);
    return next;
  }
  return blocks.map((b) => {
    if (b.id === parentId) {
      const children = [...b.children];
      children.splice(Math.max(0, Math.min(index, children.length)), 0, block);
      return { ...b, children };
    }
    return {
      ...b,
      children: insertBlockAt(b.children, parentId, index, block),
    };
  });
}

export function canMoveToLevel(block: Block, targetLevel: number): boolean {
  if (targetLevel < 3 || targetLevel > 5) return false;
  return targetLevel + getSubtreeDepth(block) <= 5;
}

export function canDropAt(
  blocks: Block[],
  draggedId: string,
  targetId: string,
  kind: 'before' | 'after' | 'inside',
): boolean {
  if (draggedId === targetId) return false;
  if (isDescendant(blocks, draggedId, targetId)) return false;

  const dragged = findBlock(blocks, draggedId);
  const draggedLoc = findBlockLocation(blocks, draggedId);
  const targetLoc = findBlockLocation(blocks, targetId);
  if (!dragged || !draggedLoc || !targetLoc) return false;

  const targetLevel = kind === 'inside' ? targetLoc.level + 1 : targetLoc.level;

  if (draggedLoc.level === 3) {
    if (kind === 'inside') return false;
    if (targetLoc.level !== 3) return false;
    return canMoveToLevel(dragged, 3);
  }

  if (targetLoc.level === 3 && kind !== 'inside') return false;

  if (kind === 'inside' && targetLoc.level >= 5) return false;

  if (
    kind === 'inside' &&
    targetLoc.level === 4 &&
    dragged.children.length > 0
  ) {
    return false;
  }

  return canMoveToLevel(dragged, targetLevel);
}

export function isMeaningfulDrop(
  blocks: Block[],
  draggedId: string,
  targetId: string,
  kind: 'before' | 'after' | 'inside',
): boolean {
  if (!canDropAt(blocks, draggedId, targetId, kind)) return false;

  const draggedLoc = findBlockLocation(blocks, draggedId);
  const targetLoc = findBlockLocation(blocks, targetId);
  if (!draggedLoc || !targetLoc) return false;

  if (kind === 'inside') {
    if (draggedLoc.parentId !== targetId) return true;
    const parent = findBlock(blocks, targetId);
    const lastIndex = (parent?.children.length ?? 0) - 1;
    return draggedLoc.index !== lastIndex;
  }

  if (draggedLoc.parentId !== targetLoc.parentId) return true;

  if (kind === 'before') {
    return draggedLoc.index !== targetLoc.index - 1;
  }

  return draggedLoc.index !== targetLoc.index + 1;
}

export type DropPosition =
  | { kind: 'before'; targetId: string }
  | { kind: 'after'; targetId: string }
  | { kind: 'inside'; targetId: string };

export function applyBlockMove(
  blocks: Block[],
  draggedId: string,
  drop: DropPosition,
): Block[] | null {
  if (!canDropAt(blocks, draggedId, drop.targetId, drop.kind)) return null;

  const dragged = findBlock(blocks, draggedId);
  if (!dragged) return null;

  const targetLoc = findBlockLocation(blocks, drop.targetId);
  if (!targetLoc) return null;

  let parentId: string | null;
  let index: number;

  if (drop.kind === 'inside') {
    parentId = drop.targetId;
    const target = findBlock(blocks, drop.targetId);
    index = target?.children.length ?? 0;
  } else {
    parentId = targetLoc.parentId;
    index = drop.kind === 'before' ? targetLoc.index : targetLoc.index + 1;
  }

  const { blocks: without, extracted } = extractBlock(blocks, draggedId);
  if (!extracted) return null;

  let adjustedIndex = index;
  if (drop.kind !== 'inside' && parentId === targetLoc.parentId) {
    const oldLoc = findBlockLocation(blocks, draggedId);
    if (oldLoc && oldLoc.parentId === parentId && oldLoc.index < index) {
      adjustedIndex = index - 1;
    }
  }

  return insertBlockAt(without, parentId, adjustedIndex, extracted);
}

function siblingsOf(blocks: Block[], parentId: string | null): Block[] {
  if (parentId == null) return blocks;
  return findBlock(blocks, parentId)?.children ?? [];
}

export function indentBlock(blocks: Block[], blockId: string): Block[] | null {
  const loc = findBlockLocation(blocks, blockId);
  if (!loc || loc.index === 0) return null;
  const prev = siblingsOf(blocks, loc.parentId)[loc.index - 1];
  if (!prev) return null;
  return applyBlockMove(blocks, blockId, {
    kind: 'inside',
    targetId: prev.id,
  });
}

export function outdentBlock(blocks: Block[], blockId: string): Block[] | null {
  const loc = findBlockLocation(blocks, blockId);
  if (!loc || loc.parentId == null) return null;
  return applyBlockMove(blocks, blockId, {
    kind: 'after',
    targetId: loc.parentId,
  });
}

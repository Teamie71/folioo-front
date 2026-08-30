import type {
  Block,
  Experience,
  Group,
} from '@/features/experience/list/types';
import {
  blockNodeId,
  experienceNodeId,
  groupNodeId,
} from '@/features/experience/map/model/mapNodeId';

function blockSubtreeIds(experienceId: string, block: Block): string[] {
  return [
    blockNodeId(experienceId, block.id),
    ...block.children.flatMap((child) => blockSubtreeIds(experienceId, child)),
  ];
}

function findBlockById(blocks: Block[], blockId: string): Block | null {
  for (const block of blocks) {
    if (block.id === blockId) return block;
    const found = findBlockById(block.children, blockId);
    if (found) return found;
  }
  return null;
}

/**
 * 선택 삭제 모드에서 블록 하나를 눌렀을 때 함께 전환되는 노드 id 목록.
 *
 * - 미분류 그룹은 전환되지 않는다. (빈 배열)
 * - 1단계 그룹은 하위를 함께 전환하지 않고 자기 자신만 전환한다.
 * - 그 외에는 하위의 모든 블록이 함께 전환된다.
 */
export function collectSelectionIds(
  groups: Group[],
  experiences: Experience[],
  nodeId: string,
): string[] {
  for (const group of groups) {
    if (groupNodeId(group.id) !== nodeId) continue;
    return group.isUnclassified ? [] : [nodeId];
  }

  for (const experience of experiences) {
    if (experienceNodeId(experience.id) === nodeId) {
      return [
        nodeId,
        ...experience.blocks.flatMap((block) =>
          blockSubtreeIds(experience.id, block),
        ),
      ];
    }

    const [prefix, experienceId, blockId] = nodeId.split(':');
    if (prefix !== 'b' || experienceId !== experience.id || !blockId) continue;

    const block = findBlockById(experience.blocks, blockId);
    if (block) return blockSubtreeIds(experience.id, block);
  }

  return [];
}

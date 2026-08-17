import type { Experience, Group } from '@/features/experience/list/types';

/**
 * 맵 뷰가 위 → 아래로 그리는 순서와 동일한 활동 id 목록.
 * 그룹은 groups 배열 순서, 그룹 내 활동은 experiences 배열의 상대 순서를 따른다
 * (buildMapLayout의 buildTree와 동일한 순회 규칙).
 */
export function getOrderedExperienceIds(
  groups: Group[],
  experiences: Experience[],
): string[] {
  return groups.flatMap((group) =>
    experiences.filter((e) => e.groupId === group.id).map((e) => e.id),
  );
}

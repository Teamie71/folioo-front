import type { BlockResDTO, ExperienceMapResDTO } from '@/api/models';
import { BlockResDTOKind } from '@/api/models';
import { SECTION_TITLE } from '@/features/experience/list/constants';
import type {
  Block,
  Experience,
  Group,
  SectionKind,
} from '@/features/experience/list/types';
import {
  SECTION_KIND_BY_DTO,
  isFixedSectionDtoKind,
} from '@/features/experience/list/api/experienceMapKinds';

export type ListStateFromServer = {
  mapVersion: string;
  groups: Group[];
  experiences: Experience[];
};

function byPosition(a: BlockResDTO, b: BlockResDTO): number {
  return a.position - b.position;
}

function sortedChildren(node: BlockResDTO): BlockResDTO[] {
  return [...(node.children ?? [])].sort(byPosition);
}

/**
 * 4단계 블록의 SectionKind는 상위 섹션에서 물려받는다.
 *
 * 서버는 4~5단계를 모두 CONTENT로 내려주지만, 클라이언트는 '담당업무'·'문제해결'
 * 하위인지에 따라 블록 추가 드롭다운(담당업무/문제해결 템플릿)을 분기하므로
 * 그 정보를 kind에 담아 둔다. (factories의 생성 규칙과 동일하게 맞춘 값이다)
 */
function childKindOf(sectionKind: SectionKind, level: number): SectionKind {
  if (level !== 4) return 'free';
  return sectionKind === 'duty' || sectionKind === 'problem'
    ? sectionKind
    : 'free';
}

function toBlock(
  node: BlockResDTO,
  level: number,
  sectionKind: SectionKind,
): Block {
  const isFixedSection = level === 3 && isFixedSectionDtoKind(node.kind);
  const kind: SectionKind =
    level === 3 ? sectionKind : childKindOf(sectionKind, level);
  const text = isFixedSection
    ? (node.content ?? SECTION_TITLE[sectionKind])
    : (node.content ?? '');

  return {
    id: node.id,
    kind,
    text,
    editable: !isFixedSection,
    ...(node.placeholder ? { placeholder: node.placeholder } : {}),
    children: sortedChildren(node).map((child) =>
      toBlock(child, level + 1, sectionKind),
    ),
  };
}

function toExperience(node: BlockResDTO, groupId: string): Experience {
  return {
    id: node.id,
    groupId,
    name: node.content ?? '',
    blocks: sortedChildren(node).map((child) =>
      toBlock(child, 3, SECTION_KIND_BY_DTO[child.kind] ?? 'free'),
    ),
  };
}

/**
 * 서버 블록 트리를 화면이 쓰는 그룹/활동/블록 모델로 옮긴다.
 *
 * 형제 순서는 서버의 position을 그대로 따른다. 화면의 배열 인덱스가 곧 서버 position이어야
 * 순서 변경(PATCH .../position)을 추가 보정 없이 그대로 보낼 수 있기 때문이다.
 */
export function toListState(dto: ExperienceMapResDTO): ListStateFromServer {
  const roots = [...(dto.roots ?? [])].sort(byPosition);

  const groups: Group[] = roots.map((root) => ({
    id: root.id,
    name: root.content ?? '',
    isUnclassified: root.kind === BlockResDTOKind.GROUP_UNCATEGORIZED,
  }));

  // 활동은 그룹 순서를 따라 이어 붙인다. (사이드바가 groups 순서로 그룹핑한다)
  const experiences: Experience[] = roots.flatMap((root) =>
    sortedChildren(root)
      .filter((child) => child.kind === BlockResDTOKind.EXPERIENCE)
      .map((child) => toExperience(child, root.id)),
  );

  return { mapVersion: dto.mapVersion, groups, experiences };
}

/**
 * '새로운 그룹 {N}' · '새로운 활동 {N}'의 다음 번호를 서버 데이터에서 복원한다.
 *
 * 카운터는 삭제와 무관하게 계속 증가해야 하는데(화면설계서) 서버에 저장되지 않으므로,
 * 페이지 진입 시 현재 이름들에서 가장 큰 번호를 찾아 이어 쓴다.
 */
export function deriveCounter(names: string[], prefix: string): number {
  const pattern = new RegExp(`^${prefix} (\\d+)$`);
  return names.reduce((max, name) => {
    const matched = pattern.exec(name.trim());
    if (!matched) return max;
    return Math.max(max, Number(matched[1]));
  }, 0);
}

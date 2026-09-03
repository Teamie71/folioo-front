import type { BlockResDTO, ExperienceMapResDTO } from '@/api/models';
import { BlockResDTOKind } from '@/api/models';
import {
  DEFAULT_BLOCK_PLACEHOLDER,
  DUTY_EPISODE_PLACEHOLDER,
  PROBLEM_EPISODE_PLACEHOLDER,
  SECTION_TITLE,
  UNCLASSIFIED_NAME,
} from '@/features/experience/list/constants';
import { defaultSubTemplatePlaceholderAt } from '@/features/experience/list/factories';
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

/**
 * 담당업무·문제해결 아래의 4단계는 생성 방식(템플릿/자유 블록)과 관계없이 섹션 전용
 * placeholder를 사용한다. 상세정보·주요성과·배운 점은 서버 값을 그대로 사용해야
 * 최초 기본 세트의 전용 문구와 이후 추가 블록의 일반 문구를 구분할 수 있다.
 */
function placeholderOf(
  node: BlockResDTO,
  level: number,
  sectionKind: SectionKind,
  siblingIndex: number,
  parentSiblingIndex: number,
  siblingCount: number,
): string | undefined {
  if (level === 4) {
    if (sectionKind === 'duty') return DUTY_EPISODE_PLACEHOLDER;
    if (sectionKind === 'problem') return PROBLEM_EPISODE_PLACEHOLDER;
    return node.placeholder ?? undefined;
  }

  if (
    level === 5 &&
    (sectionKind === 'duty' || sectionKind === 'problem') &&
    (!node.placeholder || node.placeholder === DEFAULT_BLOCK_PLACEHOLDER)
  ) {
    // 담당업무 기본 블록은 하나의 4단계 아래에 네 슬롯이 붙는다.
    if (sectionKind === 'duty') {
      return defaultSubTemplatePlaceholderAt('duty', siblingIndex);
    }

    // 문제해결 기본 블록은 네 개의 4단계마다 하나씩 슬롯이 붙는다.
    // 한 4단계 아래에 여러 슬롯이 있으면 선택한 기본 하위 템플릿의 순서를 따른다.
    const templateIndex =
      siblingCount === 1 ? parentSiblingIndex : siblingIndex;
    return defaultSubTemplatePlaceholderAt('problem', templateIndex);
  }

  return node.placeholder ?? undefined;
}

function toBlock(
  node: BlockResDTO,
  level: number,
  sectionKind: SectionKind,
  siblingIndex: number,
  parentSiblingIndex = 0,
  siblingCount = 1,
): Block {
  const isFixedSection = level === 3 && isFixedSectionDtoKind(node.kind);
  const kind: SectionKind =
    level === 3 ? sectionKind : childKindOf(sectionKind, level);
  const text = isFixedSection
    ? (node.content ?? SECTION_TITLE[sectionKind])
    : (node.content ?? '');
  const editable = level === 3 ? sectionKind === 'free' : true;
  const placeholder = placeholderOf(
    node,
    level,
    sectionKind,
    siblingIndex,
    parentSiblingIndex,
    siblingCount,
  );
  const children = sortedChildren(node);

  return {
    id: node.id,
    kind,
    text,
    editable,
    ...(placeholder ? { placeholder } : {}),
    children: children.map((child, index) =>
      toBlock(
        child,
        level + 1,
        sectionKind,
        index,
        siblingIndex,
        children.length,
      ),
    ),
  };
}

function toExperience(node: BlockResDTO, groupId: string): Experience {
  return {
    id: node.id,
    groupId,
    name: node.content ?? '',
    blocks: sortedChildren(node).map((child, index) =>
      toBlock(child, 3, SECTION_KIND_BY_DTO[child.kind] ?? 'free', index),
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

  const groups: Group[] = roots.map((root) => {
    const isUnclassified = root.kind === BlockResDTOKind.GROUP_UNCATEGORIZED;
    return {
      id: root.id,
      // 미분류는 서버가 content를 null로 내려준다. 라벨은 클라이언트가 채운다.
      name: root.content ?? (isUnclassified ? UNCLASSIFIED_NAME : ''),
      isUnclassified,
    };
  });

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

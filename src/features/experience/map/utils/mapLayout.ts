import {
  ACTIVITY_AREA_PADDING,
  ACTIVITY_AREA_PADDING_TOP,
  COLUMN_GAP,
  COLUMN_GAP_GROUP_TO_EXPERIENCE,
  MIN_CONTENT_WIDTH,
  MIN_CONTENT_WIDTH_LEAF,
  ROW_GAP,
  SECTION_GAP,
  SUBTREE_GAP,
  SUBTREE_GAP_WITH_AREA,
} from '@/features/experience/map/constants';
import {
  DEFAULT_BLOCK_PLACEHOLDER,
  EXPERIENCE_NAME_PLACEHOLDER,
  GROUP_NAME_PLACEHOLDER,
} from '@/features/experience/list/constants';
import type {
  Block,
  Experience,
  Group,
} from '@/features/experience/list/types';
import { measureBlockBox } from '@/features/experience/map/utils/measureBlockBox';
import {
  blockNodeId,
  experienceNodeId,
  groupNodeId,
} from '@/features/experience/map/model/mapNodeId';

export type MapLevel = 1 | 2 | 3 | 4 | 5;

export type MapLayoutNode = {
  /** xyflow 노드 id. 종류별 prefix로 충돌을 막는다. */
  id: string;
  kind: 'group' | 'experience' | 'block';
  level: MapLevel;
  /** 도메인 id (group.id / experience.id / block.id) */
  refId: string;
  groupId: string;
  experienceId: string | null;
  parentId: string | null;
  /** 템플릿 드롭다운 분기에 쓰는 상위 블록 종류 */
  parentKind: Block['kind'] | null;
  block: Block | null;
  text: string;
  placeholder: string | null;
  editable: boolean;
  deletable: boolean;
  hasChildren: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapLayoutArea = {
  id: string;
  experienceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapLayoutEdge = {
  id: string;
  source: string;
  target: string;
  /** 문제해결 계열 블록에서 뻗는 연결선은 직각으로 꺾인 선을 쓴다. */
  orthogonal: boolean;
  /** 직각 연결선의 형제 가지가 공유하는 세로 트렁크 x 좌표 */
  branchX: number | null;
};

export type MapLayout = {
  nodes: MapLayoutNode[];
  edges: MapLayoutEdge[];
  areas: MapLayoutArea[];
};

/** 레이아웃 계산용 중간 트리 */
type LayoutItem = {
  node: MapLayoutNode;
  children: LayoutItem[];
};

function siblingGap(level: MapLevel, maxLevel: MapLevel): number {
  // 1-2단계는 활동 배경 영역이 붙지 않도록 넓게, 3단계는 묶음 간격, 4-5단계는 행 간격.
  if (level <= 2) {
    return maxLevel >= 5 ? SUBTREE_GAP_WITH_AREA : SUBTREE_GAP;
  }
  if (level === 3) return SECTION_GAP;
  return ROW_GAP;
}

function measureFor(
  level: MapLevel,
  text: string,
): {
  width: number;
  height: number;
} {
  return measureBlockBox(text, {
    isSection: level === 3,
    minWidth: level >= 4 ? MIN_CONTENT_WIDTH_LEAF : MIN_CONTENT_WIDTH,
  });
}

function buildBlockItem(
  block: Block,
  level: MapLevel,
  groupId: string,
  experienceId: string,
  parentId: string,
  parentKind: Block['kind'] | null,
  maxLevel: MapLevel,
): LayoutItem {
  const placeholder = block.placeholder ?? DEFAULT_BLOCK_PLACEHOLDER;
  const size = measureFor(level, block.text || placeholder);

  const children =
    level < maxLevel
      ? block.children.map((child) =>
          buildBlockItem(
            child,
            (level + 1) as MapLevel,
            groupId,
            experienceId,
            blockNodeId(experienceId, block.id),
            // 담당업무 · 문제해결 계열은 하위까지 종류를 물려준다.
            parentKind === 'duty' || parentKind === 'problem'
              ? parentKind
              : block.kind,
            maxLevel,
          ),
        )
      : [];

  return {
    node: {
      id: blockNodeId(experienceId, block.id),
      kind: 'block',
      level,
      refId: block.id,
      groupId,
      experienceId,
      parentId,
      parentKind,
      block,
      text: block.text,
      placeholder,
      editable: block.editable,
      deletable: true,
      hasChildren: block.children.length > 0,
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
    },
    children,
  };
}

function buildTree(
  groups: Group[],
  experiences: Experience[],
  maxLevel: MapLevel,
): LayoutItem[] {
  return groups.map((group) => {
    const groupSize = measureFor(1, group.name);
    const groupNode = groupNodeId(group.id);

    const groupExperiences =
      maxLevel >= 2 ? experiences.filter((e) => e.groupId === group.id) : [];

    const children = groupExperiences.map((experience) => {
      const experienceSize = measureFor(2, experience.name);
      const experienceNode = experienceNodeId(experience.id);

      const blockChildren =
        maxLevel >= 3
          ? experience.blocks.map((block) =>
              buildBlockItem(
                block,
                3,
                group.id,
                experience.id,
                experienceNode,
                null,
                maxLevel,
              ),
            )
          : [];

      return {
        node: {
          id: experienceNode,
          kind: 'experience' as const,
          level: 2 as MapLevel,
          refId: experience.id,
          groupId: group.id,
          experienceId: experience.id,
          parentId: groupNode,
          parentKind: null,
          block: null,
          text: experience.name,
          placeholder: EXPERIENCE_NAME_PLACEHOLDER,
          editable: true,
          deletable: true,
          hasChildren: experience.blocks.length > 0,
          x: 0,
          y: 0,
          width: experienceSize.width,
          height: experienceSize.height,
        },
        children: blockChildren,
      };
    });

    return {
      node: {
        id: groupNode,
        kind: 'group' as const,
        level: 1 as MapLevel,
        refId: group.id,
        groupId: group.id,
        experienceId: null,
        parentId: null,
        parentKind: null,
        block: null,
        text: group.name,
        placeholder: GROUP_NAME_PLACEHOLDER,
        // 미분류 그룹은 텍스트 수정 · 삭제 모두 불가
        editable: !group.isUnclassified,
        deletable: !group.isUnclassified,
        hasChildren: groupExperiences.length > 0,
        x: 0,
        y: 0,
        width: groupSize.width,
        height: groupSize.height,
      },
      children,
    };
  });
}

/** 단계별 좌정렬: 같은 단계의 모든 블록은 같은 x를 쓴다. */
function assignColumns(roots: LayoutItem[]) {
  const columnWidth = new Map<MapLevel, number>();

  const walk = (item: LayoutItem) => {
    const { level, width } = item.node;
    columnWidth.set(level, Math.max(columnWidth.get(level) ?? 0, width));
    item.children.forEach(walk);
  };
  roots.forEach(walk);

  const columnX = new Map<MapLevel, number>();
  let x = 0;
  for (let level = 1 as MapLevel; level <= 5; level = (level + 1) as MapLevel) {
    columnX.set(level, x);
    const width = columnWidth.get(level);
    if (width == null) continue;
    x += width + (level === 1 ? COLUMN_GAP_GROUP_TO_EXPERIENCE : COLUMN_GAP);
  }

  const apply = (item: LayoutItem) => {
    item.node.x = columnX.get(item.node.level) ?? 0;
    item.children.forEach(apply);
  };
  roots.forEach(apply);
}

/**
 * 세로 배치.
 * 리프는 순서대로 쌓고, 부모는 자식 묶음의 수직 중앙에 놓는다(연결선 중심 to 중심).
 */
function assignRows(roots: LayoutItem[], maxLevel: MapLevel) {
  let cursorY = 0;

  /**
   * 문제해결은 Figma 설계처럼 부모와 첫 번째 자식의 중심을 맞추고,
   * 나머지 자식만 공용 세로 트렁크 아래로 쌓는다.
   */
  const alignsWithFirstChild = (item: LayoutItem) =>
    item.node.kind === 'block' &&
    ((item.node.level === 3 && item.node.block?.kind === 'problem') ||
      (item.node.level === 4 && item.node.parentKind === 'problem'));

  const place = (item: LayoutItem): { top: number; bottom: number } => {
    if (item.children.length === 0) {
      const top = cursorY;
      item.node.y = top;
      cursorY = top + item.node.height;
      return { top, bottom: cursorY };
    }

    const gap = siblingGap((item.node.level + 1) as MapLevel, maxLevel);
    let first: { top: number; bottom: number } | null = null;
    let last: { top: number; bottom: number } | null = null;

    item.children.forEach((child, index) => {
      if (index > 0) cursorY += gap;
      const span = place(child);
      if (index === 0) first = span;
      last = span;
    });

    const childrenTop = first!.top;
    const childrenBottom = last!.bottom;
    const firstChild = item.children[0];
    item.node.y = alignsWithFirstChild(item)
      ? firstChild.node.y + firstChild.node.height / 2 - item.node.height / 2
      : (childrenTop + childrenBottom) / 2 - item.node.height / 2;

    return {
      top: Math.min(item.node.y, childrenTop),
      bottom: Math.max(item.node.y + item.node.height, childrenBottom),
    };
  };

  roots.forEach((root, index) => {
    if (index > 0) cursorY += siblingGap(1, maxLevel);
    place(root);
  });
}

function collect(roots: LayoutItem[]): {
  nodes: MapLayoutNode[];
  edges: MapLayoutEdge[];
} {
  const nodes: MapLayoutNode[] = [];
  const edges: MapLayoutEdge[] = [];

  const walk = (item: LayoutItem) => {
    nodes.push(item.node);
    for (const child of item.children) {
      const isProblemFanout =
        item.node.level === 4 && item.node.parentKind === 'problem';
      const sourceRight = item.node.x + item.node.width;
      // 중심 핸들을 쓰더라도 보이는 분기점은 두 카드 사이 여백의 중앙에 고정한다.
      // 자식 카드 폭과 무관하게 같은 부모의 모든 형제가 같은 x를 공유한다.
      const branchX = isProblemFanout
        ? sourceRight + (child.node.x - sourceRight) / 2
        : null;

      edges.push({
        id: `${item.node.id}->${child.node.id}`,
        source: item.node.id,
        target: child.node.id,
        // 문제해결 에피소드(4단계)에서 질문들(5단계)로 팬아웃하는 엣지만 직각으로 그린다.
        // 3→4단계(카테고리→에피소드) 엣지까지 포함하면 두 트렁크 선이 겹쳐 꼬여 보인다.
        orthogonal: isProblemFanout,
        branchX,
      });
      walk(child);
    }
  };
  roots.forEach(walk);

  return { nodes, edges };
}

/** 활동 서브트리 전체를 감싸는 배경 영역(#F6F5FF66)을 만든다. */
function collectAreas(roots: LayoutItem[]): MapLayoutArea[] {
  const areas: MapLayoutArea[] = [];

  const bounds = (item: LayoutItem) => {
    let minX = item.node.x;
    let minY = item.node.y;
    let maxX = item.node.x + item.node.width;
    let maxY = item.node.y + item.node.height;

    for (const child of item.children) {
      const childBounds = bounds(child);
      minX = Math.min(minX, childBounds.minX);
      minY = Math.min(minY, childBounds.minY);
      maxX = Math.max(maxX, childBounds.maxX);
      maxY = Math.max(maxY, childBounds.maxY);
    }
    return { minX, minY, maxX, maxY };
  };

  for (const group of roots) {
    for (const experience of group.children) {
      const { minX, minY, maxX, maxY } = bounds(experience);
      areas.push({
        id: `area:${experience.node.refId}`,
        experienceId: experience.node.refId,
        x: minX - ACTIVITY_AREA_PADDING,
        y: minY - ACTIVITY_AREA_PADDING_TOP,
        width: maxX - minX + ACTIVITY_AREA_PADDING * 2,
        height: maxY - minY + ACTIVITY_AREA_PADDING_TOP + ACTIVITY_AREA_PADDING,
      });
    }
  }

  return areas;
}

/**
 * 그룹 · 활동 · 블록 트리를 맵 뷰 좌표로 변환한다.
 * maxLevel은 확대 수준에 따른 표시 단계(최소화 2, 중간 3, 표준 5)다.
 */
export function buildMapLayout(
  groups: Group[],
  experiences: Experience[],
  maxLevel: MapLevel,
): MapLayout {
  const roots = buildTree(groups, experiences, maxLevel);
  assignColumns(roots);
  assignRows(roots, maxLevel);

  const { nodes, edges } = collect(roots);
  return { nodes, edges, areas: collectAreas(roots) };
}

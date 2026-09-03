import { create } from 'zustand/react';
import { devtools } from 'zustand/middleware';
import {
  MAX_EXPERIENCE_COUNT,
  MAX_GROUP_COUNT,
} from '@/features/experience/list/constants';
import { uid } from '@/features/experience/list/factories';
import type {
  Block,
  Experience,
  Group,
} from '@/features/experience/list/types';
import {
  deriveCounter,
  type ListStateFromServer,
} from '@/features/experience/list/api/experienceMapMapper';
import {
  configureExperienceMapSync,
  resolveSyncedId,
  syncCreateBlocks,
  syncCreateExperience,
  syncCreateGroup,
  syncDeleteBlocks,
  syncMoveBlock,
  syncUpdateContent,
} from '@/features/experience/list/api/experienceMapSync';
import {
  applyBlockMove,
  findBlockLocation,
  type DropPosition,
} from '@/features/experience/list/utils/blockTreeUtils';
import { parseMapNodeId } from '@/features/experience/map/model/mapNodeId';

function createInitialListState() {
  return {
    groups: [] as Group[],
    experiences: [] as Experience[],
    groupCounter: 0,
    experienceCounter: 0,
    selection: null as Selection,
    mapVersion: null as string | null,
    syncError: null as unknown,
    sidebarOpen: true,
    agentOpen: true,
    collapsedGroups: {} as Record<string, boolean>,
    modal: null as ModalState,
    // 서버에서 맵을 받아오기 전까지는 스켈레톤을 보여준다.
    isContentLoading: true,
    blockSelectionMode: false,
    selectedBlockIds: {} as Record<string, true>,
    past: [] as Snapshot[],
    future: [] as Snapshot[],
  };
}

/** 미분류 그룹은 서버가 자동 생성하므로 id를 고정할 수 없다. 매번 찾아 쓴다. */
function unclassifiedGroupId(groups: Group[]): string | undefined {
  return groups.find((g) => g.isUnclassified)?.id;
}

/** 활동의 서버 position = 같은 그룹 안에서의 순서 */
function experienceIndexInGroup(
  experiences: Experience[],
  experienceId: string,
  groupId: string,
): number {
  return experiences
    .filter((e) => e.groupId === groupId)
    .findIndex((e) => e.id === experienceId);
}

/**
 * 낙관적으로 갱신한 블록 트리에서 블록의 (부모 id, 순서)를 뽑는다.
 * 3단계 블록의 부모는 서버 기준으로 활동 블록이다.
 */
function serverPositionOf(
  blocks: Block[],
  blockId: string,
  experienceId: string,
): { parentId: string; position: number } | null {
  const location = findBlockLocation(blocks, blockId);
  if (!location) return null;
  return {
    parentId: location.parentId ?? experienceId,
    position: location.index,
  };
}

function insertSiblingsAfter(
  blocks: Block[],
  targetId: string,
  newBlocks: Block[],
): Block[] {
  const idx = blocks.findIndex((b) => b.id === targetId);
  if (idx !== -1) {
    const next = [...blocks];
    next.splice(idx + 1, 0, ...newBlocks);
    return next;
  }
  return blocks.map((b) => ({
    ...b,
    children: insertSiblingsAfter(b.children, targetId, newBlocks),
  }));
}

function insertSiblingAfter(
  blocks: Block[],
  targetId: string,
  newBlock: Block,
): Block[] {
  return insertSiblingsAfter(blocks, targetId, [newBlock]);
}

function removeBlockFromTree(blocks: Block[], targetId: string): Block[] {
  return blocks
    .filter((b) => b.id !== targetId)
    .map((b) => ({
      ...b,
      children: removeBlockFromTree(b.children, targetId),
    }));
}

function removeBlocksFromTree(
  blocks: Block[],
  targetIds: Set<string>,
): Block[] {
  return blocks
    .filter((b) => !targetIds.has(b.id))
    .map((b) => ({
      ...b,
      children: removeBlocksFromTree(b.children, targetIds),
    }));
}

function setBlockTextInTree(
  blocks: Block[],
  targetId: string,
  text: string,
): Block[] {
  return blocks.map((b) =>
    b.id === targetId
      ? { ...b, text }
      : { ...b, children: setBlockTextInTree(b.children, targetId, text) },
  );
}

function appendChildrenInTree(
  blocks: Block[],
  parentId: string,
  children: Block[],
): Block[] {
  return blocks.map((b) =>
    b.id === parentId
      ? { ...b, children: [...b.children, ...children] }
      : {
          ...b,
          children: appendChildrenInTree(b.children, parentId, children),
        },
  );
}

type Selection =
  | { kind: 'experience'; id: string }
  | { kind: 'group'; id: string }
  | null;

type ModalState =
  | { type: 'group-delete'; groupId: string }
  | { type: 'experience-delete'; experienceId: string }
  | { type: 'group-limit' }
  | { type: 'experience-limit' }
  /** 선택 삭제 확인 (3-5) */
  | { type: 'selection-delete' }
  /** 그룹을 포함한 선택 삭제 확인 (3-6) */
  | { type: 'selection-delete-with-group' }
  | null;

interface Snapshot {
  groups: Group[];
  experiences: Experience[];
  groupCounter: number;
  experienceCounter: number;
  selection: Selection;
}

interface ExperienceListState {
  groups: Group[];
  experiences: Experience[];
  groupCounter: number;
  experienceCounter: number;
  selection: Selection;

  /** 서버 낙관적 잠금 버전. 쓰기 동기화 계층이 관리한다. */
  mapVersion: string | null;
  /** 마지막 동기화 실패. 실패 후에는 서버 상태로 되돌린다. */
  syncError: unknown;

  sidebarOpen: boolean;
  agentOpen: boolean;
  collapsedGroups: Record<string, boolean>;
  modal: ModalState;
  isContentLoading: boolean;

  /** 맵 뷰 '블록 선택 삭제' 모드 (3) */
  blockSelectionMode: boolean;
  /** 선택된 맵 노드 id 집합. 키 규칙은 map/model/mapNodeId를 따른다. */
  selectedBlockIds: Record<string, true>;

  past: Snapshot[];
  future: Snapshot[];

  /** GET /experience-map 결과를 반영한다. (선택/펼침 등 화면 상태는 유지) */
  hydrateFromServer: (snapshot: ListStateFromServer) => void;
  setSyncError: (error: unknown) => void;

  toggleSidebar: () => void;
  toggleAgent: () => void;
  setContentLoading: (loading: boolean) => void;
  toggleGroupCollapsed: (groupId: string) => void;
  openModal: (modal: NonNullable<ModalState>) => void;
  closeModal: () => void;

  selectExperience: (id: string) => void;
  selectGroup: (groupId: string) => void;

  renameGroup: (id: string, name: string) => void;
  addGroup: (afterGroupId?: string) => void;
  deleteGroup: (id: string) => void;
  reorderGroup: (
    fromId: string,
    toId: string,
    place: 'before' | 'after',
  ) => void;

  renameExperience: (id: string, name: string) => void;
  addExperience: (groupId?: string, afterExperienceId?: string) => void;
  deleteExperience: (id: string) => void;
  moveExperienceToGroup: (experienceId: string, groupId: string) => void;
  reorderExperience: (
    experienceId: string,
    target:
      | { kind: 'experience'; id: string; place: 'before' | 'after' }
      | { kind: 'group'; id: string },
  ) => void;

  updateBlockText: (
    experienceId: string,
    blockId: string,
    text: string,
  ) => void;
  splitBlockAt: (
    experienceId: string,
    blockId: string,
    leftText: string,
    sibling: Block,
  ) => void;
  addSiblingBlock: (
    experienceId: string,
    targetBlockId: string,
    newBlock: Block,
  ) => void;
  addSiblingBlocks: (
    experienceId: string,
    targetBlockId: string,
    newBlocks: Block[],
  ) => void;
  addSectionToExperience: (experienceId: string, block: Block) => void;
  addChildBlock: (
    experienceId: string,
    parentBlockId: string,
    child: Block,
  ) => void;
  addChildrenBlocks: (
    experienceId: string,
    parentBlockId: string,
    children: Block[],
  ) => void;
  deleteBlock: (experienceId: string, blockId: string) => void;
  moveBlock: (
    experienceId: string,
    draggedId: string,
    drop: DropPosition,
  ) => void;

  startBlockSelection: () => void;
  cancelBlockSelection: () => void;
  setBlockSelection: (nodeIds: string[], selected: boolean) => void;
  deleteSelectedBlocks: () => void;

  undo: () => void;
  redo: () => void;
}

function snapshotOf(s: ExperienceListState): Snapshot {
  return {
    groups: s.groups,
    experiences: s.experiences,
    groupCounter: s.groupCounter,
    experienceCounter: s.experienceCounter,
    selection: s.selection,
  };
}

type MutablePart = Partial<
  Pick<
    ExperienceListState,
    | 'groups'
    | 'experiences'
    | 'groupCounter'
    | 'experienceCounter'
    | 'selection'
  >
>;

export const useExperienceListStore = create<ExperienceListState>()(
  devtools(
    (set, get) => {
      const commit = (changes: MutablePart) =>
        set((s) => ({
          ...changes,
          past: [...s.past, snapshotOf(s)],
          future: [],
        }));

      return {
        ...createInitialListState(),

        hydrateFromServer: (snapshot) =>
          set((s) => {
            /*
             * 방금 만든 항목은 아직 임시 id를 들고 있을 수 있다.
             * 서버 id로 바꿔서 선택 상태를 잃지 않게 한다.
             */
            const selection: Selection = s.selection
              ? { ...s.selection, id: resolveSyncedId(s.selection.id) }
              : null;
            /*
             * 그룹 순서는 화면에서 편집한 로컬 순서를 유지한다.
             * (서버 position을 그대로 따르면 새 그룹을 만들 때마다 목록이 재정렬돼 보인다)
             * 이미 있던 그룹은 기존 순서대로 두고, 서버에만 있는 새 그룹은 뒤에 붙이며,
             * '미분류'는 언제나 가장 아래에 둔다.
             */
            const prevOrder = new Map(s.groups.map((g, i) => [g.id, i]));
            const orderedGroups = [...snapshot.groups].sort((a, b) => {
              if (a.isUnclassified !== b.isUnclassified) {
                return a.isUnclassified ? 1 : -1;
              }
              const ai = prevOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER;
              const bi = prevOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER;
              return ai - bi;
            });

            const selectionAlive =
              selection?.kind === 'experience'
                ? snapshot.experiences.some((e) => e.id === selection.id)
                : selection?.kind === 'group'
                  ? snapshot.groups.some((g) => g.id === selection.id)
                  : false;

            return {
              groups: orderedGroups,
              experiences: snapshot.experiences,
              mapVersion: snapshot.mapVersion,
              isContentLoading: false,
              // 이름 카운터는 서버에 저장되지 않으므로 현재 이름에서 이어 받는다.
              groupCounter: Math.max(
                s.groupCounter,
                deriveCounter(
                  snapshot.groups.map((g) => g.name),
                  '새로운 그룹',
                ),
              ),
              experienceCounter: Math.max(
                s.experienceCounter,
                deriveCounter(
                  snapshot.experiences.map((e) => e.name),
                  '새로운 활동',
                ),
              ),
              /*
               * 활동이 하나도 없으면 첫 그룹을 고른다.
               * 선택이 비어 있으면 리스트 뷰가 "활동을 선택해 주세요."만 띄워
               * 활동을 만들 방법이 없어지기 때문이다.
               * (그룹을 고르면 EmptyGroupState의 '새로운 활동 추가'가 나온다)
               */
              selection: selectionAlive
                ? selection
                : snapshot.experiences[0]
                  ? {
                      kind: 'experience' as const,
                      id: snapshot.experiences[0].id,
                    }
                  : orderedGroups[0]
                    ? { kind: 'group' as const, id: orderedGroups[0].id }
                    : null,
            };
          }),

        setSyncError: (error) => set({ syncError: error }),

        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        toggleAgent: () => set((s) => ({ agentOpen: !s.agentOpen })),
        setContentLoading: (loading) => set({ isContentLoading: loading }),
        toggleGroupCollapsed: (groupId) =>
          set((s) => ({
            collapsedGroups: {
              ...s.collapsedGroups,
              [groupId]: !s.collapsedGroups[groupId],
            },
          })),
        openModal: (modal) => set({ modal }),
        closeModal: () => set({ modal: null }),

        selectExperience: (id) =>
          set({ selection: { kind: 'experience', id } }),
        selectGroup: (groupId) => {
          const experiences = get().experiences.filter(
            (e) => e.groupId === groupId,
          );
          if (experiences.length > 0) {
            set({ selection: { kind: 'experience', id: experiences[0].id } });
          } else {
            set({ selection: { kind: 'group', id: groupId } });
          }
        },

        renameGroup: (id, name) => {
          const group = get().groups.find((g) => g.id === id);
          if (!group || group.isUnclassified) return;
          commit({
            groups: get().groups.map((g) => (g.id === id ? { ...g, name } : g)),
          });
          syncUpdateContent(id, name);
        },

        addGroup: (afterGroupId) => {
          const s = get();
          if (s.groups.length >= MAX_GROUP_COUNT) {
            set({ modal: { type: 'group-limit' } });
            return;
          }
          const nextCounter = s.groupCounter + 1;
          const newGroup: Group = {
            id: uid('g'),
            name: `새로운 그룹 ${nextCounter}`,
            isUnclassified: false,
          };
          const groups = [...s.groups];
          const afterIdx = afterGroupId
            ? groups.findIndex((g) => g.id === afterGroupId)
            : -1;
          // 미분류는 항상 가장 아래에 있어야 하므로 그 위로만 삽입한다.
          const unclassifiedIdx = groups.findIndex((g) => g.isUnclassified);
          const lastAllowed =
            unclassifiedIdx === -1 ? groups.length : unclassifiedIdx;
          const requested = afterIdx === -1 ? lastAllowed : afterIdx + 1;
          const insertAt = Math.min(requested, lastAllowed);
          groups.splice(insertAt, 0, newGroup);

          set((prev) => ({
            collapsedGroups: { ...prev.collapsedGroups, [newGroup.id]: false },
          }));
          commit({
            groups,
            groupCounter: nextCounter,
            selection: { kind: 'group', id: newGroup.id },
          });

          syncCreateGroup(newGroup.id, newGroup.name);
          // 생성 API에는 위치 지정이 없어 항상 마지막에 붙는다. 중간이면 옮긴다.
          if (insertAt !== groups.length - 1) {
            syncMoveBlock(newGroup.id, insertAt);
          }
        },

        deleteGroup: (id) => {
          const s = get();
          const group = s.groups.find((g) => g.id === id);
          if (!group || group.isUnclassified) return;
          const fallbackGroupId = unclassifiedGroupId(s.groups);
          const experiences = fallbackGroupId
            ? s.experiences.map((e) =>
                e.groupId === id ? { ...e, groupId: fallbackGroupId } : e,
              )
            : s.experiences.filter((e) => e.groupId !== id);
          const groups = s.groups.filter((g) => g.id !== id);
          const selection: Selection =
            s.selection?.kind === 'group' && s.selection.id === id
              ? null
              : s.selection;
          commit({ groups, experiences, selection });
          syncDeleteBlocks([id]);
        },

        renameExperience: (id, name) => {
          commit({
            experiences: get().experiences.map((e) =>
              e.id === id ? { ...e, name } : e,
            ),
          });
          syncUpdateContent(id, name);
        },

        addExperience: (groupId, afterExperienceId) => {
          const s = get();
          if (s.experiences.length >= MAX_EXPERIENCE_COUNT) {
            set({ modal: { type: 'experience-limit' } });
            return;
          }
          const after = afterExperienceId
            ? s.experiences.find((e) => e.id === afterExperienceId)
            : undefined;
          const targetGroupId =
            after?.groupId ?? groupId ?? unclassifiedGroupId(s.groups);
          if (!targetGroupId) return;

          const nextCounter = s.experienceCounter + 1;
          const newExperience: Experience = {
            id: uid('e'),
            groupId: targetGroupId,
            name: `새로운 활동 ${nextCounter}`,
            blocks: [],
          };
          const experiences = [...s.experiences];
          const afterIdx = after
            ? experiences.findIndex((e) => e.id === after.id)
            : -1;
          if (afterIdx !== -1) {
            experiences.splice(afterIdx + 1, 0, newExperience);
          } else {
            experiences.push(newExperience);
          }
          set((prev) => ({
            collapsedGroups: {
              ...prev.collapsedGroups,
              [targetGroupId]: false,
            },
          }));
          commit({
            experiences,
            experienceCounter: nextCounter,
            selection: { kind: 'experience', id: newExperience.id },
          });

          // 활동을 만들면 서버가 5종 SECTION을 함께 만들어 준다. (맵 재조회로 받아온다)
          syncCreateExperience(
            newExperience.id,
            targetGroupId,
            newExperience.name,
          );
          const position = experienceIndexInGroup(
            experiences,
            newExperience.id,
            targetGroupId,
          );
          const isLast =
            position ===
            experiences.filter((e) => e.groupId === targetGroupId).length - 1;
          if (!isLast) syncMoveBlock(newExperience.id, position);
        },

        deleteExperience: (id) => {
          const s = get();
          const experiences = s.experiences.filter((e) => e.id !== id);
          const selection: Selection =
            s.selection?.kind === 'experience' && s.selection.id === id
              ? null
              : s.selection;
          commit({ experiences, selection });
          syncDeleteBlocks([id]);
        },

        moveExperienceToGroup: (experienceId, groupId) => {
          const experiences = get().experiences.map((e) =>
            e.id === experienceId ? { ...e, groupId } : e,
          );
          set((prev) => ({
            collapsedGroups: { ...prev.collapsedGroups, [groupId]: false },
          }));
          commit({ experiences });
          syncMoveBlock(
            experienceId,
            experienceIndexInGroup(experiences, experienceId, groupId),
            groupId,
          );
        },

        reorderGroup: (fromId, toId, place) => {
          const s = get();
          const from = s.groups.find((g) => g.id === fromId);
          const to = s.groups.find((g) => g.id === toId);
          if (!from || !to) return;
          if (from.isUnclassified || to.isUnclassified) return;
          if (fromId === toId) return;

          const fromIdx = s.groups.findIndex((g) => g.id === fromId);
          let toIdx = s.groups.findIndex((g) => g.id === toId);
          if (fromIdx === -1 || toIdx === -1) return;
          if (place === 'after') toIdx += 1;
          const without = [...s.groups];
          without.splice(fromIdx, 1);
          const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
          without.splice(insertAt, 0, from);
          commit({ groups: without });
          syncMoveBlock(fromId, insertAt);
        },

        reorderExperience: (experienceId, target) => {
          const s = get();
          const exp = s.experiences.find((e) => e.id === experienceId);
          if (!exp) return;

          if (target.kind === 'group') {
            if (exp.groupId === target.id) return;
            const others = s.experiences.filter((e) => e.id !== experienceId);
            const groupItems = others.filter((e) => e.groupId === target.id);
            const rest = others.filter((e) => e.groupId !== target.id);
            const moved = { ...exp, groupId: target.id };
            const groupOrder = s.groups.map((g) => g.id);
            const byGroup = new Map<string, Experience[]>();
            for (const g of groupOrder) byGroup.set(g, []);
            for (const e of rest) {
              const list = byGroup.get(e.groupId) ?? [];
              list.push(e);
              byGroup.set(e.groupId, list);
            }
            byGroup.set(target.id, [...groupItems, moved]);
            const rebuilt = groupOrder.flatMap((gid) => byGroup.get(gid) ?? []);
            const known = new Set(groupOrder);
            const orphans = others.filter((e) => !known.has(e.groupId));
            const nextExperiences = [...rebuilt, ...orphans];
            set((prev) => ({
              collapsedGroups: {
                ...prev.collapsedGroups,
                [target.id]: false,
              },
            }));
            commit({ experiences: nextExperiences });
            // 그룹 위로 바로 드롭한 경우에도 부모 변경을 서버에 반영한다.
            // (누락 시 맵 재조회에서 이전 그룹으로 되돌아간다)
            syncMoveBlock(
              experienceId,
              experienceIndexInGroup(nextExperiences, experienceId, target.id),
              target.id,
            );
            return;
          }

          const targetExp = s.experiences.find((e) => e.id === target.id);
          if (!targetExp || target.id === experienceId) return;

          const destGroupId = targetExp.groupId;
          const without = s.experiences.filter((e) => e.id !== experienceId);
          const targetIdx = without.findIndex((e) => e.id === target.id);
          if (targetIdx === -1) return;
          const insertAt =
            target.place === 'before' ? targetIdx : targetIdx + 1;
          const moved = { ...exp, groupId: destGroupId };
          const next = [...without];
          next.splice(insertAt, 0, moved);
          set((prev) => ({
            collapsedGroups: {
              ...prev.collapsedGroups,
              [destGroupId]: false,
            },
          }));
          commit({ experiences: next });
          syncMoveBlock(
            experienceId,
            experienceIndexInGroup(next, experienceId, destGroupId),
            destGroupId,
          );
        },

        updateBlockText: (experienceId, blockId, text) => {
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: setBlockTextInTree(e.blocks, blockId, text) }
                : e,
            ),
          });
          syncUpdateContent(blockId, text);
        },

        splitBlockAt: (experienceId, blockId, leftText, sibling) => {
          const fullText = `${leftText}${sibling.text ?? ''}`;
          set((s) => ({
            experiences: s.experiences.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    blocks: setBlockTextInTree(e.blocks, blockId, fullText),
                  }
                : e,
            ),
          }));
          const experiences = get().experiences.map((e) => {
            if (e.id !== experienceId) return e;
            const withText = setBlockTextInTree(e.blocks, blockId, leftText);
            return {
              ...e,
              blocks: insertSiblingAfter(withText, blockId, sibling),
            };
          });
          commit({ experiences });

          syncUpdateContent(blockId, leftText);
          const experience = experiences.find((e) => e.id === experienceId);
          const location = experience
            ? serverPositionOf(experience.blocks, sibling.id, experienceId)
            : null;
          if (location) {
            syncCreateBlocks(location.parentId, [sibling], location.position);
          }
        },

        addSiblingBlock: (experienceId, targetBlockId, newBlock) =>
          get().addSiblingBlocks(experienceId, targetBlockId, [newBlock]),

        addSiblingBlocks: (experienceId, targetBlockId, newBlocks) => {
          const experiences = get().experiences.map((e) =>
            e.id === experienceId
              ? {
                  ...e,
                  blocks: insertSiblingsAfter(
                    e.blocks,
                    targetBlockId,
                    newBlocks,
                  ),
                }
              : e,
          );
          commit({ experiences });

          const experience = experiences.find((e) => e.id === experienceId);
          const first = newBlocks[0];
          const location =
            experience && first
              ? serverPositionOf(experience.blocks, first.id, experienceId)
              : null;
          if (location) {
            syncCreateBlocks(location.parentId, newBlocks, location.position);
          }
        },

        addSectionToExperience: (experienceId, block) => {
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: [...e.blocks, block] }
                : e,
            ),
          });
          /*
           * 활동 바로 아래에 붙는 3단계 블록. 서버 기준 부모는 활동 블록이다.
           *
           * 주의: POST /experience-map/blocks 문서에는 직접 만들 수 있는 종류가
           * GROUP(루트) / EXPERIENCE(그룹 하위) / CONTENT(SECTION·CONTENT 하위)로만 적혀 있다.
           * 즉 (1) 활동 하위의 3단계 자유 블록, (2) 지운 SECTION 다시 만들기는
           * 서버가 거부할 수 있다. 화면설계서(3단계 템플릿 드롭다운)와 어긋나는 부분이라
           * 백엔드와 맞춰야 한다.
           */
          syncCreateBlocks(experienceId, [block]);
        },

        addChildBlock: (experienceId, parentBlockId, child) =>
          get().addChildrenBlocks(experienceId, parentBlockId, [child]),

        addChildrenBlocks: (experienceId, parentBlockId, children) => {
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    blocks: appendChildrenInTree(
                      e.blocks,
                      parentBlockId,
                      children,
                    ),
                  }
                : e,
            ),
          });
          // 마지막에 덧붙이므로 위치 보정이 필요 없다.
          syncCreateBlocks(parentBlockId, children);
        },

        deleteBlock: (experienceId, blockId) => {
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: removeBlockFromTree(e.blocks, blockId) }
                : e,
            ),
          });
          syncDeleteBlocks([blockId]);
        },

        moveBlock: (experienceId, draggedId, drop) => {
          const s = get();
          const exp = s.experiences.find((e) => e.id === experienceId);
          if (!exp) return;
          const nextBlocks = applyBlockMove(exp.blocks, draggedId, drop);
          if (!nextBlocks) return;
          commit({
            experiences: s.experiences.map((e) =>
              e.id === experienceId ? { ...e, blocks: nextBlocks } : e,
            ),
          });

          const location = serverPositionOf(
            nextBlocks,
            draggedId,
            experienceId,
          );
          if (location) {
            syncMoveBlock(draggedId, location.position, location.parentId);
          }
        },

        startBlockSelection: () =>
          set({ blockSelectionMode: true, selectedBlockIds: {} }),

        cancelBlockSelection: () =>
          set({ blockSelectionMode: false, selectedBlockIds: {} }),

        setBlockSelection: (nodeIds, selected) =>
          set((s) => {
            const next = { ...s.selectedBlockIds };
            for (const id of nodeIds) {
              if (selected) next[id] = true;
              else delete next[id];
            }
            return { selectedBlockIds: next };
          }),

        /**
         * 선택한 블록을 한 번에 삭제한다. (3-3)
         * 삭제된 그룹 하위의 활동은 함께 지우지 않고 '미분류' 그룹으로 옮긴다.
         */
        deleteSelectedBlocks: () => {
          const s = get();

          const groupIds = new Set<string>();
          const experienceIds = new Set<string>();
          const blockIdsByExperience = new Map<string, Set<string>>();

          for (const nodeId of Object.keys(s.selectedBlockIds)) {
            const parsed = parseMapNodeId(nodeId);
            if (!parsed) continue;

            if (parsed.kind === 'group') {
              groupIds.add(parsed.groupId);
            } else if (parsed.kind === 'experience') {
              experienceIds.add(parsed.experienceId);
            } else {
              const set = blockIdsByExperience.get(parsed.experienceId);
              if (set) set.add(parsed.blockId);
              else {
                blockIdsByExperience.set(
                  parsed.experienceId,
                  new Set([parsed.blockId]),
                );
              }
            }
          }

          // 미분류 그룹은 삭제 대상에서 제외한다.
          for (const group of s.groups) {
            if (group.isUnclassified) groupIds.delete(group.id);
          }

          const fallbackGroupId = unclassifiedGroupId(s.groups);

          const experiences = s.experiences
            .filter((e) => !experienceIds.has(e.id))
            .map((e) =>
              groupIds.has(e.groupId) && fallbackGroupId
                ? { ...e, groupId: fallbackGroupId }
                : e,
            )
            .map((e) => {
              const blockIds = blockIdsByExperience.get(e.id);
              if (!blockIds) return e;
              return { ...e, blocks: removeBlocksFromTree(e.blocks, blockIds) };
            });

          const groups = s.groups.filter((g) => !groupIds.has(g.id));

          const selectionSurvives =
            s.selection?.kind === 'experience'
              ? experiences.some((e) => e.id === s.selection?.id)
              : s.selection?.kind === 'group'
                ? groups.some((g) => g.id === s.selection?.id)
                : false;

          set({ blockSelectionMode: false, selectedBlockIds: {}, modal: null });
          commit({
            groups,
            experiences,
            selection: selectionSurvives ? s.selection : null,
          });

          /*
           * 서버는 블록을 지울 때 하위를 함께 지운다. (그룹만 하위 활동을 미분류로 옮긴다)
           * 그래서 선택된 것 중 "가장 위"만 보내야 이미 사라진 id를 다시 지우지 않는다.
           * - 활동이 선택됐으면 그 활동의 블록은 보내지 않는다.
           * - 상위 블록이 함께 선택된 블록도 보내지 않는다.
           */
          const topLevelBlockIds: string[] = [];
          for (const [expId, ids] of blockIdsByExperience) {
            if (experienceIds.has(expId)) continue;
            const experience = s.experiences.find((e) => e.id === expId);
            if (!experience) continue;

            const collect = (blocks: Block[], hasSelectedAncestor: boolean) => {
              for (const block of blocks) {
                const selected = ids.has(block.id);
                if (selected && !hasSelectedAncestor) {
                  topLevelBlockIds.push(block.id);
                }
                collect(block.children, hasSelectedAncestor || selected);
              }
            };
            collect(experience.blocks, false);
          }

          syncDeleteBlocks([
            ...topLevelBlockIds,
            ...experienceIds,
            ...groupIds,
          ]);
        },

        /*
         * 실행 취소 / 다시 실행은 화면설계서대로 세션 기반 인메모리 히스토리다.
         * 서버에는 되돌리기 API가 없어(AI 커밋 전용 revert만 존재한다) 화면 상태만 되돌린다.
         */
        undo: () =>
          set((s) => {
            if (s.past.length === 0) return {};
            const prev = s.past[s.past.length - 1];
            return {
              ...prev,
              past: s.past.slice(0, -1),
              future: [snapshotOf(s), ...s.future],
            };
          }),

        redo: () =>
          set((s) => {
            if (s.future.length === 0) return {};
            const next = s.future[0];
            return {
              ...next,
              past: [...s.past, snapshotOf(s)],
              future: s.future.slice(1),
            };
          }),
      };
    },
    { name: 'experience-list-store' },
  ),
);

/**
 * 동기화 계층이 스토어를 갱신할 수 있도록 연결한다.
 * (스토어가 sync를 import하고 sync는 스토어를 import하지 않아 순환 참조가 없다)
 */
configureExperienceMapSync({
  onSnapshot: (snapshot) =>
    useExperienceListStore.getState().hydrateFromServer(snapshot),
  onError: (error) => {
    // 실패한 조작은 곧바로 이어지는 맵 재조회로 서버 상태에 맞춰 되돌아간다.
    console.error('[experience-map] 동기화 실패', error);
    useExperienceListStore.getState().setSyncError(error);
  },
});

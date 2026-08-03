import { create } from 'zustand/react';
import { devtools } from 'zustand/middleware';
import {
  MAX_EXPERIENCE_COUNT,
  MAX_GROUP_COUNT,
  UNCLASSIFIED_ID,
} from '@/features/experience/list/constants';
import { uid } from '@/features/experience/list/factories';
import type {
  Block,
  Experience,
  Group,
} from '@/features/experience/list/types';
import { getExperienceListSeed } from '@/features/experience/list/mock';
import {
  applyBlockMove,
  type DropPosition,
} from '@/features/experience/list/utils/blockTreeUtils';

const seed = getExperienceListSeed();

function insertSiblingAfter(
  blocks: Block[],
  targetId: string,
  newBlock: Block,
): Block[] {
  const idx = blocks.findIndex((b) => b.id === targetId);
  if (idx !== -1) {
    const next = [...blocks];
    next.splice(idx + 1, 0, newBlock);
    return next;
  }
  return blocks.map((b) => ({
    ...b,
    children: insertSiblingAfter(b.children, targetId, newBlock),
  }));
}

function removeBlockFromTree(blocks: Block[], targetId: string): Block[] {
  return blocks
    .filter((b) => b.id !== targetId)
    .map((b) => ({ ...b, children: removeBlockFromTree(b.children, targetId) }));
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

function appendChildInTree(
  blocks: Block[],
  parentId: string,
  child: Block,
): Block[] {
  return appendChildrenInTree(blocks, parentId, [child]);
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
  | null;

type ViewMode = 'map' | 'list';

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

  viewMode: ViewMode;
  sidebarOpen: boolean;
  agentOpen: boolean;
  collapsedGroups: Record<string, boolean>;
  modal: ModalState;
  isContentLoading: boolean;

  past: Snapshot[];
  future: Snapshot[];

  setViewMode: (mode: ViewMode) => void;
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
  reorderGroup: (fromId: string, toId: string, place: 'before' | 'after') => void;

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

  updateBlockText: (experienceId: string, blockId: string, text: string) => void;
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
  addSectionToExperience: (experienceId: string, block: Block) => void;
  addChildBlock: (
    experienceId: string,
    parentBlockId: string,
    child: Block,
  ) => void;
  /** undo 스택 1회에 여러 자식 추가 */
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
    'groups' | 'experiences' | 'groupCounter' | 'experienceCounter' | 'selection'
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
        groups: seed.groups,
        experiences: seed.experiences,
        groupCounter: seed.groupCounter,
        experienceCounter: seed.experienceCounter,
        selection: {
          kind: 'experience',
          id: seed.experiences[0]?.id ?? '',
        },

        viewMode: 'list',
        sidebarOpen: true,
        agentOpen: true,
        collapsedGroups: {},
        modal: null,
        isContentLoading: false,

        past: [],
        future: [],

        setViewMode: (mode) => set({ viewMode: mode }),
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

        selectExperience: (id) => set({ selection: { kind: 'experience', id } }),
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
            groups: get().groups.map((g) =>
              g.id === id ? { ...g, name } : g,
            ),
          });
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
          if (afterIdx !== -1) {
            groups.splice(afterIdx + 1, 0, newGroup);
          } else {
            const unclassifiedIdx = groups.findIndex((g) => g.isUnclassified);
            if (unclassifiedIdx === -1) groups.push(newGroup);
            else groups.splice(unclassifiedIdx, 0, newGroup);
          }
          set((prev) => ({
            collapsedGroups: { ...prev.collapsedGroups, [newGroup.id]: false },
          }));
          commit({
            groups,
            groupCounter: nextCounter,
            selection: { kind: 'group', id: newGroup.id },
          });
        },

        deleteGroup: (id) => {
          const s = get();
          const group = s.groups.find((g) => g.id === id);
          if (!group || group.isUnclassified) return;
          const experiences = s.experiences.map((e) =>
            e.groupId === id ? { ...e, groupId: UNCLASSIFIED_ID } : e,
          );
          const groups = s.groups.filter((g) => g.id !== id);
          const selection: Selection =
            s.selection?.kind === 'group' && s.selection.id === id
              ? null
              : s.selection;
          commit({ groups, experiences, selection });
        },

        renameExperience: (id, name) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === id ? { ...e, name } : e,
            ),
          }),

        addExperience: (groupId = UNCLASSIFIED_ID, afterExperienceId) => {
          const s = get();
          if (s.experiences.length >= MAX_EXPERIENCE_COUNT) {
            set({ modal: { type: 'experience-limit' } });
            return;
          }
          const after = afterExperienceId
            ? s.experiences.find((e) => e.id === afterExperienceId)
            : undefined;
          const targetGroupId = after?.groupId ?? groupId;
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
        },

        deleteExperience: (id) => {
          const s = get();
          const experiences = s.experiences.filter((e) => e.id !== id);
          const selection: Selection =
            s.selection?.kind === 'experience' && s.selection.id === id
              ? null
              : s.selection;
          commit({ experiences, selection });
        },

        moveExperienceToGroup: (experienceId, groupId) => {
          set((prev) => ({
            collapsedGroups: { ...prev.collapsedGroups, [groupId]: false },
          }));
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId ? { ...e, groupId } : e,
            ),
          });
        },

        reorderGroup: (fromId, toId, place) => {
          const s = get();
          const from = s.groups.find((g) => g.id === fromId);
          const to = s.groups.find((g) => g.id === toId);
          if (!from || !to) return;
          if (from.isUnclassified || to.isUnclassified) return;
          if (fromId === toId) return;

          const movable = s.groups.filter((g) => !g.isUnclassified);
          const unclassified = s.groups.filter((g) => g.isUnclassified);
          const fromIdx = movable.findIndex((g) => g.id === fromId);
          let toIdx = movable.findIndex((g) => g.id === toId);
          if (fromIdx === -1 || toIdx === -1) return;
          if (place === 'after') toIdx += 1;
          const without = [...movable];
          without.splice(fromIdx, 1);
          const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
          without.splice(insertAt, 0, from);
          commit({ groups: [...without, ...unclassified] });
        },

        reorderExperience: (experienceId, target) => {
          const s = get();
          const exp = s.experiences.find((e) => e.id === experienceId);
          if (!exp) return;

          if (target.kind === 'group') {
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
            const targetList = byGroup.get(target.id) ?? [];
            byGroup.set(target.id, [...groupItems, moved]);
            const rebuilt = groupOrder.flatMap((gid) => byGroup.get(gid) ?? []);
            const known = new Set(groupOrder);
            const orphans = others.filter((e) => !known.has(e.groupId));
            set((prev) => ({
              collapsedGroups: {
                ...prev.collapsedGroups,
                [target.id]: false,
              },
            }));
            commit({ experiences: [...rebuilt, ...orphans] });
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
        },

        updateBlockText: (experienceId, blockId, text) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: setBlockTextInTree(e.blocks, blockId, text) }
                : e,
            ),
          }),

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
          commit({
            experiences: get().experiences.map((e) => {
              if (e.id !== experienceId) return e;
              const withText = setBlockTextInTree(e.blocks, blockId, leftText);
              return {
                ...e,
                blocks: insertSiblingAfter(withText, blockId, sibling),
              };
            }),
          });
        },

        addSiblingBlock: (experienceId, targetBlockId, newBlock) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    blocks: insertSiblingAfter(
                      e.blocks,
                      targetBlockId,
                      newBlock,
                    ),
                  }
                : e,
            ),
          }),

        addSectionToExperience: (experienceId, block) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: [...e.blocks, block] }
                : e,
            ),
          }),

        addChildBlock: (experienceId, parentBlockId, child) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    blocks: appendChildInTree(e.blocks, parentBlockId, child),
                  }
                : e,
            ),
          }),

        addChildrenBlocks: (experienceId, parentBlockId, children) =>
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
          }),

        deleteBlock: (experienceId, blockId) =>
          commit({
            experiences: get().experiences.map((e) =>
              e.id === experienceId
                ? { ...e, blocks: removeBlockFromTree(e.blocks, blockId) }
                : e,
            ),
          }),

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
        },

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

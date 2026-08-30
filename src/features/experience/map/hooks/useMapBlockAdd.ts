'use client';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  getDutyTemplateOptions,
  getProblemTemplateOptions,
} from '@/features/experience/list/api/templateOptions';
import {
  createDutyChildFromTemplate,
  createDutyLevel5FromTemplate,
  createFreeBlock,
  createProblemChildFromTemplate,
  createProblemLevel5FromTemplate,
  createSectionFromTemplate,
  sectionBlockPlaceholderAt,
} from '@/features/experience/list/factories';
import { getAvailableSectionTemplateOptions } from '@/features/experience/list/utils/sectionTemplateOptions';
import type { MenuItem } from '@/features/experience/list/components/ExperienceListMenu';
import type { MapLayoutNode } from '@/features/experience/map/utils/mapLayout';

export type MapAddAction =
  /** 하위에 빈 블록을 즉시 생성한다. */
  | { kind: 'direct'; add: () => void }
  /** 우측에 템플릿 드롭다운을 표시한다. */
  | { kind: 'template'; items: MenuItem[] }
  /** 5단계 블록은 하위를 가질 수 없다. */
  | null;

/**
 * 블록 추가 아이콘(5-2-1)의 동작을 결정한다.
 *
 * - 그룹      → 활동 추가
 * - 활동      → 기본 카테고리를 모두 보유했으면 빈 블록, 아니면 3단계 템플릿 드롭다운
 * - 담당업무   → 담당업무 템플릿 드롭다운
 * - 문제해결   → 문제해결 템플릿 드롭다운
 * - 그 외      → 빈 블록
 */
export function useMapBlockAdd(node: MapLayoutNode): MapAddAction {
  const experiences = useExperienceListStore((s) => s.experiences);
  const addExperience = useExperienceListStore((s) => s.addExperience);
  const addSectionToExperience = useExperienceListStore(
    (s) => s.addSectionToExperience,
  );
  const addChildBlock = useExperienceListStore((s) => s.addChildBlock);
  const addChildrenBlocks = useExperienceListStore((s) => s.addChildrenBlocks);

  if (node.level === 5) return null;

  if (node.kind === 'group') {
    return { kind: 'direct', add: () => addExperience(node.refId) };
  }

  if (node.kind === 'experience') {
    const experience = experiences.find((e) => e.id === node.refId);
    const options = getAvailableSectionTemplateOptions(experience?.blocks ?? []);

    if (options.length === 0) {
      return {
        kind: 'direct',
        add: () =>
          addSectionToExperience(node.refId, createSectionFromTemplate('free')),
      };
    }

    return {
      kind: 'template',
      items: options.map((option) => ({
        key: option.key,
        label: option.label,
        onSelect: () =>
          addSectionToExperience(
            node.refId,
            createSectionFromTemplate(option.key),
          ),
      })),
    };
  }

  const experienceId = node.experienceId;
  if (!experienceId || !node.block) return null;

  // 3단계 담당업무 · 문제해결은 4단계 템플릿을, 그 하위 4단계는 5단계 템플릿을 만든다.
  if (node.level === 3) {
    if (node.block.kind === 'duty') {
      return {
        kind: 'template',
        items: getDutyTemplateOptions().map((option) => ({
          key: option.key,
          label: option.label,
          onSelect: () =>
            addChildBlock(
              experienceId,
              node.refId,
              createDutyChildFromTemplate(option.key),
            ),
        })),
      };
    }

    if (node.block.kind === 'problem') {
      return {
        kind: 'template',
        items: getProblemTemplateOptions().map((option) => ({
          key: option.key,
          label: option.label,
          onSelect: () =>
            addChildBlock(
              experienceId,
              node.refId,
              createProblemChildFromTemplate(option.key),
            ),
        })),
      };
    }

    const childIndex = node.block.children.length;
    return {
      kind: 'direct',
      add: () =>
        addChildBlock(
          experienceId,
          node.refId,
          createFreeBlock(
            '',
            sectionBlockPlaceholderAt(node.block!.kind, childIndex),
          ),
        ),
    };
  }

  if (node.parentKind === 'duty') {
    return {
      kind: 'template',
      items: getDutyTemplateOptions().map((option) => ({
        key: option.key,
        label: option.label,
        onSelect: () =>
          addChildrenBlocks(
            experienceId,
            node.refId,
            createDutyLevel5FromTemplate(option.key),
          ),
      })),
    };
  }

  if (node.parentKind === 'problem') {
    return {
      kind: 'template',
      items: getProblemTemplateOptions().map((option) => ({
        key: option.key,
        label: option.label,
        onSelect: () =>
          addChildrenBlocks(
            experienceId,
            node.refId,
            createProblemLevel5FromTemplate(option.key),
          ),
      })),
    };
  }

  return {
    kind: 'direct',
    add: () => addChildBlock(experienceId, node.refId, createFreeBlock()),
  };
}

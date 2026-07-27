'use client';

import { PlusIcon } from '@/components/icons/PlusIcon';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ui/Dropdown';
import {
  PROBLEM_TEMPLATE_OPTIONS,
  SECTION_TEMPLATE_OPTIONS,
} from '@/features/experience/list/constants';
import {
  buildSectionChildren,
  createFreeBlock,
  createProblemChildFromTemplate,
  createSectionFromTemplate,
} from '@/features/experience/list/factories';
import type { Block } from '@/features/experience/list/types';

export function EmptyExperienceState({
  experienceId,
}: {
  experienceId: string;
}) {
  const addSectionToExperience = useExperienceListStore(
    (s) => s.addSectionToExperience,
  );
  const items: MenuItem[] = SECTION_TEMPLATE_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
    onSelect: () =>
      addSectionToExperience(experienceId, createSectionFromTemplate(opt.key)),
  }));

  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-center px-[60px] pb-[80px]'>
      <div className='flex flex-col items-center gap-[24px]'>
        <p className='typo-b2 text-[#898989]'>
          아직 이 경험 안에 정리된 블록이 없어요.
        </p>
        <MenuButton
          items={items}
          variant='block'
          menuPlacement='bottom'
          ariaLabel='새로운 블록 추가'
          menuTitle='템플릿 선택'
          className='inline-flex items-center gap-[4px] rounded-[6px] border border-gray4 bg-white px-[12px] py-[6px] transition-colors hover:bg-gray2'
        >
          <span className='typo-b2 text-gray9'>새로운 블록 추가</span>
        </MenuButton>
      </div>
    </div>
  );
}

export function EmptyGroupState({ groupId }: { groupId: string }) {
  const addExperience = useExperienceListStore((s) => s.addExperience);
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-[24px]'>
      <p className='typo-b2 text-gray6'>
        아직 이 그룹 안에 정리된 경험이 없어요.
      </p>
      <button
        type='button'
        onClick={() => addExperience(groupId)}
        className='inline-flex items-center gap-[8px] rounded-[100px] bg-white px-[32px] py-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]'
      >
        <span className='flex size-[24px] shrink-0 items-center justify-center overflow-hidden'>
          <PlusIcon />
        </span>
        <span className='typo-h5 text-gray9'>새로운 경험 추가</span>
      </button>
    </div>
  );
}

export function EmptySectionAddButton({
  experienceId,
  section,
}: {
  experienceId: string;
  section: Block;
}) {
  const addChildBlock = useExperienceListStore((s) => s.addChildBlock);
  const addChildrenBlocks = useExperienceListStore((s) => s.addChildrenBlocks);

  const boxCls =
    'flex h-[58px] w-full items-center rounded-[12px] border border-gray5 bg-white p-[16px] typo-text-field text-gray5 transition-colors hover:bg-gray2';

  const label = <span>+ 새로운 블록 추가</span>;

  if (section.kind === 'problem') {
    const items: MenuItem[] = PROBLEM_TEMPLATE_OPTIONS.map((opt) => ({
      key: opt.key,
      label: opt.label,
      onSelect: () =>
        addChildBlock(
          experienceId,
          section.id,
          createProblemChildFromTemplate(opt.key),
        ),
    }));
    return (
      <MenuButton
        items={items}
        variant='block'
        menuPlacement='bottom'
        menuAlign='start'
        wrapClassName='w-full'
        ariaLabel='새로운 블록 추가'
        menuTitle='템플릿 선택'
        className={boxCls}
      >
        {label}
      </MenuButton>
    );
  }

  const fixedKind = section.kind;
  if (fixedKind !== 'free') {
    return (
      <button
        type='button'
        onClick={() =>
          addChildrenBlocks(
            experienceId,
            section.id,
            buildSectionChildren(fixedKind),
          )
        }
        className={boxCls}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={() =>
        addChildBlock(experienceId, section.id, createFreeBlock())
      }
      className={boxCls}
    >
      {label}
    </button>
  );
}

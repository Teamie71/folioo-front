'use client';

import { CommonButton } from '@/components/CommonButton';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import {
  getDutyTemplateOptions,
  getProblemTemplateOptions,
} from '@/features/experience/list/api/templateOptions';
import {
  buildSectionChildren,
  createDutyChildFromTemplate,
  createFreeBlock,
  createProblemChildFromTemplate,
  createSectionFromTemplate,
} from '@/features/experience/list/factories';
import type { Block } from '@/features/experience/list/types';
import { getAvailableSectionTemplateOptions } from '@/features/experience/list/utils/sectionTemplateOptions';

const emptyMessageCls = 'typo-b2 text-[#898989] text-center';

const addBlockButtonCls =
  'border-gray4 hover:bg-gray2 inline-flex cursor-pointer items-center gap-[4px] rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors';

const emptyAddBoxCls =
  'flex h-[58px] w-full cursor-pointer items-center rounded-[12px] border border-gray5 bg-white p-[16px] typo-text-field text-gray5 transition-colors hover:bg-gray2';

export function EmptyExperienceState({
  experienceId,
  className,
}: {
  experienceId: string;
  className?: string;
}) {
  const addSectionToExperience = useExperienceListStore(
    (s) => s.addSectionToExperience,
  );
  const experiences = useExperienceListStore((s) => s.experiences);
  const blocks = experiences.find((e) => e.id === experienceId)?.blocks ?? [];
  const options = getAvailableSectionTemplateOptions(blocks);

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col items-center justify-center pb-[80px]',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-[24px]'>
        <p className={emptyMessageCls}>
          아직 이 활동 안에 정리된 블록이 없어요.
        </p>
        {/* 자유 블록이 항상 포함되므로 목록이 비지 않는다. 언제나 드롭다운을 띄운다. */}
        <MenuButton
          items={options.map((opt) => ({
            key: opt.key,
            label: opt.label,
            onSelect: () =>
              addSectionToExperience(
                experienceId,
                createSectionFromTemplate(opt.key),
              ),
          }))}
          variant='block'
          menuPlacement='bottom'
          ariaLabel='새로운 블록 추가'
          menuTitle='템플릿 선택'
          className={addBlockButtonCls}
        >
          <span className='typo-b2 text-gray9'>새로운 블록 추가</span>
        </MenuButton>
      </div>
    </div>
  );
}

export function EmptyGroupState({
  groupId,
  className,
  onAdded,
  variant = 'desktop',
}: {
  groupId: string;
  className?: string;
  onAdded?: (experienceId: string) => void;
  variant?: 'desktop' | 'mobile';
}) {
  const addExperience = useExperienceListStore((s) => s.addExperience);

  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-[24px]',
        variant === 'mobile' && 'pb-[80px]',
        className,
      )}
    >
      <p
        className={cn(
          'typo-b2 text-center',
          variant === 'mobile' ? 'text-[#898989]' : 'text-gray6',
        )}
      >
        아직 이 그룹 안에 정리된 활동이 없어요.
      </p>
      <CommonButton
        variantType='StartChat'
        className={cn(
          variant === 'mobile' &&
            'typo-b2-sb !text-[16px] !font-semibold shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]',
        )}
        onClick={() => {
          addExperience(groupId);
          const selection = useExperienceListStore.getState().selection;
          if (selection?.kind === 'experience') {
            onAdded?.(selection.id);
          }
        }}
      >
        새로운 활동 추가
      </CommonButton>
    </div>
  );
}

export function EmptySectionAddButton({
  experienceId,
  section,
  menuInsideBox = false,
}: {
  experienceId: string;
  section: Block;
  menuInsideBox?: boolean;
}) {
  const addChildBlock = useExperienceListStore((s) => s.addChildBlock);
  const addChildrenBlocks = useExperienceListStore((s) => s.addChildrenBlocks);

  const label = <span>+ 새로운 블록 추가</span>;
  const menuPositionProps = menuInsideBox
    ? ({ menuPlacement: 'inside-end' } as const)
    : ({ menuPlacement: 'bottom', menuAlign: 'start' } as const);

  if (section.kind === 'problem') {
    const items: MenuItem[] = getProblemTemplateOptions().map((opt) => ({
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
        {...menuPositionProps}
        wrapClassName='w-full'
        ariaLabel='새로운 블록 추가'
        menuTitle='템플릿 선택'
        className={emptyAddBoxCls}
      >
        {label}
      </MenuButton>
    );
  }

  if (section.kind === 'duty') {
    const items: MenuItem[] = getDutyTemplateOptions().map((opt) => ({
      key: opt.key,
      label: opt.label,
      onSelect: () =>
        addChildBlock(
          experienceId,
          section.id,
          createDutyChildFromTemplate(opt.key),
        ),
    }));
    return (
      <MenuButton
        items={items}
        variant='block'
        {...menuPositionProps}
        wrapClassName='w-full'
        ariaLabel='새로운 블록 추가'
        menuTitle='템플릿 선택'
        className={emptyAddBoxCls}
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
        className={emptyAddBoxCls}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={() => addChildBlock(experienceId, section.id, createFreeBlock())}
      className={emptyAddBoxCls}
    >
      {label}
    </button>
  );
}

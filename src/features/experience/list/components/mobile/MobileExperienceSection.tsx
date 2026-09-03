'use client';

import { useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { DropIndicator } from '@/features/experience/list/components/DropIndicator';
import { EmptySectionAddButton } from '@/features/experience/list/components/ExperienceListEmptyStates';
import { ExperienceListBlockNode } from '@/features/experience/list/components/ExperienceListBlockNode';
import {
  DEFAULT_BLOCK_PLACEHOLDER,
  SECTION_TITLE,
} from '@/features/experience/list/constants';
import { createSectionFromTemplate } from '@/features/experience/list/factories';
import {
  mobileRowActionCls,
  mobileRowActionsCls,
} from '@/features/experience/list/components/mobile/mobileRowStyles';
import { useBlockNodeDnd } from '@/features/experience/list/hooks/useBlockNodeDnd';
import { useRowPointerDrag } from '@/features/experience/list/hooks/useRowPointerDrag';
import type { Block } from '@/features/experience/list/types';
import { getAvailableSectionTemplateOptions } from '@/features/experience/list/utils/sectionTemplateOptions';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';
import { KebabIcon } from '@/components/icons/KebabIcon';

const SECTION_GAP = 8;

type Props = {
  block: Block;
  index: number;
  collapsed: boolean;
  onToggle: () => void;
};

export function MobileExperienceSection({
  block,
  index,
  collapsed,
  onToggle,
}: Props) {
  const addSiblingBlock = useExperienceListStore((s) => s.addSiblingBlock);
  const deleteBlock = useExperienceListStore((s) => s.deleteBlock);
  const updateBlockText = useExperienceListStore((s) => s.updateBlockText);

  const [requestRename, setRequestRename] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const {
    dnd,
    isDragging,
    hint,
    onDragOverRow,
    onDropRow,
    onDragOverInsideOnly,
    onDropInsideOnly,
  } = useBlockNodeDnd({ block, level: 3, index });

  const sectionTemplateOptions = useMemo(
    () => getAvailableSectionTemplateOptions(dnd.rootBlocks),
    [dnd.rootBlocks],
  );
  const hasMissingSectionTemplate = sectionTemplateOptions.some(
    (option) => option.key !== 'free',
  );

  const title = block.text.trim() ? block.text : SECTION_TITLE[block.kind];

  const addMenuItem: MenuItem = hasMissingSectionTemplate
    ? {
        key: 'add',
        label: '아래에 추가',
        submenu: sectionTemplateOptions.map((opt) => ({
          key: opt.key,
          label: opt.label,
          onSelect: () =>
            addSiblingBlock(
              dnd.experienceId,
              block.id,
              createSectionFromTemplate(opt.key),
            ),
        })),
        submenuTitle: '템플릿 선택',
      }
    : {
        key: 'add',
        label: '아래에 추가',
        onSelect: () =>
          addSiblingBlock(
            dnd.experienceId,
            block.id,
            createSectionFromTemplate('free'),
          ),
      };

  // 3단계에서는 자유 블록만 클릭 편집할 수 있다. 서버/과거 로컬 상태의
  // editable 값과 무관하게 화면설계서의 kind 규칙을 우선한다.
  const canRename = block.kind === 'free';

  const { rowDragProps } = useRowPointerDrag({
    payload: {
      type: 'block',
      experienceId: dnd.experienceId,
      id: block.id,
    },
    measureEl: () => rowRef.current,
    onDragBegin: (size) => {
      dnd.setDraggingId(block.id);
      dnd.setDragSize(size);
    },
    onDragMove: dnd.handlePointerDragMove,
    onDragEnd: dnd.handlePointerDragEnd,
    onDragCancel: () => dnd.finishDrag(block.id),
    onTap: onToggle,
  });

  const menu: MenuItem[] = [
    addMenuItem,
    ...(canRename
      ? [
          {
            key: 'rename',
            label: '이름 변경',
            onSelect: () => {
              window.setTimeout(() => setRequestRename(true), 50);
            },
          } satisfies MenuItem,
        ]
      : []),
    {
      key: 'delete',
      label: '삭제',
      onSelect: () => deleteBlock(dnd.experienceId, block.id),
    },
  ];

  return (
    <div
      data-section-dnd
      data-block-id={block.id}
      className={cn(
        'relative flex flex-col gap-[8px]',
        isDragging && 'opacity-40',
      )}
    >
      <DropIndicator
        visible={hint === 'before'}
        place='before'
        gap={SECTION_GAP}
        variant='sibling'
      />

      <div
        ref={rowRef}
        data-dnd-measure
        data-section-title-dnd
        onDragOver={onDragOverRow}
        onDrop={onDropRow}
        {...rowDragProps}
        className={cn(
          'bg-gray2 flex w-full items-center justify-between rounded-[8px] px-[10px] py-[8px]',
          rowDragProps.className,
        )}
      >
        <div className='flex min-w-0 flex-1 items-center gap-[4px]'>
          <button
            type='button'
            onClick={onToggle}
            className='flex size-[16px] shrink-0 cursor-pointer items-center justify-center'
            aria-label={collapsed ? '섹션 열기' : '섹션 닫기'}
            aria-expanded={!collapsed}
          >
            <ListChevronIcon
              className={cn(
                'size-[16px] transition-transform',
                collapsed ? 'rotate-90' : 'rotate-180',
              )}
            />
          </button>

          <div
            className='min-w-0 flex-1 text-left'
            data-no-row-drag={canRename ? '' : undefined}
          >
            <EditableLabel
              value={canRename ? block.text : title}
              placeholder={
                canRename
                  ? DEFAULT_BLOCK_PLACEHOLDER
                  : SECTION_TITLE[block.kind]
              }
              editable={canRename}
              editOn='click'
              maxLength={500}
              onCommit={(next) =>
                updateBlockText(dnd.experienceId, block.id, next)
              }
              requestEdit={requestRename}
              requestEditSelectAll
              onRequestEditHandled={() => setRequestRename(false)}
              className={cn(
                'text-gray9 block truncate',
                collapsed ? 'typo-b2' : 'typo-b2-sb',
              )}
              inputClassName='typo-b2 w-full text-gray9'
            />
          </div>
        </div>

        <div className={mobileRowActionsCls} data-no-row-drag>
          <MenuButton
            items={menu}
            variant='block'
            ariaLabel='섹션 메뉴'
            menuPlacement='bottom'
            menuAlign='end'
            className={mobileRowActionCls}
          >
            <span className='relative flex size-[16px] items-center justify-center'>
              <KebabIcon className='h-[10px] w-[2px]' />
            </span>
          </MenuButton>
        </div>
      </div>

      {!collapsed &&
        (block.children.length === 0 ? (
          <div
            className='relative'
            onDragOver={onDragOverInsideOnly}
            onDrop={onDropInsideOnly}
          >
            <DropIndicator
              visible={hint === 'inside'}
              place='before'
              offset={16}
              variant='child'
            />
            <EmptySectionAddButton
              experienceId={dnd.experienceId}
              section={block}
              menuInsideBox
            />
          </div>
        ) : (
          <div
            className={cn(
              'border-gray5 flex w-full flex-col overflow-visible rounded-[12px] border bg-white p-[16px]',
              '[&_button[aria-label="블록 메뉴"]]:!pointer-events-auto [&_button[aria-label="블록 메뉴"]]:!opacity-100',
            )}
            onDragOver={onDragOverInsideOnly}
            onDrop={onDropInsideOnly}
          >
            <div className='relative flex w-full flex-col gap-[2px]'>
              {block.children.map((child, i) => (
                <ExperienceListBlockNode
                  key={child.id}
                  block={child}
                  level={4}
                  parentKind={block.kind}
                  index={i}
                />
              ))}
              <div className='relative h-0 w-full'>
                <DropIndicator
                  visible={hint === 'inside'}
                  place='before'
                  variant='child'
                />
              </div>
            </div>
          </div>
        ))}

      <DropIndicator
        visible={hint === 'after'}
        place='after'
        gap={SECTION_GAP}
        variant='sibling'
      />
    </div>
  );
}

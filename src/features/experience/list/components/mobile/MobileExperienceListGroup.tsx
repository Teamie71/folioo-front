'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { GROUP_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { DropIndicator } from '@/features/experience/list/components/DropIndicator';
import { MobileExperienceListExperience } from '@/features/experience/list/components/mobile/MobileExperienceListExperience';
import {
  mobileRowActionCls,
  mobileRowActionsCls,
  mobileRowLabelCls,
  mobileRowLabelInputCls,
} from '@/features/experience/list/components/mobile/mobileRowStyles';
import { useRowPointerDrag } from '@/features/experience/list/hooks/useRowPointerDrag';
import { SIDEBAR_ROW_GAP } from '@/features/experience/list/utils/sidebarStyles';
import type { SidebarDndState } from '@/features/experience/list/hooks/useSidebarDnd';
import type { Experience, Group } from '@/features/experience/list/types';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';
import { ListPlusIcon } from '@/components/icons/ListPlusIcon';
import { KebabIcon } from '@/components/icons/KebabIcon';

type Props = {
  group: Group;
  groups: Group[];
  groupExperiences: Experience[];
  collapsed: boolean;
  dnd: SidebarDndState;
  onOpenExperience?: (experienceId: string) => void;
  onOpenEmptyGroup?: (groupId: string) => void;
};

export function MobileExperienceListGroup({
  group,
  groups,
  groupExperiences,
  collapsed,
  dnd,
  onOpenExperience,
  onOpenEmptyGroup,
}: Props) {
  const {
    draggingId,
    dragSize,
    dropHint,
    setDraggingId,
    setDragSize,
    setDropHint,
    clearDrag,
    handlePointerDragMove,
    handlePointerDragEnd,
  } = dnd;

  const [requestRename, setRequestRename] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const toggleGroupCollapsed = useExperienceListStore(
    (s) => s.toggleGroupCollapsed,
  );
  const selectGroup = useExperienceListStore((s) => s.selectGroup);
  const renameGroup = useExperienceListStore((s) => s.renameGroup);
  const addGroup = useExperienceListStore((s) => s.addGroup);
  const openModal = useExperienceListStore((s) => s.openModal);

  const isGroupDragging = draggingId === group.id;

  const groupMenu: MenuItem[] = [
    {
      key: 'rename',
      label: '이름 변경',
      onSelect: () => {
        window.setTimeout(() => setRequestRename(true), 50);
      },
    },
    {
      key: 'delete',
      label: '삭제',
      onSelect: () => openModal({ type: 'group-delete', groupId: group.id }),
    },
  ];

  const openGroup = useCallback(() => {
    selectGroup(group.id);
    if (groupExperiences.length === 0) {
      onOpenEmptyGroup?.(group.id);
    }
  }, [group.id, groupExperiences.length, onOpenEmptyGroup, selectGroup]);

  const { rowDragProps } = useRowPointerDrag({
    payload: { type: 'group', id: group.id },
    measureEl: () => rowRef.current,
    onDragBegin: (size) => {
      setDraggingId(group.id);
      setDragSize(size);
    },
    onDragMove: handlePointerDragMove,
    onDragEnd: handlePointerDragEnd,
    onDragCancel: clearDrag,
    onTap: group.isUnclassified ? undefined : openGroup,
  });

  const groupRowDragProps = group.isUnclassified
    ? {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          if (
            e.target instanceof Element &&
            e.target.closest('button, a, input, textarea, [data-no-row-drag]')
          ) {
            return;
          }
          openGroup();
        },
        className: 'touch-manipulation',
      }
    : rowDragProps;

  return (
    <div className='relative flex w-full flex-col gap-[4px]'>
      <DropIndicator
        visible={
          dropHint?.kind === 'group' &&
          dropHint.id === group.id &&
          dropHint.place === 'before'
        }
        size={
          dropHint?.kind === 'group' && dropHint.id === group.id
            ? dragSize
            : null
        }
        place='before'
        gap={SIDEBAR_ROW_GAP}
      />

      <div
        ref={rowRef}
        data-dnd-measure
        data-sidebar-dnd
        data-sidebar-dnd-kind='group'
        data-sidebar-dnd-id={group.id}
        data-sidebar-dnd-unclassified={group.isUnclassified ? 'true' : 'false'}
        {...groupRowDragProps}
        className={cn(
          'relative flex w-full items-center justify-between gap-[8px] rounded-[8px] px-[10px] py-[8px]',
          isGroupDragging ? 'bg-gray3' : 'bg-white',
          groupRowDragProps.className,
        )}
      >
        <div className='flex min-w-0 flex-1 items-center gap-[4px]'>
          <button
            type='button'
            onClick={() => toggleGroupCollapsed(group.id)}
            className='flex size-[16px] shrink-0 cursor-pointer items-center justify-center'
            aria-label={collapsed ? '아코디언 열기' : '아코디언 닫기'}
          >
            <ListChevronIcon
              className={cn(
                'text-gray5 size-[16px] transition-transform',
                collapsed ? 'rotate-90' : 'rotate-180',
              )}
            />
          </button>

          <div className='min-w-0 flex-1 text-left'>
            <EditableLabel
              value={group.name}
              placeholder={GROUP_NAME_PLACEHOLDER}
              editable={!group.isUnclassified}
              maxLength={20}
              onCommit={(next) => renameGroup(group.id, next)}
              requestEdit={requestRename}
              requestEditSelectAll
              onRequestEditHandled={() => setRequestRename(false)}
              className={mobileRowLabelCls}
              inputClassName={mobileRowLabelInputCls}
            />
          </div>
        </div>

        <div className={cn(mobileRowActionsCls, 'gap-[3px]')} data-no-row-drag>
          {/* 그룹 추가는 미분류 행에서도 가능하다. (그 외 그룹이 없을 때 유일한 진입점) */}
          <button
            type='button'
            onClick={() => addGroup(group.id)}
            className={mobileRowActionCls}
            aria-label='그룹 추가'
          >
            <ListPlusIcon className='size-[16px]' />
          </button>

          {/* 미분류는 이름 수정·삭제가 불가능해 케밥 메뉴를 두지 않는다. */}
          {!group.isUnclassified && (
            <MenuButton
              items={groupMenu}
              ariaLabel='그룹 메뉴'
              menuPlacement='bottom'
              menuAlign='end'
              className={mobileRowActionCls}
            >
              <span className='relative flex size-[16px] items-center justify-center'>
                <KebabIcon className='h-[10px] w-[2px]' />
              </span>
            </MenuButton>
          )}
        </div>
      </div>

      {!collapsed &&
        groupExperiences.map((item) => (
          <MobileExperienceListExperience
            key={item.id}
            item={item}
            groups={groups}
            dnd={dnd}
            onOpen={onOpenExperience}
          />
        ))}

      <DropIndicator
        visible={
          dropHint?.kind === 'group' &&
          dropHint.id === group.id &&
          dropHint.place === 'after'
        }
        size={
          dropHint?.kind === 'group' && dropHint.id === group.id
            ? dragSize
            : null
        }
        place='after'
        gap={SIDEBAR_ROW_GAP}
      />

      <DropIndicator
        visible={dropHint?.kind === 'group-end' && dropHint.id === group.id}
        size={
          dropHint?.kind === 'group-end' && dropHint.id === group.id
            ? dragSize
            : null
        }
        place='after'
        gap={SIDEBAR_ROW_GAP}
        className='left-[24px]'
      />
    </div>
  );
}

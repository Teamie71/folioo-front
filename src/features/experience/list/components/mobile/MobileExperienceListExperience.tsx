'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { DropIndicator } from '@/features/experience/list/components/DropIndicator';
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
import { ListPlusIcon } from '@/components/icons/ListPlusIcon';
import { KebabIcon } from '@/components/icons/KebabIcon';

function requestRenameEdit(setRequestRename: (v: boolean) => void) {
  window.setTimeout(() => setRequestRename(true), 50);
}

type Props = {
  item: Experience;
  groups: Group[];
  dnd: SidebarDndState;
  onOpen?: (experienceId: string) => void;
};

export function MobileExperienceListExperience({
  item,
  groups,
  dnd,
  onOpen,
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

  const selectExperience = useExperienceListStore((s) => s.selectExperience);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);
  const addExperience = useExperienceListStore((s) => s.addExperience);
  const moveExperienceToGroup = useExperienceListStore(
    (s) => s.moveExperienceToGroup,
  );
  const openModal = useExperienceListStore((s) => s.openModal);

  const isExpDragging = draggingId === item.id;

  const experienceMenu: MenuItem[] = [
    {
      key: 'move',
      label: '그룹 이동',
      submenu: groups
        .filter((g) => g.id !== item.groupId)
        .map((g) => ({
          key: g.id,
          label: g.name,
          onSelect: () => moveExperienceToGroup(item.id, g.id),
        })),
    },
    {
      key: 'rename',
      label: '이름 변경',
      onSelect: () => requestRenameEdit(setRequestRename),
    },
    {
      key: 'delete',
      label: '삭제',
      onSelect: () =>
        openModal({
          type: 'experience-delete',
          experienceId: item.id,
        }),
    },
  ];

  const openExperience = useCallback(() => {
    selectExperience(item.id);
    onOpen?.(item.id);
  }, [item.id, onOpen, selectExperience]);

  const { rowDragProps } = useRowPointerDrag({
    payload: { type: 'experience', id: item.id },
    measureEl: () => rowRef.current,
    onDragBegin: (size) => {
      setDraggingId(item.id);
      setDragSize(size);
    },
    onDragMove: handlePointerDragMove,
    onDragEnd: handlePointerDragEnd,
    onDragCancel: clearDrag,
    onTap: openExperience,
  });

  return (
    <div className='relative flex w-full flex-col'>
      <DropIndicator
        visible={
          dropHint?.kind === 'experience' &&
          dropHint.id === item.id &&
          dropHint.place === 'before'
        }
        size={
          dropHint?.kind === 'experience' && dropHint.id === item.id
            ? dragSize
            : null
        }
        place='before'
        gap={SIDEBAR_ROW_GAP}
        className='left-[24px]'
      />
      <div
        ref={rowRef}
        data-dnd-measure
        data-sidebar-dnd
        data-sidebar-dnd-kind='experience'
        data-sidebar-dnd-id={item.id}
        {...rowDragProps}
        className={cn(
          'relative ml-[24px] flex w-[calc(100%-24px)] items-center justify-between gap-[8px] rounded-[8px] px-[10px] py-[8px]',
          isExpDragging ? 'bg-gray3' : 'bg-white',
          rowDragProps.className,
        )}
      >
        <div className='min-w-0 flex-1 text-left'>
          <EditableLabel
            value={item.name}
            editable
            onCommit={(next) => renameExperience(item.id, next)}
            requestEdit={requestRename}
            requestEditSelectAll
            onRequestEditHandled={() => setRequestRename(false)}
            className={mobileRowLabelCls}
            inputClassName={mobileRowLabelInputCls}
          />
        </div>

        <div className={cn(mobileRowActionsCls, 'gap-[3px]')} data-no-row-drag>
          <button
            type='button'
            onClick={() => addExperience(item.groupId, item.id)}
            className={mobileRowActionCls}
            aria-label='활동 추가'
          >
            <ListPlusIcon className='size-[16px]' />
          </button>
          <MenuButton
            items={experienceMenu}
            ariaLabel='활동 메뉴'
            menuPlacement='bottom'
            menuAlign='end'
            submenuMode='inline'
            className={mobileRowActionCls}
          >
            <span className='relative flex size-[16px] items-center justify-center'>
              <KebabIcon className='h-[10px] w-[2px]' />
            </span>
          </MenuButton>
        </div>
      </div>
      <DropIndicator
        visible={
          dropHint?.kind === 'experience' &&
          dropHint.id === item.id &&
          dropHint.place === 'after'
        }
        size={
          dropHint?.kind === 'experience' && dropHint.id === item.id
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

'use client';

import { useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  DragMenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { EXPERIENCE_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { HoverTooltip } from '@/components/HoverTooltip';
import {
  DropIndicator,
  getActiveDrag,
  getDragPayload,
  placeFromY,
} from '@/features/experience/list/components/DropIndicator';
import {
  SIDEBAR_ROW_GAP,
  sidebarLabelCls,
  sidebarLabelClsSelected,
  sidebarLabelInputCls,
  sidebarRowActionCls,
} from '@/features/experience/list/utils/sidebarStyles';
import type { SidebarDndState } from '@/features/experience/list/hooks/useSidebarDnd';
import type { Experience, Group } from '@/features/experience/list/types';
import { ListPlusIcon } from '@/components/icons/ListPlusIcon';

type Props = {
  item: Experience;
  groups: Group[];
  selected: boolean;
  dnd: SidebarDndState;
};

export function ExperienceListSidebarExperience({
  item,
  groups,
  selected,
  dnd,
}: Props) {
  const {
    draggingId,
    dragSize,
    dropHint,
    setDraggingId,
    setDragSize,
    setDropHint,
    clearDrag,
  } = dnd;

  const selectExperience = useExperienceListStore((s) => s.selectExperience);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);
  const addExperience = useExperienceListStore((s) => s.addExperience);
  const moveExperienceToGroup = useExperienceListStore(
    (s) => s.moveExperienceToGroup,
  );
  const reorderExperience = useExperienceListStore((s) => s.reorderExperience);
  const openModal = useExperienceListStore((s) => s.openModal);

  const isExpDragging = draggingId === item.id;

  /** 케밥 메뉴의 '이름 변경'으로 인라인 편집을 켠다. */
  const [requestRename, setRequestRename] = useState(false);

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
      // 메뉴가 닫히면서 포커스를 가져가므로 한 틱 뒤에 편집을 켠다.
      onSelect: () => {
        window.setTimeout(() => setRequestRename(true), 50);
      },
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

  return (
    <div className='relative flex flex-col'>
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
        data-dnd-measure
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const active = getActiveDrag();
          if (active?.type === 'experience' && active.id !== item.id) {
            e.dataTransfer.dropEffect = 'move';
            setDropHint({
              kind: 'experience',
              id: item.id,
              place: placeFromY(e, e.currentTarget),
            });
          } else {
            e.dataTransfer.dropEffect = 'none';
            setDropHint(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const payload = getDragPayload(e);
          if (!payload || payload.type !== 'experience') {
            clearDrag();
            return;
          }
          const place =
            dropHint?.kind === 'experience' && dropHint.id === item.id
              ? dropHint.place
              : placeFromY(e, e.currentTarget);
          reorderExperience(payload.id, {
            kind: 'experience',
            id: item.id,
            place,
          });
          clearDrag();
        }}
        className={cn(
          'group/exp relative ml-[24px] flex w-[calc(100%-24px)] items-center rounded-[8px] py-[4px] pr-[4px] pl-[12px]',
          selected ? 'bg-gray3' : 'hover:bg-gray3 bg-transparent',
          isExpDragging && 'opacity-40',
        )}
      >
        <div
          role='button'
          tabIndex={0}
          onClick={() => selectExperience(item.id)}
          onKeyDown={(e) => {
            if (
              (e.key === 'Enter' || e.key === ' ') &&
              !(e.target instanceof HTMLInputElement)
            ) {
              e.preventDefault();
              selectExperience(item.id);
            }
          }}
          className='w-full min-w-0 flex-1 cursor-pointer text-left'
        >
          <EditableLabel
            value={item.name}
            placeholder={EXPERIENCE_NAME_PLACEHOLDER}
            editable
            onCommit={(next) => renameExperience(item.id, next)}
            requestEdit={requestRename}
            requestEditSelectAll
            onRequestEditHandled={() => setRequestRename(false)}
            className={selected ? sidebarLabelClsSelected : sidebarLabelCls}
            inputClassName={sidebarLabelInputCls}
          />
        </div>

        <HoverTooltip label='클릭하여 활동 추가'>
          <button
            type='button'
            onClick={() => addExperience(item.groupId, item.id)}
            className={cn(
              sidebarRowActionCls,
              'pointer-events-none shrink-0 opacity-0 group-hover/exp:pointer-events-auto group-hover/exp:opacity-100',
            )}
            aria-label='활동 추가'
          >
            <ListPlusIcon className='size-[16px]' />
          </button>
        </HoverTooltip>

        <DragMenuButton
          items={experienceMenu}
          ariaLabel='활동 메뉴'
          tooltipAlign='start'
          className={cn(
            sidebarRowActionCls,
            'pointer-events-none shrink-0 opacity-0 group-hover/exp:pointer-events-auto group-hover/exp:opacity-100',
          )}
          payload={{ type: 'experience', id: item.id }}
          onDragBegin={(size) => {
            setDraggingId(item.id);
            setDragSize(size);
          }}
          onDragFinish={clearDrag}
        />
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

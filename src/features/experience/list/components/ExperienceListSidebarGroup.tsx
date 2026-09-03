'use client';

import { useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  DragMenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { GROUP_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { HoverTooltip } from '@/components/HoverTooltip';
import {
  DropIndicator,
  getActiveDrag,
  getDragPayload,
  placeFromY,
} from '@/features/experience/list/components/DropIndicator';
import { ExperienceListSidebarExperience } from '@/features/experience/list/components/ExperienceListSidebarExperience';
import {
  SIDEBAR_ROW_GAP,
  sidebarLabelCls,
  sidebarLabelInputCls,
  sidebarRowActionCls,
} from '@/features/experience/list/utils/sidebarStyles';
import type { SidebarDndState } from '@/features/experience/list/hooks/useSidebarDnd';
import type { Experience, Group } from '@/features/experience/list/types';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';
import { ListPlusIcon } from '@/components/icons/ListPlusIcon';

type Props = {
  group: Group;
  groups: Group[];
  groupExperiences: Experience[];
  collapsed: boolean;
  selectedGroupId: string | null;
  selectedExperienceId: string | null;
  dnd: SidebarDndState;
};

export function ExperienceListSidebarGroup({
  group,
  groups,
  groupExperiences,
  collapsed,
  selectedGroupId,
  selectedExperienceId,
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

  const toggleGroupCollapsed = useExperienceListStore(
    (s) => s.toggleGroupCollapsed,
  );
  const selectGroup = useExperienceListStore((s) => s.selectGroup);
  const renameGroup = useExperienceListStore((s) => s.renameGroup);
  const addGroup = useExperienceListStore((s) => s.addGroup);
  const reorderGroup = useExperienceListStore((s) => s.reorderGroup);
  const reorderExperience = useExperienceListStore((s) => s.reorderExperience);
  const openModal = useExperienceListStore((s) => s.openModal);

  const isGroupDragging = draggingId === group.id;

  /** 케밥 메뉴의 '이름 변경'으로 인라인 편집을 켠다. */
  const [requestRename, setRequestRename] = useState(false);

  const groupMenu: MenuItem[] = [
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
      onSelect: () => openModal({ type: 'group-delete', groupId: group.id }),
    },
  ];

  return (
    <div className='relative flex flex-col gap-[4px]'>
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
        data-dnd-measure
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const active = getActiveDrag();
          if (!active || active.type === 'block') {
            e.dataTransfer.dropEffect = 'none';
            setDropHint(null);
            return;
          }
          if (group.isUnclassified) {
            if (active.type === 'experience') {
              e.dataTransfer.dropEffect = 'move';
              setDropHint({ kind: 'group-end', id: group.id });
            } else {
              e.dataTransfer.dropEffect = 'none';
              setDropHint(null);
            }
            return;
          }
          if (active.type === 'group' && active.id !== group.id) {
            e.dataTransfer.dropEffect = 'move';
            setDropHint({
              kind: 'group',
              id: group.id,
              place: placeFromY(e, e.currentTarget),
            });
          } else if (active.type === 'experience') {
            e.dataTransfer.dropEffect = 'move';
            setDropHint({ kind: 'group-end', id: group.id });
          } else {
            e.dataTransfer.dropEffect = 'none';
            setDropHint(null);
          }
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDropHint((prev) =>
              prev?.kind === 'group' && prev.id === group.id ? null : prev,
            );
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const payload = getDragPayload(e);
          if (!payload || payload.type === 'block') {
            clearDrag();
            return;
          }
          if (payload.type === 'group' && !group.isUnclassified) {
            const place =
              dropHint?.kind === 'group' && dropHint.id === group.id
                ? dropHint.place
                : placeFromY(e, e.currentTarget);
            reorderGroup(payload.id, group.id, place);
          } else if (payload.type === 'experience') {
            reorderExperience(payload.id, {
              kind: 'group',
              id: group.id,
            });
          }
          clearDrag();
        }}
        className={cn(
          'group/row relative flex w-full items-center gap-[8px] rounded-[8px] py-[4px] pr-[8px] pl-[8px]',
          selectedGroupId === group.id && 'bg-gray3',
          !group.isUnclassified &&
            selectedGroupId !== group.id &&
            'hover:bg-gray3',
          isGroupDragging && 'opacity-40',
        )}
      >
        <button
          type='button'
          onClick={() => toggleGroupCollapsed(group.id)}
          className='flex size-[16px] shrink-0 cursor-pointer items-center justify-center'
          aria-label={collapsed ? '아코디언 열기' : '아코디언 닫기'}
        >
          <ListChevronIcon
            className={cn(
              'size-[16px] transition-transform',
              collapsed ? 'rotate-90' : 'rotate-180',
            )}
          />
        </button>

        <div
          role='button'
          tabIndex={0}
          onClick={() => selectGroup(group.id)}
          onKeyDown={(e) => {
            if (
              (e.key === 'Enter' || e.key === ' ') &&
              !(e.target instanceof HTMLInputElement)
            ) {
              e.preventDefault();
              selectGroup(group.id);
            }
          }}
          className='min-w-0 flex-1 cursor-pointer text-left'
        >
          <EditableLabel
            value={group.name}
            placeholder={GROUP_NAME_PLACEHOLDER}
            editable={!group.isUnclassified}
            maxLength={20}
            onCommit={(next) => renameGroup(group.id, next)}
            requestEdit={requestRename}
            requestEditSelectAll
            onRequestEditHandled={() => setRequestRename(false)}
            className={sidebarLabelCls}
            inputClassName={sidebarLabelInputCls}
          />
        </div>

        {!group.isUnclassified && (
          <HoverTooltip label='클릭하여 그룹 추가'>
            <button
              type='button'
              onClick={() => addGroup(group.id)}
              className={cn(
                sidebarRowActionCls,
                'pointer-events-none shrink-0 opacity-0 group-hover/row:pointer-events-auto group-hover/row:opacity-100',
              )}
              aria-label='그룹 추가'
            >
              <ListPlusIcon className='size-[16px]' />
            </button>
          </HoverTooltip>
        )}

        {/* 미분류는 이름 수정·삭제가 불가능해 케밥 메뉴를 두지 않는다. */}
        {!group.isUnclassified && (
          <DragMenuButton
            items={groupMenu}
            ariaLabel='그룹 메뉴'
            tooltipAlign='start'
            className={cn(
              sidebarRowActionCls,
              'pointer-events-none shrink-0 opacity-0 group-hover/row:pointer-events-auto group-hover/row:opacity-100',
            )}
            payload={{ type: 'group', id: group.id }}
            onDragBegin={(size) => {
              setDraggingId(group.id);
              setDragSize(size);
            }}
            onDragFinish={clearDrag}
          />
        )}
      </div>

      {!collapsed &&
        groupExperiences.map((item) => (
          <ExperienceListSidebarExperience
            key={item.id}
            item={item}
            groups={groups}
            selected={item.id === selectedExperienceId}
            dnd={dnd}
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

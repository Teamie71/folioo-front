'use client';

import Image from 'next/image';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  DragMenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ui/Dropdown';
import { EditableLabel } from '@/features/experience/list/components/ui/EditableLabel';
import { HoverTooltip } from '@/features/experience/list/components/ui/HoverTooltip';
import {
  DropIndicator,
  getActiveDrag,
  getDragPayload,
  placeFromY,
} from '@/features/experience/list/components/ui/DropIndicator';
import { ExperienceListSidebarExperience } from '@/features/experience/list/components/ExperienceListSidebarExperience';
import {
  SIDEBAR_ASSET,
  SIDEBAR_ROW_GAP,
  sidebarLabelCls,
  sidebarLabelInputCls,
  sidebarRowActionCls,
} from '@/features/experience/list/components/sidebarStyles';
import type { SidebarDndState } from '@/features/experience/list/hooks/useSidebarDnd';
import type { Experience, Group } from '@/features/experience/list/types';

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

  const groupMenu: MenuItem[] = [
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
        {!group.isUnclassified && (
          <div className='absolute top-1/2 left-0 flex size-[16px] -translate-x-full -translate-y-1/2 items-center justify-center'>
            <DragMenuButton
              items={groupMenu}
              ariaLabel='그룹 메뉴'
              tooltipAlign='start'
              className={cn(
                sidebarRowActionCls,
                'opacity-0 group-hover/row:opacity-100',
              )}
              payload={{ type: 'group', id: group.id }}
              onDragBegin={(size) => {
                setDraggingId(group.id);
                setDragSize(size);
              }}
              onDragFinish={clearDrag}
            />
          </div>
        )}

        <button
          type='button'
          onClick={() => toggleGroupCollapsed(group.id)}
          className='flex size-[16px] shrink-0 cursor-pointer items-center justify-center'
          aria-label={collapsed ? '아코디언 열기' : '아코디언 닫기'}
        >
          <span
            className={cn(
              'relative size-[16px] overflow-hidden transition-transform',
              collapsed ? 'rotate-90' : 'rotate-180',
            )}
          >
            <Image
              src={`${SIDEBAR_ASSET}/icon-chevron.svg`}
              alt=''
              fill
              className='object-contain'
              unoptimized
            />
          </span>
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
            editable={!group.isUnclassified}
            onCommit={(next) => renameGroup(group.id, next)}
            className={sidebarLabelCls}
            inputClassName={sidebarLabelInputCls}
          />
        </div>

        {!group.isUnclassified && (
          <HoverTooltip label='클릭하여 그룹 추가'>
            <button
              type='button'
              onClick={addGroup}
              className={cn(
                sidebarRowActionCls,
                'shrink-0 opacity-0 group-hover/row:opacity-100',
              )}
              aria-label='그룹 추가'
            >
              <span
                className='relative size-[16px] overflow-hidden'
                aria-hidden
              >
                <Image
                  src={`${SIDEBAR_ASSET}/icon-plus.svg`}
                  alt=''
                  fill
                  className='object-contain'
                  unoptimized
                />
              </span>
            </button>
          </HoverTooltip>
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

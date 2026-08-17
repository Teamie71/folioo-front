'use client';

import { memo, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { HoverTooltip } from '@/components/HoverTooltip';
import { MenuButton } from '@/features/experience/list/components/ExperienceListMenu';
import { MapBlockAddIcon } from '@/components/icons/MapBlockAddIcon';
import { MapBlockCheckIcon } from '@/components/icons/MapBlockCheckIcon';
import { MapBlockRemoveIcon } from '@/components/icons/MapBlockRemoveIcon';
import {
  BLOCK_MAX_LENGTH,
  BLOCK_PADDING_X,
  BLOCK_PADDING_Y,
  BLOCK_RADIUS,
  SECTION_PADDING_Y,
  TITLE_MAX_LENGTH,
} from '@/features/experience/map/constants';
import { MapBlockText } from '@/features/experience/map/components/MapBlockText';
import { useMapInteraction } from '@/features/experience/map/components/MapInteractionContext';
import { useMapBlockAdd } from '@/features/experience/map/hooks/useMapBlockAdd';
import type { MapLayoutNode } from '@/features/experience/map/utils/mapLayout';

export type MapBlockNodeData = { node: MapLayoutNode };

const BOX_SHADOW = '0px 2px 8px 0px #0000001A';

const controlButtonCls =
  'flex size-[14px] cursor-pointer items-center justify-center';

function MapBlockNodeComponent({ data }: NodeProps) {
  const { node } = data as unknown as MapBlockNodeData;
  const containerRef = useRef<HTMLDivElement>(null);

  const { activeId, editingId, onEditingChange, menuCloseSignal } =
    useMapInteraction();

  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const isSelected = useExperienceListStore(
    (s) => s.selectedBlockIds[node.id] === true,
  );

  const renameGroup = useExperienceListStore((s) => s.renameGroup);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);
  const updateBlockText = useExperienceListStore((s) => s.updateBlockText);
  const deleteBlock = useExperienceListStore((s) => s.deleteBlock);
  const openModal = useExperienceListStore((s) => s.openModal);

  const addAction = useMapBlockAdd(node);

  const isActive = activeId === node.id;
  const isEditing = editingId === node.id;
  const isSection = node.level === 3;
  const isTitle = node.level <= 2;

  // 5단계 블록은 hover 시에도 아무 일이 일어나지 않는다.
  // 선택 삭제 모드에서는 개별 추가/삭제 컨트롤을 숨긴다.
  const showAddOnHover =
    !blockSelectionMode && node.level <= 4 && addAction != null;

  // 미분류 그룹은 선택 상태로 전환되지 않으므로 체크 표시도 띄우지 않는다.
  const showCheck = blockSelectionMode && node.deletable;

  const commitText = (next: string) => {
    if (node.kind === 'group') {
      renameGroup(node.refId, next);
      return;
    }
    if (node.kind === 'experience') {
      renameExperience(node.refId, next);
      return;
    }
    if (node.experienceId) {
      updateBlockText(node.experienceId, node.refId, next);
    }
  };

  /**
   * 그룹은 하위 활동을 미분류로 옮기고, 활동은 하위 블록을 함께 지운다.
   * 두 경우 모두 확인 모달을 거치고, 3-5단계 블록만 즉시 삭제된다.
   */
  const requestDelete = () => {
    if (!node.deletable) return;

    if (node.kind === 'group') {
      openModal({ type: 'group-delete', groupId: node.refId });
      return;
    }
    if (node.kind === 'experience') {
      openModal({ type: 'experience-delete', experienceId: node.refId });
      return;
    }
    if (node.experienceId) {
      deleteBlock(node.experienceId, node.refId);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className='group/blk relative outline-none'
      style={{ width: node.width }}
      onKeyDown={(event) => {
        if (isEditing) return;
        if (event.key !== 'Backspace' && event.key !== 'Delete') return;
        event.preventDefault();
        requestDelete();
      }}
    >
      {/* 연결선을 중심 to 중심으로 그리기 위해 핸들을 박스 중앙에 둔다. */}
      <Handle
        type='target'
        position={Position.Left}
        isConnectable={false}
        className='!pointer-events-none !top-1/2 !left-1/2 !size-px !min-h-0 !min-w-0 !-translate-x-1/2 !-translate-y-1/2 !transform !border-0 !bg-transparent'
      />
      <Handle
        type='source'
        position={Position.Right}
        isConnectable={false}
        className='!pointer-events-none !top-1/2 !left-1/2 !size-px !min-h-0 !min-w-0 !-translate-x-1/2 !-translate-y-1/2 !transform !border-0 !bg-transparent'
      />

      {showCheck && (
        <span className='pointer-events-none absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2'>
          <MapBlockCheckIcon selected={isSelected} />
        </span>
      )}

      {node.deletable && isActive && !blockSelectionMode && (
        <span className='absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2'>
          <HoverTooltip label='클릭하여 해당 블록 삭제'>
            <button
              type='button'
              aria-label='블록 삭제'
              className='nodrag nopan flex size-[18px] cursor-pointer items-center justify-center'
              onClick={(event) => {
                event.stopPropagation();
                requestDelete();
              }}
            >
              <MapBlockRemoveIcon />
            </button>
          </HoverTooltip>
        </span>
      )}

      <div
        className={cn(
          'border-gray3 box-border w-full border bg-white',
          isEditing && 'border-main',
        )}
        style={{
          paddingInline: BLOCK_PADDING_X,
          paddingBlock: isSection ? SECTION_PADDING_Y : BLOCK_PADDING_Y,
          borderRadius: BLOCK_RADIUS,
          boxShadow: BOX_SHADOW,
        }}
      >
        <MapBlockText
          value={node.text}
          placeholder={node.placeholder ?? ''}
          editable={node.editable}
          maxLength={isTitle ? TITLE_MAX_LENGTH : BLOCK_MAX_LENGTH}
          editing={isEditing}
          onEditingChange={(editing) => onEditingChange(node.id, editing)}
          onCommit={commitText}
        />
      </div>

      <div className='absolute top-0 left-full flex h-full items-center gap-[4px] pl-[8px]'>
        {showAddOnHover && addAction?.kind === 'direct' && (
          <HoverTooltip label='클릭하여 하위 블록 추가'>
            <button
              type='button'
              aria-label='하위 블록 추가'
              className={cn(
                controlButtonCls,
                'nodrag nopan opacity-0 group-hover/blk:opacity-100',
              )}
              onClick={(event) => {
                event.stopPropagation();
                addAction.add();
              }}
            >
              <MapBlockAddIcon />
            </button>
          </HoverTooltip>
        )}

        {showAddOnHover && addAction?.kind === 'template' && (
          <MenuButton
            items={addAction.items}
            ariaLabel='하위 블록 추가'
            tooltip='클릭하여 하위 블록 추가'
            variant='block'
            menuPlacement='right-bottom'
            anchorRef={containerRef}
            closeSignal={menuCloseSignal}
            menuTitle='템플릿 선택'
            className={cn(
              controlButtonCls,
              'nodrag nopan opacity-0 group-hover/blk:opacity-100',
            )}
            wrapClassName='nodrag nopan'
          >
            <MapBlockAddIcon />
          </MenuButton>
        )}
      </div>
    </div>
  );
}

export const MapBlockNode = memo(MapBlockNodeComponent);

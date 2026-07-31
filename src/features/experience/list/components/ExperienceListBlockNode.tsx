'use client';

import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  DragMenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { DropIndicator } from '@/features/experience/list/components/DropIndicator';
import { EmptySectionAddButton } from '@/features/experience/list/components/ExperienceListEmptyStates';
import {
  DEFAULT_BLOCK_PLACEHOLDER,
  PROBLEM_TEMPLATE_OPTIONS,
  SECTION_TEMPLATE_OPTIONS,
  SECTION_TITLE,
} from '@/features/experience/list/constants';
import {
  createFreeBlock,
  createProblemChildFromTemplate,
  createSectionFromTemplate,
  sectionBlockPlaceholderAt,
} from '@/features/experience/list/factories';
import { useBlockNodeDnd } from '@/features/experience/list/hooks/useBlockNodeDnd';
import type { Block } from '@/features/experience/list/types';
import { isMeaningfulDrop } from '@/features/experience/list/utils/blockTreeUtils';

const kebabCls =
  'flex size-[20px] shrink-0 items-center justify-center rounded-[4px] text-[16px] leading-none text-gray6 hover:bg-gray3';

const firstLineSlotCls = 'flex h-[1lh] shrink-0 items-center justify-center';

const SECTION_GAP = 20;
const LEVEL4_GAP = 2;
const LEVEL5_GAP = 2;

export function ExperienceListBlockNode({
  block,
  level,
  parentKind,
  index = 0,
}: {
  block: Block;
  level: number;
  parentKind: Block['kind'] | null;
  index?: number;
}) {
  const addSiblingBlock = useExperienceListStore((s) => s.addSiblingBlock);
  const deleteBlock = useExperienceListStore((s) => s.deleteBlock);
  const updateBlockText = useExperienceListStore((s) => s.updateBlockText);
  const indentBlock = useExperienceListStore((s) => s.indentBlock);
  const outdentBlock = useExperienceListStore((s) => s.outdentBlock);

  const {
    dnd,
    isDragging,
    isInDragSubtree,
    hint,
    onDragOverRow,
    onDropRow,
    onDragOverInsideOnly,
    onDropInsideOnly,
  } = useBlockNodeDnd({ block, level, index });

  const canShowInsideHint =
    level === 4 &&
    hint === 'inside' &&
    dnd.draggingId != null &&
    isMeaningfulDrop(dnd.rootBlocks, dnd.draggingId, block.id, 'inside');

  const usesTemplateAdd =
    level === 3 || (level === 4 && parentKind === 'problem');

  const addSubmenu: MenuItem[] | undefined = usesTemplateAdd
    ? (level === 3 ? SECTION_TEMPLATE_OPTIONS : PROBLEM_TEMPLATE_OPTIONS).map(
        (opt) => ({
          key: opt.key,
          label: opt.label,
          onSelect: () =>
            addSiblingBlock(
              dnd.experienceId,
              block.id,
              level === 3
                ? createSectionFromTemplate(
                    opt.key as (typeof SECTION_TEMPLATE_OPTIONS)[number]['key'],
                  )
                : createProblemChildFromTemplate(
                    opt.key as (typeof PROBLEM_TEMPLATE_OPTIONS)[number]['key'],
                  ),
            ),
        }),
      )
    : undefined;

  const menu: MenuItem[] = [
    addSubmenu
      ? {
          key: 'add',
          label: '아래에 추가',
          submenu: addSubmenu,
          submenuTitle: '템플릿 선택',
        }
      : {
          key: 'add',
          label: '아래에 추가',
          onSelect: () =>
            addSiblingBlock(
              dnd.experienceId,
              block.id,
              createFreeBlock(
                '',
                level === 4 && parentKind
                  ? sectionBlockPlaceholderAt(parentKind, index + 1)
                  : undefined,
              ),
            ),
        },
    {
      key: 'delete',
      label: '삭제',
      onSelect: () => deleteBlock(dnd.experienceId, block.id),
    },
  ];

  const dragKebab = (
    <DragMenuButton
      items={menu}
      variant='block'
      ariaLabel='블록 메뉴'
      tooltipAlign='center'
      className={cn(
        kebabCls,
        isInDragSubtree && !isDragging
          ? 'pointer-events-none !opacity-0'
          : level === 3
            ? 'opacity-0 group-hover/sec:opacity-100'
            : 'opacity-0 group-hover/blk:opacity-100',
      )}
      payload={{
        type: 'block',
        experienceId: dnd.experienceId,
        id: block.id,
      }}
      onDragBegin={(size) => {
        dnd.setDraggingId(block.id);
        dnd.setDragSize(size);
      }}
      onDragFinish={() => dnd.finishDrag(block.id)}
    />
  );

  if (level === 3) {
    const title = block.editable ? block.text : SECTION_TITLE[block.kind];
    return (
      <div
        data-section-dnd
        className='group/sec relative flex flex-col gap-[8px]'
      >
        <DropIndicator
          visible={hint === 'before'}
          place='before'
          gap={SECTION_GAP}
          variant='sibling'
        />
        <div
          data-dnd-measure
          data-section-title-dnd
          className='relative -mx-[4px] rounded-[6px] px-[4px]'
          onDragOver={onDragOverRow}
          onDrop={onDropRow}
        >
          <div
            className={cn(
              'absolute top-1/2 left-[-20px] flex -translate-y-1/2',
              isDragging && '[&_button]:!bg-transparent [&_img]:opacity-0',
            )}
          >
            {dragKebab}
          </div>
          <EditableLabel
            as='h3'
            value={title}
            editable={block.editable}
            onCommit={(next) =>
              updateBlockText(dnd.experienceId, block.id, next)
            }
            className={cn(
              'typo-b2-sb',
              isDragging ? 'text-gray5' : 'text-gray9',
            )}
            inputClassName='typo-b2-sb text-gray9'
          />
        </div>

        {block.children.length === 0 ? (
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
            />
          </div>
        ) : (
          <div
            className='border-gray5 flex w-full flex-col overflow-visible rounded-[12px] border bg-white p-[16px]'
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
        )}
        <DropIndicator
          visible={hint === 'after'}
          place='after'
          gap={SECTION_GAP}
          variant='sibling'
        />
      </div>
    );
  }

  const rowGap = level === 4 ? LEVEL4_GAP : LEVEL5_GAP;
  return (
    <div
      className={cn(
        'group/blk relative',
        isDragging && 'bg-sub1 -mx-[4px] rounded-[6px] px-[4px] py-[2px]',
      )}
    >
      <div
        data-dnd-measure
        className='relative flex w-full min-w-0 flex-col gap-[2px]'
        onDragOver={onDragOverRow}
        onDrop={onDropRow}
      >
        <DropIndicator
          visible={hint === 'before'}
          place='before'
          gap={rowGap}
          variant='sibling'
        />
        <div className='relative'>
          <div className='relative -my-[4px] py-[4px]'>
            <div
              data-block-row-dnd
              className={cn(
                'relative -mx-[4px] rounded-[6px] px-[4px]',
                !isInDragSubtree && 'hover:bg-sub1',
                canShowInsideHint && 'bg-sub1',
              )}
            >
              <div
                className={cn(
                  firstLineSlotCls,
                  'typo-text-field absolute top-0 left-[-14px] z-10 w-[20px]',
                  isDragging && '[&_button]:!bg-transparent [&_img]:opacity-0',
                )}
              >
                {dragKebab}
              </div>
              <div className='typo-text-field relative flex w-full min-w-0 items-start'>
                <span className={cn(firstLineSlotCls, 'w-[24px]')} aria-hidden>
                  <span
                    className={cn(
                      'size-[4px] rounded-full',
                      isInDragSubtree ? 'bg-gray5' : 'bg-gray9',
                    )}
                  />
                </span>
                <EditableLabel
                  value={block.text}
                  editable={block.editable}
                  onCommit={(next) =>
                    updateBlockText(dnd.experienceId, block.id, next)
                  }
                  onEnter={(draft) => {
                    const next = draft.trim();
                    if (next && next !== block.text) {
                      updateBlockText(dnd.experienceId, block.id, next);
                    }
                    const sibling = createFreeBlock();
                    addSiblingBlock(dnd.experienceId, block.id, sibling);
                    dnd.setEditRequest({ id: sibling.id, caret: 0 });
                  }}
                  onTab={(draft, direction, caret) => {
                    const next = draft.trim();
                    if (next && next !== block.text) {
                      updateBlockText(dnd.experienceId, block.id, next);
                    }
                    const moved =
                      direction === 'indent'
                        ? indentBlock(dnd.experienceId, block.id)
                        : outdentBlock(dnd.experienceId, block.id);
                    if (moved) {
                      dnd.setEditRequest({ id: block.id, caret });
                    }
                    return moved;
                  }}
                  requestEdit={dnd.editRequest?.id === block.id}
                  requestEditCaret={
                    dnd.editRequest?.id === block.id ? dnd.editRequest.caret : 0
                  }
                  onRequestEditHandled={() => {
                    if (dnd.editRequest?.id === block.id) {
                      dnd.setEditRequest(null);
                    }
                  }}
                  className={cn(
                    'block min-w-0 flex-1 text-left',
                    isInDragSubtree || !block.text
                      ? 'text-gray5'
                      : 'text-gray9',
                  )}
                  inputClassName='typo-text-field w-full text-gray9'
                  placeholder={block.placeholder ?? DEFAULT_BLOCK_PLACEHOLDER}
                />
              </div>
            </div>
          </div>
          <DropIndicator
            visible={canShowInsideHint}
            place='after'
            gap={0}
            variant='child'
          />
        </div>

        {block.children.length > 0 && (
          <div
            className='ml-[24px] flex flex-col gap-[2px]'
            onDragOver={level === 4 ? onDragOverInsideOnly : undefined}
            onDrop={level === 4 ? onDropInsideOnly : undefined}
          >
            {block.children.map((child, i) => (
              <ExperienceListBlockNode
                key={child.id}
                block={child}
                level={level + 1}
                parentKind={block.kind}
                index={i}
              />
            ))}
          </div>
        )}
        <DropIndicator
          visible={hint === 'after'}
          place='after'
          gap={rowGap}
          variant='sibling'
        />
      </div>
    </div>
  );
}

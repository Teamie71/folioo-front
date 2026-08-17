'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { HoverTooltip } from '@/components/HoverTooltip';
import { ExperienceListViewSwitchToggle } from '@/features/experience/list/components/ExperienceListViewSwitchToggle';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';
import {
  editSessionCanRedo,
  editSessionCanUndo,
  getEditSessionVersion,
  runListRedo,
  runListUndo,
  subscribeEditSession,
} from '@/features/experience/list/utils/editSessionUndo';
import { ListDeleteIcon } from '@/components/icons/ListDeleteIcon';
import { ListViewIcon } from '@/components/icons/ListViewIcon';
import { RedoIcon } from '@/components/icons/RedoIcon';
import { SidebarPanelIcon } from '@/components/icons/SidebarPanelIcon';
import { UndoIcon } from '@/components/icons/UndoIcon';

const SIDEBAR_CLOSE_MS = 300;

type Props = {
  experienceId: string | undefined;
  /** 뷰 상태의 원본은 URL이다. workspace shell에서 내려준다. */
  view: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  onViewIntent?: () => void;
  /**
   * 맵 뷰처럼 본문이 툴바 아래까지 이어지는 경우 true.
   * 툴바가 배경 없이 본문 위에 떠 있고, 버튼이 없는 빈 영역은
   * 아래의 맵을 그대로 드래그/스크롤할 수 있도록 클릭을 통과시킨다.
   */
  overlay?: boolean;
};

export function ExperienceListToolbar({
  experienceId,
  view,
  onViewChange,
  onViewIntent,
  overlay = false,
}: Props) {
  const sidebarOpen = useExperienceListStore((s) => s.sidebarOpen);
  const agentOpen = useExperienceListStore((s) => s.agentOpen);
  const toggleSidebar = useExperienceListStore((s) => s.toggleSidebar);
  const toggleAgent = useExperienceListStore((s) => s.toggleAgent);
  const openModal = useExperienceListStore((s) => s.openModal);
  const undo = useExperienceListStore((s) => s.undo);
  const redo = useExperienceListStore((s) => s.redo);
  const pastLen = useExperienceListStore((s) => s.past.length);
  const futureLen = useExperienceListStore((s) => s.future.length);
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const startBlockSelection = useExperienceListStore(
    (s) => s.startBlockSelection,
  );
  const cancelBlockSelection = useExperienceListStore(
    (s) => s.cancelBlockSelection,
  );
  const selectedCount = useExperienceListStore(
    (s) => Object.keys(s.selectedBlockIds).length,
  );
  // 그룹이 포함되면 '미분류로 이동' 안내가 붙은 모달(3-6)을 띄워야 한다.
  const hasSelectedGroup = useExperienceListStore((s) =>
    Object.keys(s.selectedBlockIds).some((id) => id.startsWith('g:')),
  );
  useSyncExternalStore(
    subscribeEditSession,
    getEditSessionVersion,
    getEditSessionVersion,
  );

  const wasSidebarOpenRef = useRef(sidebarOpen);
  const [showOpenButton, setShowOpenButton] = useState(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) {
      wasSidebarOpenRef.current = true;
      setShowOpenButton(false);
      return;
    }

    const closing = wasSidebarOpenRef.current;
    wasSidebarOpenRef.current = false;

    if (!closing) {
      setShowOpenButton(true);
      return;
    }

    const id = window.setTimeout(
      () => setShowOpenButton(true),
      SIDEBAR_CLOSE_MS,
    );
    return () => window.clearTimeout(id);
  }, [sidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [contenteditable="true"]'))
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'z' && e.shiftKey) {
        e.preventDefault();
        runListRedo(redo);
        return;
      }
      if (key === 'z') {
        e.preventDefault();
        runListUndo(undo);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [undo, redo]);

  return (
    <header
      className={cn(
        'flex h-[79px] shrink-0 items-center justify-between px-[20px]',
        overlay && 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-[20px]',
          overlay && 'pointer-events-auto',
        )}
      >
        {showOpenButton && (
          <HoverTooltip
            label='클릭하여 나의 경험 탭 열기'
            placement='bottom'
            align='start'
            suppressUntilPointerLeave
          >
            <button
              type='button'
              onClick={toggleSidebar}
              className='flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] p-[2px] hover:bg-white'
              aria-label='나의 경험 탭 열기'
            >
              <ListViewIcon className='size-[28px]' />
            </button>
          </HoverTooltip>
        )}

        <ExperienceListViewSwitchToggle
          value={view}
          onValueChange={onViewChange}
          onOptionIntent={onViewIntent}
        />

        <div className='flex items-center gap-[4px]'>
          <button
            type='button'
            onClick={() => runListUndo(undo)}
            disabled={pastLen === 0 && !editSessionCanUndo()}
            className='border-gray5 flex size-[28px] cursor-pointer items-center justify-center rounded-[6px] border bg-white disabled:pointer-events-none disabled:opacity-50'
            aria-label='실행 취소'
          >
            <UndoIcon className='size-[20px]' />
          </button>
          <button
            type='button'
            onClick={() => runListRedo(redo)}
            disabled={futureLen === 0 && !editSessionCanRedo()}
            className='border-gray5 flex size-[28px] cursor-pointer items-center justify-center rounded-[6px] border bg-white disabled:pointer-events-none disabled:opacity-50'
            aria-label='다시 실행'
          >
            <RedoIcon className='size-[20px]' />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-[12px]',
          overlay && 'pointer-events-auto',
        )}
      >
        {view === 'map' ? (
          blockSelectionMode ? (
            <>
              <button
                type='button'
                onClick={cancelBlockSelection}
                className='border-gray4 hover:bg-gray2 flex h-[38px] cursor-pointer items-center rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors'
              >
                <span className='typo-b2 text-gray9 text-center'>
                  삭제 취소
                </span>
              </button>
              <button
                type='button'
                disabled={selectedCount === 0}
                onClick={() =>
                  openModal({
                    type: hasSelectedGroup
                      ? 'selection-delete-with-group'
                      : 'selection-delete',
                  })
                }
                className='bg-error-sub flex h-[38px] cursor-pointer items-center rounded-[6px] px-[12px] py-[6px] transition-opacity disabled:pointer-events-none disabled:opacity-50'
              >
                <span className='typo-b2 text-gray9 text-center'>
                  선택한 {selectedCount}개의 블록 삭제
                </span>
              </button>
            </>
          ) : (
            <HoverTooltip label='여러 개의 블록을 선택하여 한 번에 삭제'>
              <button
                type='button'
                onClick={startBlockSelection}
                className='border-gray4 hover:bg-gray2 flex h-[38px] cursor-pointer items-center gap-[4px] rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors'
              >
                <ListDeleteIcon className='size-[20px]' />
                <span className='typo-b2 text-gray9 text-center'>
                  블록 선택 삭제
                </span>
              </button>
            </HoverTooltip>
          )
        ) : experienceId ? (
          <button
            type='button'
            onClick={() =>
              openModal({
                type: 'experience-delete',
                experienceId,
              })
            }
            className='border-gray4 hover:bg-gray2 flex h-[38px] cursor-pointer items-center gap-[4px] rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors'
          >
            <ListDeleteIcon className='size-[20px]' />
            <span className='typo-b2 text-gray9 text-center'>활동 삭제</span>
          </button>
        ) : null}
        {!agentOpen && (
          <button
            type='button'
            onClick={toggleAgent}
            className='flex size-[32px] cursor-pointer items-center justify-center rounded-[8px]'
            aria-label='AI 에이전트 열기'
          >
            <SidebarPanelIcon className='size-[20px]' />
          </button>
        )}
      </div>
    </header>
  );
}

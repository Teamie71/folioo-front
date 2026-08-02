'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { HoverTooltip } from '@/components/HoverTooltip';
import { ExperienceListViewSwitchToggle } from '@/features/experience/list/components/ExperienceListViewSwitchToggle';
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
};

export function ExperienceListToolbar({ experienceId }: Props) {
  const viewMode = useExperienceListStore((s) => s.viewMode);
  const sidebarOpen = useExperienceListStore((s) => s.sidebarOpen);
  const agentOpen = useExperienceListStore((s) => s.agentOpen);
  const setViewMode = useExperienceListStore((s) => s.setViewMode);
  const toggleSidebar = useExperienceListStore((s) => s.toggleSidebar);
  const toggleAgent = useExperienceListStore((s) => s.toggleAgent);
  const openModal = useExperienceListStore((s) => s.openModal);
  const undo = useExperienceListStore((s) => s.undo);
  const redo = useExperienceListStore((s) => s.redo);
  const pastLen = useExperienceListStore((s) => s.past.length);
  const futureLen = useExperienceListStore((s) => s.future.length);
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
    <header className='flex h-[79px] shrink-0 items-center justify-between px-[20px]'>
      <div className='flex items-center gap-[20px]'>
        {showOpenButton && (
          <HoverTooltip
            label='클릭하여 나의 활동 탭 열기'
            placement='bottom'
            align='start'
            suppressUntilPointerLeave
          >
            <button
              type='button'
              onClick={toggleSidebar}
              className='flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] p-[2px] hover:bg-white'
              aria-label='나의 활동 탭 열기'
            >
              <ListViewIcon className='size-[28px]' />
            </button>
          </HoverTooltip>
        )}

        <ExperienceListViewSwitchToggle
          value={viewMode}
          onValueChange={setViewMode}
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

      <div className='flex items-center gap-[12px]'>
        {experienceId ? (
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

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { HoverTooltip } from '@/features/experience/list/components/HoverTooltip';
import { ListDeleteIcon } from '@/components/icons/ListDeleteIcon';
import { ListViewIcon } from '@/components/icons/ListViewIcon';
import { RedoIcon } from '@/components/icons/RedoIcon';
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
  const openModal = useExperienceListStore((s) => s.openModal);
  const undo = useExperienceListStore((s) => s.undo);
  const redo = useExperienceListStore((s) => s.redo);
  const pastLen = useExperienceListStore((s) => s.past.length);
  const futureLen = useExperienceListStore((s) => s.future.length);

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

    const id = window.setTimeout(() => setShowOpenButton(true), SIDEBAR_CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [sidebarOpen]);

  return (
    <header
      className={cn(
        'flex h-[79px] shrink-0 items-center justify-between pl-[20px]',
        agentOpen ? 'pr-[20px]' : 'pr-[72px]',
      )}
    >
      <div className='flex items-center gap-[20px]'>
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
              className='flex size-[32px] items-center justify-center rounded-[6px] p-[2px] hover:bg-white'
              aria-label='나의 경험 탭 열기'
            >
              <ListViewIcon className='size-[28px]' />
            </button>
          </HoverTooltip>
        )}

        <div className='bg-gray3 relative flex h-[29px] w-[158px] overflow-hidden rounded-[6px]'>
          <button
            type='button'
            onClick={() => setViewMode('map')}
            className={cn(
              'flex h-full flex-1 items-center justify-center rounded-[6px] px-[20px] py-[4px]',
              viewMode === 'map' ? 'bg-main' : 'bg-gray3',
            )}
          >
            <span
              className={cn(
                'whitespace-nowrap',
                viewMode === 'map'
                  ? 'typo-c1-sb text-white'
                  : 'typo-c1-b text-gray6',
              )}
            >
              맵 뷰
            </span>
          </button>
          <button
            type='button'
            onClick={() => setViewMode('list')}
            className={cn(
              'flex h-full flex-1 items-center justify-center rounded-[6px] px-[20px] py-[4px]',
              viewMode === 'list' ? 'bg-main' : 'bg-gray3',
            )}
          >
            <span
              className={cn(
                'whitespace-nowrap',
                viewMode === 'list'
                  ? 'typo-c1-sb text-white'
                  : 'typo-c1-b text-gray6',
              )}
            >
              리스트 뷰
            </span>
          </button>
        </div>

        <div className='flex items-center gap-[4px]'>
          <button
            type='button'
            onClick={undo}
            disabled={pastLen === 0}
            className='border-gray5 flex size-[28px] items-center justify-center rounded-[6px] border bg-white disabled:opacity-40'
            aria-label='실행 취소'
          >
            <UndoIcon className='size-[20px]' />
          </button>
          <button
            type='button'
            onClick={redo}
            disabled={futureLen === 0}
            className='border-gray5 flex size-[28px] items-center justify-center rounded-[6px] border bg-white disabled:opacity-40'
            aria-label='다시 실행'
          >
            <RedoIcon className='size-[20px]' />
          </button>
        </div>
      </div>

      <div className='flex h-[38px] items-center'>
        {experienceId ? (
          <button
            type='button'
            onClick={() =>
              openModal({
                type: 'experience-delete',
                experienceId,
              })
            }
            className='border-gray4 hover:bg-gray2 flex h-[38px] items-center gap-[4px] rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors'
          >
            <ListDeleteIcon className='size-[20px]' />
            <span className='typo-b2 text-gray9 text-center'>경험 삭제</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}

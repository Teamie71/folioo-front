'use client';

import Image from 'next/image';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { EXPERIENCE_LIST_ASSET } from '@/features/experience/list/constants';
import { HoverTooltip } from '@/features/experience/list/components/ui/HoverTooltip';

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

  return (
    <header
      className={cn(
        'flex h-[79px] shrink-0 items-center justify-between pl-[20px]',
        agentOpen ? 'pr-[20px]' : 'pr-[72px]',
      )}
    >
      <div className='flex items-center gap-[20px]'>
        {!sidebarOpen && (
          <HoverTooltip
            label='클릭하여 나의 경험 탭 열기'
            placement='bottom'
            align='start'
          >
            <button
              type='button'
              onClick={toggleSidebar}
              className='flex size-[32px] items-center justify-center rounded-[6px] p-[2px] hover:bg-white'
              aria-label='나의 경험 탭 열기'
            >
              <span className='relative size-[28px] overflow-hidden'>
                <Image
                  src={`${EXPERIENCE_LIST_ASSET}/icon-list-view.svg`}
                  alt=''
                  fill
                  className='object-contain'
                  unoptimized
                />
              </span>
            </button>
          </HoverTooltip>
        )}

        <div className='relative flex h-[29px] w-[158px] overflow-hidden rounded-[6px] bg-gray3'>
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
            className='flex size-[28px] items-center justify-center rounded-[6px] border border-gray5 bg-white disabled:opacity-40'
            aria-label='실행 취소'
          >
            <span className='relative size-[20px] overflow-hidden'>
              <Image
                src={`${EXPERIENCE_LIST_ASSET}/icon-undo.svg`}
                alt=''
                fill
                className='object-contain'
                unoptimized
              />
            </span>
          </button>
          <button
            type='button'
            onClick={redo}
            disabled={futureLen === 0}
            className='flex size-[28px] items-center justify-center rounded-[6px] border border-gray5 bg-white disabled:opacity-40'
            aria-label='다시 실행'
          >
            <span className='relative size-[20px] overflow-hidden'>
              <Image
                src={`${EXPERIENCE_LIST_ASSET}/icon-redo.svg`}
                alt=''
                fill
                className='object-contain'
                unoptimized
              />
            </span>
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
            className='flex h-[38px] items-center gap-[4px] rounded-[6px] border border-gray4 bg-white px-[12px] py-[6px] transition-colors hover:bg-gray2'
          >
            <span className='relative size-[20px] overflow-hidden'>
              <Image
                src={`${EXPERIENCE_LIST_ASSET}/icon-delete.svg`}
                alt=''
                fill
                className='object-contain'
                unoptimized
              />
            </span>
            <span className='typo-b2 text-center text-gray9'>경험 삭제</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}

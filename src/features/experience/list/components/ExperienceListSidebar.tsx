'use client';

import Image from 'next/image';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { ExperienceListSidebarGroup } from '@/features/experience/list/components/ExperienceListSidebarGroup';
import { SIDEBAR_ASSET } from '@/features/experience/list/components/sidebarStyles';
import { useSidebarDnd } from '@/features/experience/list/hooks/useSidebarDnd';

export function ExperienceListSidebar() {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const selection = useExperienceListStore((s) => s.selection);
  const collapsedGroups = useExperienceListStore((s) => s.collapsedGroups);
  const toggleSidebar = useExperienceListStore((s) => s.toggleSidebar);

  const dnd = useSidebarDnd();

  const selectedExperienceId =
    selection?.kind === 'experience' ? selection.id : null;
  const selectedGroupId = selection?.kind === 'group' ? selection.id : null;

  return (
    <aside
      data-experience-sidebar
      className='flex h-full w-[240px] shrink-0 flex-col border-r border-gray3 bg-white'
    >
      <div className='flex items-center justify-between px-[20px] pt-[30px] pb-[22px]'>
        <h2 className='typo-b2-b text-gray9'>나의 경험</h2>
        <button
          type='button'
          onClick={toggleSidebar}
          className='flex size-[32px] items-center justify-center rounded-[6px] p-[2px]'
          aria-label='나의 경험 탭 닫기'
        >
          <span className='relative size-[28px] overflow-hidden'>
            <Image
              src={`${SIDEBAR_ASSET}/icon-list-view.svg`}
              alt=''
              fill
              className='object-contain'
              unoptimized
            />
          </span>
        </button>
      </div>

      <div
        className='flex flex-col gap-[4px] overflow-x-hidden overflow-y-auto px-[15px] pb-[24px]'
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => dnd.clearDrag()}
      >
        {groups.map((group) => (
          <ExperienceListSidebarGroup
            key={group.id}
            group={group}
            groups={groups}
            groupExperiences={experiences.filter((e) => e.groupId === group.id)}
            collapsed={collapsedGroups[group.id] ?? false}
            selectedGroupId={selectedGroupId}
            selectedExperienceId={selectedExperienceId}
            dnd={dnd}
          />
        ))}
      </div>
    </aside>
  );
}

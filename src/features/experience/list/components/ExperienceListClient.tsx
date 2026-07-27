'use client';

import { ExperienceListSidebar } from '@/features/experience/list/components/ExperienceListSidebar';
import { ExperienceListMainPanel } from '@/features/experience/list/components/ExperienceListMainPanel';
import { ExperienceListAgentPanel } from '@/features/experience/list/components/ExperienceListAgentPanel';
import { ExperienceListModals } from '@/features/experience/list/components/ExperienceListModals';
import { useExperienceListStore } from '@/store/useExperienceListStore';

function CommonSidebarSlot() {
  return (
    <aside
      className='flex h-full w-[60px] shrink-0 flex-col items-center border-r border-gray3 bg-white pt-[32px]'
      aria-hidden
    />
  );
}

export default function ExperienceListClient() {
  const sidebarOpen = useExperienceListStore((s) => s.sidebarOpen);

  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-white'>
      <CommonSidebarSlot />

      <div className='relative flex min-w-0 flex-1 overflow-hidden'>
        {sidebarOpen && <ExperienceListSidebar />}
        <ExperienceListMainPanel />
        <ExperienceListAgentPanel />
      </div>

      <ExperienceListModals />
    </div>
  );
}

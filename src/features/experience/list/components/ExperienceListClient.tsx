'use client';

import { ExperienceListSidebar } from '@/features/experience/list/components/ExperienceListSidebar';
import { ExperienceListMainPanel } from '@/features/experience/list/components/ExperienceListMainPanel';
import { ExperienceListAgentPanel } from '@/features/experience/list/components/ExperienceListAgentPanel';
import { ExperienceListModals } from '@/features/experience/list/components/ExperienceListModals';

export default function ExperienceListClient() {
  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-white'>
      <div className='relative flex min-w-0 flex-1 overflow-hidden'>
        <ExperienceListSidebar />
        <ExperienceListMainPanel />
        <ExperienceListAgentPanel />
      </div>

      <ExperienceListModals />
    </div>
  );
}

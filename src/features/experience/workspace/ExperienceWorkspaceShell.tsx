'use client';

import dynamic from 'next/dynamic';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { ExperienceListSidebar } from '@/features/experience/list/components/ExperienceListSidebar';
import { ExperienceListAgentPanel } from '@/features/experience/list/components/ExperienceListAgentPanel';
import { ExperienceListModals } from '@/features/experience/list/components/ExperienceListModals';
import { ExperienceListToolbar } from '@/features/experience/list/components/ExperienceListToolbar';
import { ExperienceListView } from '@/features/experience/workspace/views/ExperienceListView';
import { MapViewSkeleton } from '@/features/experience/workspace/views/MapViewSkeleton';
import { useWorkspaceView } from '@/features/experience/workspace/hooks/useWorkspaceView';
import { usePreloadMapView } from '@/features/experience/workspace/hooks/usePreloadMapView';
import { preloadExperienceMapView } from '@/features/experience/workspace/model/mapViewLoader';

const ExperienceMapView = dynamic(
  () =>
    import('@/features/experience/workspace/views/ExperienceMapView').then(
      (m) => m.ExperienceMapView,
    ),
  {
    ssr: false,
    loading: () => <MapViewSkeleton />,
  },
);

/**
 * 사이드바 / 툴바 / AI 패널 / 모달은 계속 마운트한 상태로 두고,
 * 중앙 뷰만 URL의 view 값에 따라 교체한다.
 */
export function ExperienceWorkspaceShell() {
  const { view, setView } = useWorkspaceView();

  // 툴바의 "활동 삭제" 노출 조건. 원시값만 구독해 shell 리렌더를 최소화한다.
  const experienceId = useExperienceListStore((s) => {
    const selection = s.selection;
    if (selection?.kind !== 'experience') return undefined;
    return s.experiences.some((e) => e.id === selection.id)
      ? selection.id
      : undefined;
  });

  usePreloadMapView(view === 'list');

  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-white'>
      <div className='relative flex min-w-0 flex-1 overflow-hidden'>
        <ExperienceListSidebar />

        <section className='relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white'>
          <ExperienceListToolbar
            experienceId={experienceId}
            view={view}
            onViewChange={setView}
            onViewIntent={preloadExperienceMapView}
          />

          {view === 'map' ? <ExperienceMapView /> : <ExperienceListView />}
        </section>

        <ExperienceListAgentPanel />
      </div>

      <ExperienceListModals />
    </div>
  );
}

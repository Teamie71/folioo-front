'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { ExperienceListSidebar } from '@/features/experience/list/components/ExperienceListSidebar';
import { ExperienceListAgentPanel } from '@/features/experience/list/components/ExperienceListAgentPanel';
import { ExperienceListModals } from '@/features/experience/list/components/ExperienceListModals';
import { ExperienceListToolbar } from '@/features/experience/list/components/ExperienceListToolbar';
import { ExperienceListView } from '@/features/experience/workspace/views/ExperienceListView';
import { MapViewSkeleton } from '@/features/experience/workspace/views/MapViewSkeleton';
import { useExperienceMap } from '@/features/experience/list/hooks/useExperienceMap';
import { useGuestExperienceMode } from '@/features/experience/list/hooks/useGuestExperienceMode';
import { GuestLoginSnackbar } from '@/features/experience/list/components/GuestLoginSnackbar';
import { GuestLeaveGuardModal } from '@/features/experience/list/components/GuestLeaveGuardModal';
import { useWorkspaceView } from '@/features/experience/workspace/hooks/useWorkspaceView';
import { useExperienceAgentDeepLink } from '@/features/experience/workspace/hooks/useExperienceAgentDeepLink';
import { usePreloadMapView } from '@/features/experience/workspace/hooks/usePreloadMapView';
import { preloadExperienceMapView } from '@/features/experience/workspace/model/mapViewLoader';
import { saveExperienceSelection } from '@/features/experience/list/model/experienceSelectionStorage';
import { useAuthStore } from '@/store/useAuthStore';

const ExperienceMapView = dynamic(
  () =>
    import('@/features/experience/workspace/views/ExperienceMapView').then(
      (m) => m.ExperienceMapView,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

/**
 * 사이드바 / 툴바 / AI 패널 / 모달은 계속 마운트한 상태로 두고,
 * 중앙 뷰만 URL의 view 값에 따라 교체한다.
 */
export function ExperienceWorkspaceShell() {
  const { view, setView } = useWorkspaceView();
  const [mapFocusExperienceId, setMapFocusExperienceId] = useState<
    string | undefined
  >();
  const [mapReady, setMapReady] = useState(false);
  const markMapReady = useCallback(() => setMapReady(true), []);

  // GET /experience-map 으로 그룹·활동·블록 트리를 채운다. (비로그인은 기본 제공 데이터)
  const { isGuest, isLoading } = useExperienceMap();
  const openLinkedAgent = useCallback(() => {
    const state = useExperienceListStore.getState();
    if (!state.agentOpen) state.toggleAgent();
  }, []);
  useExperienceAgentDeepLink(isLoading, openLinkedAgent);
  const guest = useGuestExperienceMode(isGuest);

  useEffect(() => {
    let lastSelection = useExperienceListStore.getState().selection;
    let lastOwnerKey: string | undefined;
    let persisted = false;
    const persistSelection = () => {
      const state = useExperienceListStore.getState();
      if (state.isContentLoading || state.groups.length === 0) return;
      const ownerKey = useAuthStore.getState().accessToken
        ? state.groups.find((group) => group.isUnclassified)?.id
        : 'guest';
      if (
        persisted &&
        lastSelection === state.selection &&
        lastOwnerKey === ownerKey
      )
        return;
      saveExperienceSelection(ownerKey, state.selection);
      lastSelection = state.selection;
      lastOwnerKey = ownerKey;
      persisted = true;
    };
    persistSelection();
    return useExperienceListStore.subscribe(persistSelection);
  }, []);

  // 툴바의 "활동 삭제" 노출 조건. 원시값만 구독해 shell 리렌더를 최소화한다.
  const experienceId = useExperienceListStore((s) => {
    const selection = s.selection;
    if (selection?.kind !== 'experience') return undefined;
    return s.experiences.some((e) => e.id === selection.id)
      ? selection.id
      : undefined;
  });

  usePreloadMapView(view === 'list');

  const changeView = useCallback(
    (next: 'list' | 'map') => {
      if (next === 'map' && view === 'list') {
        setMapFocusExperienceId(experienceId);
      }
      setView(next);
    },
    [experienceId, setView, view],
  );

  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-white'>
      <div className='relative flex min-w-0 flex-1 overflow-hidden'>
        <ExperienceListSidebar />

        <section className='relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white'>
          {/*
            맵 뷰에서는 캔버스가 화면 전체 높이를 쓰고 툴바가 그 위에 떠 있다.
            툴바가 흐름에서 자리를 차지하면 그만큼 맵이 잘려 보이기 때문이다.
          */}
          <div
            className={
              view === 'map'
                ? 'pointer-events-none absolute inset-x-0 top-0 z-10'
                : undefined
            }
          >
            <ExperienceListToolbar
              experienceId={experienceId}
              view={view}
              onViewChange={changeView}
              onViewIntent={preloadExperienceMapView}
              overlay={view === 'map'}
            />
          </div>

          {view === 'map' ? (
            <div className='relative flex min-h-0 flex-1 flex-col'>
              {!isLoading && (
                <ExperienceMapView
                  focusExperienceId={mapFocusExperienceId}
                  onReady={markMapReady}
                />
              )}
              {!mapReady && (
                <div className='absolute inset-0 z-10 flex flex-col bg-white'>
                  <MapViewSkeleton />
                </div>
              )}
            </div>
          ) : (
            <ExperienceListView />
          )}

          {/* 로그인 안내 스낵바 (0-1) — 편집 영역 하단 기준 40px 위 */}
          {guest.snackbarOpen && (
            <GuestLoginSnackbar
              onLogin={guest.goToLogin}
              onDismiss={guest.dismissSnackbar}
            />
          )}
        </section>

        <ExperienceListAgentPanel view={view} />
      </div>

      <ExperienceListModals />

      {/* 이탈 방지 모달 (0-2) */}
      <GuestLeaveGuardModal
        open={guest.leaveGuardOpen}
        onOpenChange={guest.onLeaveGuardOpenChange}
        onLogin={guest.goToLogin}
        onLeave={guest.onLeave}
      />
    </div>
  );
}

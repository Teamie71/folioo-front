'use client';

import { useEffect } from 'react';
import { useExperienceMapAiControllerGetActivityStatuses } from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';
import { useAuthStore } from '@/store/useAuthStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { useAgentStatusStore } from '@/features/experience/list/model/agentStatusStore';
import { loadExperienceMap } from '@/features/experience/list/api/experienceMapSync';

/** 양쪽 활동 목록에 표시할 상태를 한 번에 읽고, 작업 중일 때만 재조회한다. */
export function useAgentSidebarStatuses() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isContentLoading = useExperienceListStore(
    (state) => state.isContentLoading,
  );
  const statuses = useAgentStatusStore((state) => state.byExperienceId);
  const syncFromServer = useAgentStatusStore((state) => state.syncFromServer);
  const reset = useAgentStatusStore((state) => state.reset);
  const query = useExperienceMapAiControllerGetActivityStatuses({
    query: {
      enabled: Boolean(accessToken) && !isContentLoading,
      staleTime: Infinity,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: (current) =>
        current.state.data?.result?.some((item) => item.status === 'running') ||
        Object.values(statuses).some((status) => status.kind === 'working')
          ? 5000
          : false,
    },
  });

  useEffect(() => {
    if (!accessToken) reset();
  }, [accessToken, reset]);

  useEffect(() => {
    if (!accessToken || !query.data?.result) return;
    const currentStatuses = useAgentStatusStore.getState().byExperienceId;
    const completed = query.data.result.some((item) => {
      const previous = currentStatuses[item.block_id];
      return (
        item.status === 'completed' &&
        previous?.kind === 'working' &&
        previous.requestId === item.request_id
      );
    });
    syncFromServer(query.data.result);
    if (completed) void loadExperienceMap();
  }, [accessToken, query.data, syncFromServer]);
}

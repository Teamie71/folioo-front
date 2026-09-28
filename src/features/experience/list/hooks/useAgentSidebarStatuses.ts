'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { useAgentStatusStore } from '@/features/experience/list/model/agentStatusStore';
import {
  readAgentRequestStatus,
  readAgentStatusSnapshot,
} from '@/features/experience/list/api/experienceAgentStatus';
import { loadExperienceMap } from '@/features/experience/list/api/experienceMapSync';

/** 양쪽 활동 목록에서 공유하는 에이전트 상태를 서버와 동기화한다. */
export function useAgentSidebarStatuses() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const experiences = useExperienceListStore((state) => state.experiences);
  const isContentLoading = useExperienceListStore(
    (state) => state.isContentLoading,
  );
  const statuses = useAgentStatusStore((state) => state.byExperienceId);
  const syncFromServer = useAgentStatusStore((state) => state.syncFromServer);
  const finish = useAgentStatusStore((state) => state.finish);
  const ids = experiences
    .map((experience) => experience.id)
    .filter((id) => /^\d+$/.test(id))
    .join(',');

  useEffect(() => {
    if (!accessToken || isContentLoading || !ids) return;
    let cancelled = false;
    const experienceIds = ids.split(',');
    let index = 0;
    // 활동 수가 많아도 티켓·세션 조회를 한꺼번에 보내지 않는다.
    const worker = async () => {
      while (!cancelled && index < experienceIds.length) {
        const id = experienceIds[index++];
        try {
          const status = await readAgentStatusSnapshot(id);
          if (!cancelled) syncFromServer(id, status);
        } catch {
          // 특정 활동 조회 실패가 나머지 활동의 상태 표시를 막지 않는다.
        }
      }
    };
    void Promise.all(
      Array.from({ length: Math.min(4, experienceIds.length) }, worker),
    );
    return () => {
      cancelled = true;
    };
  }, [accessToken, isContentLoading, ids, syncFromServer]);

  useEffect(() => {
    if (!accessToken) return;
    const pending = Object.entries(statuses).filter(
      ([, status]) => status.kind === 'working',
    );
    if (!pending.length) return;
    let cancelled = false;
    let polling = false;
    const poll = async () => {
      if (polling) return;
      polling = true;
      try {
        const results = await Promise.all(
          pending.map(async ([id, status]) => {
            try {
              const result = await readAgentRequestStatus(id, status.requestId);
              return { id, requestId: status.requestId, status: result.status };
            } catch {
              return null;
            }
          }),
        );
        if (cancelled) return;
        for (const result of results) {
          if (!result || result.status === 'running') continue;
          finish(
            result.id,
            result.requestId,
            result.status === 'completed' ? 'success' : 'error',
          );
        }
        if (results.some((result) => result?.status === 'completed'))
          void loadExperienceMap();
      } finally {
        polling = false;
      }
    };
    void poll();
    const interval = window.setInterval(() => void poll(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [accessToken, statuses, finish]);
}

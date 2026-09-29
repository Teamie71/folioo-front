import { create } from 'zustand/react';
import type { ActivityStatusResDTO } from '@/api/models/activityStatusResDTO';

export const AGENT_BUSY_MESSAGE =
  '현재 작업 중인 에이전트가 있어요. 작업이 완료되면 다시 시도해주세요.';

export type AgentStatus = {
  kind: 'working' | 'success' | 'error';
  requestId: string;
};

type AgentStatusState = {
  byExperienceId: Record<string, AgentStatus>;
  acknowledgedRequestIds: Record<string, string>;
  locallyStartedRequestIds: Record<string, string>;
  reservedExperienceId: string | null;
  reset: () => void;
  reserve: (experienceId: string) => boolean;
  release: (experienceId: string) => void;
  start: (experienceId: string, requestId: string) => void;
  finish: (
    experienceId: string,
    requestId: string,
    kind: 'success' | 'error',
  ) => void;
  clear: (experienceId: string) => void;
  acknowledge: (experienceId: string, requestId: string) => void;
  syncFromServer: (statuses: ActivityStatusResDTO[]) => void;
};

export const useAgentStatusStore = create<AgentStatusState>((set, get) => ({
  byExperienceId: {},
  acknowledgedRequestIds: {},
  locallyStartedRequestIds: {},
  reservedExperienceId: null,
  reset: () =>
    set({
      byExperienceId: {},
      acknowledgedRequestIds: {},
      locallyStartedRequestIds: {},
      reservedExperienceId: null,
    }),
  reserve: (experienceId) => {
    const state = get();
    if (
      state.reservedExperienceId ||
      Object.values(state.byExperienceId).some(
        (status) => status.kind === 'working',
      )
    )
      return false;
    set({ reservedExperienceId: experienceId });
    return true;
  },
  release: (experienceId) =>
    set((state) =>
      state.reservedExperienceId === experienceId
        ? { reservedExperienceId: null }
        : state,
    ),
  start: (experienceId, requestId) => {
    set((state) => {
      const acknowledgedRequestIds = { ...state.acknowledgedRequestIds };
      delete acknowledgedRequestIds[experienceId];
      return {
        acknowledgedRequestIds,
        locallyStartedRequestIds: {
          ...state.locallyStartedRequestIds,
          [experienceId]: requestId,
        },
        byExperienceId: {
          ...state.byExperienceId,
          [experienceId]: { kind: 'working', requestId },
        },
      };
    });
  },
  finish: (experienceId, requestId, kind) =>
    set((state) => {
      const current = state.byExperienceId[experienceId];
      if (current?.kind !== 'working' || current.requestId !== requestId)
        return state;
      if (state.acknowledgedRequestIds[experienceId] === requestId) {
        const next = { ...state.byExperienceId };
        delete next[experienceId];
        return { byExperienceId: next };
      }
      return {
        byExperienceId: {
          ...state.byExperienceId,
          [experienceId]: { kind, requestId },
        },
      };
    }),
  clear: (experienceId) =>
    set((state) => {
      if (!state.byExperienceId[experienceId]) return state;
      const next = { ...state.byExperienceId };
      const locallyStartedRequestIds = { ...state.locallyStartedRequestIds };
      delete next[experienceId];
      delete locallyStartedRequestIds[experienceId];
      return { byExperienceId: next, locallyStartedRequestIds };
    }),
  acknowledge: (experienceId, requestId) =>
    set((state) => {
      const current = state.byExperienceId[experienceId];
      if (
        !current ||
        current.kind === 'working' ||
        current.requestId !== requestId
      )
        return state;
      const next = { ...state.byExperienceId };
      delete next[experienceId];
      return {
        byExperienceId: next,
        acknowledgedRequestIds: {
          ...state.acknowledgedRequestIds,
          [experienceId]: current.requestId,
        },
      };
    }),
  syncFromServer: (statuses) =>
    set((state) => {
      const next: Record<string, AgentStatus> = {};
      const locallyStartedRequestIds = { ...state.locallyStartedRequestIds };
      const serverById = new Map(statuses.map((item) => [item.block_id, item]));
      for (const [experienceId, current] of Object.entries(
        state.byExperienceId,
      )) {
        const server = serverById.get(experienceId);
        // 티켓 발급 직후 이전 요청이 조회되면 새 작업의 표시를 유지한다.
        if (
          locallyStartedRequestIds[experienceId] === current.requestId &&
          (!server || server.request_id !== current.requestId)
        )
          next[experienceId] = current;
      }
      for (const item of statuses) {
        const current = state.byExperienceId[item.block_id];
        if (next[item.block_id]) continue;
        if (locallyStartedRequestIds[item.block_id] === item.request_id)
          delete locallyStartedRequestIds[item.block_id];
        if (
          current?.requestId === item.request_id &&
          current.kind !== 'working' &&
          item.status === 'running'
        ) {
          next[item.block_id] = current;
          continue;
        }
        if (item.status === 'running') {
          next[item.block_id] = {
            kind: 'working',
            requestId: item.request_id,
          };
        } else if (
          !item.seen &&
          state.acknowledgedRequestIds[item.block_id] !== item.request_id &&
          (item.status === 'completed' || item.status === 'failed')
        ) {
          next[item.block_id] = {
            kind: item.status === 'completed' ? 'success' : 'error',
            requestId: item.request_id,
          };
        }
      }
      const before = state.byExperienceId;
      if (
        Object.keys(before).length === Object.keys(next).length &&
        Object.entries(next).every(
          ([id, status]) =>
            before[id]?.kind === status.kind &&
            before[id]?.requestId === status.requestId,
        ) &&
        Object.keys(locallyStartedRequestIds).length ===
          Object.keys(state.locallyStartedRequestIds).length
      )
        return state;
      return { byExperienceId: next, locallyStartedRequestIds };
    }),
}));

import { create } from 'zustand/react';

export type AgentStatus = {
  kind: 'working' | 'success' | 'error';
  requestId: string;
};

const seenKey = (experienceId: string) =>
  `folioo:agent-status-seen:${experienceId}`;

function seenRequestId(experienceId: string) {
  try {
    return localStorage.getItem(seenKey(experienceId));
  } catch {
    return null;
  }
}

function saveSeenRequestId(experienceId: string, requestId: string) {
  try {
    localStorage.setItem(seenKey(experienceId), requestId);
  } catch {
    // 저장소를 사용할 수 없어도 현재 화면에서는 확인 처리를 유지한다.
  }
}

function forgetSeenRequestId(experienceId: string) {
  try {
    localStorage.removeItem(seenKey(experienceId));
  } catch {
    // 저장소를 사용할 수 없어도 작업 상태는 표시한다.
  }
}

type AgentStatusState = {
  byExperienceId: Record<string, AgentStatus>;
  start: (experienceId: string, requestId: string) => void;
  finish: (
    experienceId: string,
    requestId: string,
    kind: 'success' | 'error',
  ) => void;
  clear: (experienceId: string) => void;
  acknowledge: (experienceId: string) => void;
  syncFromServer: (experienceId: string, status: AgentStatus | null) => void;
};

export const useAgentStatusStore = create<AgentStatusState>((set) => ({
  byExperienceId: {},
  start: (experienceId, requestId) => {
    forgetSeenRequestId(experienceId);
    set((state) => ({
      byExperienceId: {
        ...state.byExperienceId,
        [experienceId]: { kind: 'working', requestId },
      },
    }));
  },
  finish: (experienceId, requestId, kind) =>
    set((state) => {
      const current = state.byExperienceId[experienceId];
      if (current?.kind !== 'working' || current.requestId !== requestId)
        return state;
      if (seenRequestId(experienceId) === requestId) {
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
      delete next[experienceId];
      return { byExperienceId: next };
    }),
  acknowledge: (experienceId) =>
    set((state) => {
      const current = state.byExperienceId[experienceId];
      if (!current || current.kind === 'working') return state;
      saveSeenRequestId(experienceId, current.requestId);
      const next = { ...state.byExperienceId };
      delete next[experienceId];
      return { byExperienceId: next };
    }),
  syncFromServer: (experienceId, status) =>
    set((state) => {
      const current = state.byExperienceId[experienceId];
      // 조회 중 새 요청이 시작됐다면 오래된 서버 응답으로 덮어쓰지 않는다.
      if (
        current?.kind === 'working' &&
        current.requestId !== status?.requestId
      )
        return state;
      if (
        current &&
        status &&
        current.requestId === status.requestId &&
        current.kind !== 'working' &&
        status.kind === 'working'
      )
        return state;
      if (!status) return state;
      if (status.kind === 'working') forgetSeenRequestId(experienceId);
      if (
        status.kind !== 'working' &&
        seenRequestId(experienceId) === status.requestId
      ) {
        if (!current) return state;
        const next = { ...state.byExperienceId };
        delete next[experienceId];
        return { byExperienceId: next };
      }
      if (
        current?.requestId === status.requestId &&
        current.kind === status.kind
      )
        return state;
      return {
        byExperienceId: { ...state.byExperienceId, [experienceId]: status },
      };
    }),
}));

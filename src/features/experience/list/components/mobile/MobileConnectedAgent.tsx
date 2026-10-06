'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getExperienceMapAiControllerGetActivityStatusesQueryKey } from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';
import { ExperienceAgentMain } from '@/features/experience/list/components/ExperienceAgentMain';
import { markAgentStatusSeen } from '@/features/experience/list/api/experienceAgentStatus';
import { useExperienceAgent } from '@/features/experience/list/hooks/useExperienceAgent';
import { useAgentStatusStore } from '@/features/experience/list/model/agentStatusStore';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';
import { useAuthStore } from '@/store/useAuthStore';

type Props = {
  experienceId: string;
  view: WorkspaceView;
};

export function MobileConnectedAgent({ experienceId, view }: Props) {
  const agent = useExperienceAgent(experienceId, view);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const status = useAgentStatusStore(
    (state) => state.byExperienceId[experienceId],
  );
  const acknowledge = useAgentStatusStore((state) => state.acknowledge);
  const queryClient = useQueryClient();
  const markedRequestId = useRef<string | null>(null);
  const markedOpen = useRef(false);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const terminal = status && status.kind !== 'working';
    if (terminal && markedRequestId.current === status.requestId) return;
    if (terminal) {
      markedRequestId.current = status.requestId;
    } else {
      if (markedOpen.current) return;
      markedOpen.current = true;
    }
    void markAgentStatusSeen(experienceId)
      .then(() => {
        if (!terminal) return;
        acknowledge(experienceId, status.requestId);
        void queryClient.invalidateQueries({
          queryKey: getExperienceMapAiControllerGetActivityStatusesQueryKey(),
        });
      })
      .catch(() => {
        if (terminal) markedRequestId.current = null;
        else markedOpen.current = false;
      });
  }, [accessToken, status, experienceId, acknowledge, queryClient]);

  return (
    <ExperienceAgentMain
      mobile
      conversation={agent.conversation}
      dailyChatCount={
        agent.limitReached ? agent.dailyChatLimit : (agent.dailyChatCount ?? 0)
      }
      dailyChatLimit={agent.dailyChatLimit}
      input={input}
      onInputChange={setInput}
      attachment={attachment}
      onAttachmentChange={setAttachment}
      onSend={agent.send}
      onStop={agent.stop}
      ready={agent.ready}
      historyLoading={
        !sessionRestoreAttempted ||
        (Boolean(accessToken) && !agent.historyLoaded)
      }
      isWorking={agent.isWorking}
      error={agent.error}
    />
  );
}

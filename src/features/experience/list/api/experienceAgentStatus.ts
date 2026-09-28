import { experienceMapAiControllerIssueReadTicket } from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';
import {
  getMessagesApiV1ExperienceMapSessionsSessionIdMessagesGet,
  getRequestStateApiV1ExperienceMapSessionsSessionIdRequestsRequestIdGet,
  getSessionStateApiV1ExperienceMapSessionsSessionIdStateGet,
} from '@/api/ai/endpoints/experience-map/experience-map';
import type { MessageItem } from '@/api/ai/models';
import type { AgentStatus } from '@/features/experience/list/model/agentStatusStore';

export async function issueAgentReadTicket(blockId: string) {
  const response = await experienceMapAiControllerIssueReadTicket({
    block_id: blockId,
  });
  if (!response.result)
    throw new Error('에이전트 조회용 티켓을 발급받지 못했어요.');
  return {
    ticket: response.result.ticket,
    sessionId: response.result.session_id,
  };
}

export async function readAgentRequestStatus(
  blockId: string,
  requestId: string,
) {
  const session = await issueAgentReadTicket(blockId);
  return getRequestStateApiV1ExperienceMapSessionsSessionIdRequestsRequestIdGet(
    session.sessionId,
    requestId,
    { headers: { Authorization: `Bearer ${session.ticket}` } },
  );
}

async function readLastMessage(sessionId: string, ticket: string) {
  let cursor: string | null | undefined;
  let last: MessageItem | undefined;
  do {
    const page =
      await getMessagesApiV1ExperienceMapSessionsSessionIdMessagesGet(
        sessionId,
        { limit: 200, ...(cursor ? { cursor } : {}) },
        { headers: { Authorization: `Bearer ${ticket}` } },
      );
    for (const item of page.messages) {
      if (!last || item.created_at >= last.created_at) last = item;
    }
    cursor = page.next_cursor;
  } while (cursor);
  return last;
}

/** 선택 여부와 무관하게 해당 활동 에이전트의 최신 서버 상태를 읽는다. */
export async function readAgentStatusSnapshot(
  blockId: string,
): Promise<AgentStatus | null> {
  const session = await issueAgentReadTicket(blockId);
  const headers = { headers: { Authorization: `Bearer ${session.ticket}` } };
  const state =
    await getSessionStateApiV1ExperienceMapSessionsSessionIdStateGet(
      session.sessionId,
      headers,
    );
  if (state.status === 'running' && state.active_request_id)
    return { kind: 'working', requestId: state.active_request_id };
  if (state.status === 'failed' && state.active_request_id)
    return { kind: 'error', requestId: state.active_request_id };

  const last = await readLastMessage(session.sessionId, session.ticket);
  if (!last) return null;
  if (state.status === 'failed' || last.status === 'failed')
    return { kind: 'error', requestId: last.request_id };
  if (last.ai_responses?.length)
    return { kind: 'success', requestId: last.request_id };
  return null;
}

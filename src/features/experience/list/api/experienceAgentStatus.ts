import {
  experienceMapAiControllerIssueReadTicket,
  experienceMapAiControllerMarkSeen,
} from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';

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

export async function markAgentStatusSeen(blockId: string) {
  const response = await experienceMapAiControllerMarkSeen(blockId);
  if (response.isSuccess === false)
    throw new Error('에이전트 결과를 확인 처리하지 못했어요.');
}

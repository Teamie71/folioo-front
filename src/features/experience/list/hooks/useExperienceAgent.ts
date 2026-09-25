'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  experienceMapAiControllerIssueTicket,
  experienceMapAiControllerRevert,
} from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';
import {
  cancelRequestApiV1ExperienceMapSessionsSessionIdRequestsRequestIdCancelPost,
  getMessagesApiV1ExperienceMapSessionsSessionIdMessagesGet,
  getRequestStateApiV1ExperienceMapSessionsSessionIdRequestsRequestIdGet,
  getSessionStateApiV1ExperienceMapSessionsSessionIdStateGet,
} from '@/api/ai/endpoints/experience-map/experience-map';
import type { MessageItem } from '@/api/ai/models';
import { loadExperienceMap } from '@/features/experience/list/api/experienceMapSync';
import {
  streamExperienceAgentChat,
  streamExperienceAgentRetry,
} from '@/features/experience/list/api/experienceAgentStream';
import type {
  AgentChatMessage,
  AgentConversation,
} from '@/features/experience/list/components/ExperienceAgentConversation';
import { useAuthStore } from '@/store/useAuthStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';

type SessionTicket = {
  ticket: string;
  sessionId: string;
  requestId: string;
};

function auth(ticket: string) {
  return { headers: { Authorization: `Bearer ${ticket}` } };
}

async function issueTicket(
  blockId: string,
  requestId?: string,
): Promise<SessionTicket> {
  const response = await experienceMapAiControllerIssueTicket({
    block_id: blockId,
    ...(requestId ? { request_id: requestId } : {}),
  });
  if (!response.result) throw new Error('에이전트 티켓을 발급받지 못했어요.');
  return {
    ticket: response.result.ticket,
    sessionId: response.result.session_id,
    requestId: response.result.request_id,
  };
}

async function readAllMessages(session: SessionTicket): Promise<MessageItem[]> {
  const messages: MessageItem[] = [];
  let cursor: string | null | undefined;
  do {
    const page =
      await getMessagesApiV1ExperienceMapSessionsSessionIdMessagesGet(
        session.sessionId,
        { limit: 200, ...(cursor ? { cursor } : {}) },
        auth(session.ticket),
      );
    messages.push(...page.messages);
    cursor = page.next_cursor;
  } while (cursor);
  return messages.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

async function waitForRequest(session: SessionTicket, signal: AbortSignal) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (signal.aborted)
      throw new DOMException('작업이 중지됐어요.', 'AbortError');
    const result =
      await getRequestStateApiV1ExperienceMapSessionsSessionIdRequestsRequestIdGet(
        session.sessionId,
        session.requestId,
        auth(session.ticket),
        signal,
      );
    if (result.status !== 'running') return result;
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('작업 상태를 확인하지 못했어요. 잠시 후 다시 확인해 주세요.');
}

function describeError(cause: unknown) {
  const status = (cause as { response?: { status?: number } })?.response
    ?.status;
  if (status === 401 || status === 403)
    return '에이전트에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';
  if (status === 429)
    return '오늘 사용 가능한 10회를 모두 사용했어요. 내일 다시 이어서 도와드릴게요.';
  if (status === 404)
    return '이 활동의 에이전트를 찾을 수 없어요. 화면을 새로고침해 주세요.';
  if (
    status != null ||
    (cause instanceof Error &&
      /^Request failed with status code/i.test(cause.message))
  )
    return '에이전트 연결에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
  return cause instanceof Error ? cause.message : '작업 중 오류가 발생했어요.';
}

function todayKst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function toChatMessages(items: MessageItem[]): AgentChatMessage[] {
  return items.flatMap((item) => {
    const result: AgentChatMessage[] = [];
    if (item.user_message || item.attachments?.length) {
      result.push({
        id: `${item.request_id}:user`,
        role: 'user',
        content: item.user_message ?? '',
        attachment: item.attachments?.[0]
          ? { name: item.attachments[0].filename }
          : undefined,
      });
    }
    if (item.status !== 'failed') {
      item.ai_responses?.forEach((content, index) =>
        result.push({
          id: `${item.request_id}:assistant:${index}`,
          role: 'assistant',
          content,
        }),
      );
    }
    return result;
  });
}

export function useExperienceAgent(blockId: string | undefined) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const revertibleRequestId = useExperienceListStore(
    (state) => state.revertibleRequestId,
  );
  const agentLimitDayKst = useExperienceListStore(
    (state) => state.agentLimitDayKst,
  );
  const setAgentLimitDayKst = useExperienceListStore(
    (state) => state.setAgentLimitDayKst,
  );
  const [session, setSession] = useState<SessionTicket | null>(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<MessageItem[]>([]);
  const [workingRequestId, setWorkingRequestId] = useState<string | null>(null);
  const [failedRequestId, setFailedRequestId] = useState<string | null>(null);
  const [failedNode, setFailedNode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<AgentChatMessage | null>(
    null,
  );
  const limitReached = agentLimitDayKst === todayKst();
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!limitReached) return;
    const kstOffset = 9 * 60 * 60 * 1000;
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const nextMidnight =
      Math.floor((now + kstOffset) / day + 1) * day - kstOffset;
    const timeout = window.setTimeout(
      () => setAgentLimitDayKst(null),
      nextMidnight - now,
    );
    return () => window.clearTimeout(timeout);
  }, [limitReached, setAgentLimitDayKst]);

  const refresh = useCallback(async (activeSession: SessionTicket) => {
    const [history, state] = await Promise.all([
      readAllMessages(activeSession),
      getSessionStateApiV1ExperienceMapSessionsSessionIdStateGet(
        activeSession.sessionId,
        auth(activeSession.ticket),
      ),
    ]);
    setItems(history);
    setPendingMessage(null);
    setWorkingRequestId(
      state.status === 'running' ? (state.active_request_id ?? null) : null,
    );
    setFailedRequestId(
      state.status === 'failed' && state.retryable
        ? (state.active_request_id ?? history.at(-1)?.request_id ?? null)
        : null,
    );
    setFailedNode(
      state.status === 'failed' ? (state.failed_node ?? 'unknown') : null,
    );
    return state;
  }, []);

  useEffect(() => {
    if (!blockId || !/^\d+$/.test(blockId) || !accessToken) return;
    let active = true;
    let ticketIssued = false;
    setReady(false);
    issueTicket(blockId)
      .then(async (next) => {
        if (!active) return;
        ticketIssued = true;
        setSession(next);
        const state = await refresh(next);
        if (active) setReady(true);
        if (state.status === 'running' && state.active_request_id) {
          const controller = new AbortController();
          abort.current = controller;
          const runningSession = {
            ...next,
            requestId: state.active_request_id,
          };
          const result = await waitForRequest(
            runningSession,
            controller.signal,
          );
          if (!active) return;
          await refresh(next);
          if (result.status === 'completed') await loadExperienceMap();
          abort.current = null;
        }
      })
      .catch((cause) => {
        if (
          active &&
          !(cause instanceof DOMException && cause.name === 'AbortError')
        ) {
          if (ticketIssued) setReady(true);
          if (
            (cause as { response?: { status?: number } })?.response?.status ===
            429
          )
            setAgentLimitDayKst(todayKst());
          setError(describeError(cause));
        }
      });
    return () => {
      active = false;
      abort.current?.abort();
    };
  }, [blockId, accessToken, refresh, setAgentLimitDayKst]);

  const send = useCallback(
    async (text: string, file: File | null, onAccepted: () => void) => {
      if (!blockId || !accessToken || workingRequestId || limitReached) return;
      setError(null);
      let next: SessionTicket;
      try {
        next = await issueTicket(blockId);
      } catch (cause) {
        if (
          (cause as { response?: { status?: number } })?.response?.status ===
          429
        )
          setAgentLimitDayKst(todayKst());
        throw new Error(describeError(cause));
      }
      setSession(next);
      setWorkingRequestId(next.requestId);
      setFailedRequestId(null);
      onAccepted();
      setPendingMessage({
        id: `${next.requestId}:pending`,
        role: 'user',
        content: text,
        attachment: file ? { name: file.name, size: file.size } : undefined,
      });
      const controller = new AbortController();
      abort.current = controller;
      try {
        await streamExperienceAgentChat({
          sessionId: next.sessionId,
          ticket: next.ticket,
          signal: controller.signal,
          body: { request: text, ...(file ? { files: [file] } : {}) },
          onEvent: () => {},
        });
        const result = await waitForRequest(next, controller.signal);
        await refresh(next);
        if (result.status === 'failed')
          throw new Error(
            result.error?.message ?? '작업 중 오류가 발생했어요.',
          );
        if (result.status === 'completed') await loadExperienceMap();
      } catch (cause) {
        if (!controller.signal.aborted) {
          try {
            await refresh(next);
          } catch {
            setPendingMessage(null);
          }
          setError(describeError(cause));
        }
        throw cause;
      } finally {
        setWorkingRequestId(null);
        abort.current = null;
      }
    },
    [
      blockId,
      accessToken,
      workingRequestId,
      limitReached,
      refresh,
      setAgentLimitDayKst,
    ],
  );

  const stop = useCallback(async () => {
    if (!session || !workingRequestId) return;
    await cancelRequestApiV1ExperienceMapSessionsSessionIdRequestsRequestIdCancelPost(
      session.sessionId,
      workingRequestId,
      auth(session.ticket),
    );
    abort.current?.abort();
    setWorkingRequestId(null);
  }, [session, workingRequestId]);

  const retry = useCallback(
    async (requestId: string) => {
      if (!blockId || !accessToken) return;
      const next = await issueTicket(blockId, requestId);
      setSession(next);
      setWorkingRequestId(requestId);
      setFailedRequestId(null);
      const controller = new AbortController();
      abort.current = controller;
      try {
        await streamExperienceAgentRetry({
          sessionId: next.sessionId,
          ticket: next.ticket,
          signal: controller.signal,
          body: { request_id: requestId },
          onEvent: () => {},
        });
        const result = await waitForRequest(next, controller.signal);
        await refresh(next);
        if (result.status === 'failed')
          throw new Error(result.error?.message ?? '다시 시도하지 못했어요.');
        if (result.status === 'completed') await loadExperienceMap();
      } catch (cause) {
        await refresh(next);
        throw cause;
      } finally {
        setWorkingRequestId(null);
        abort.current = null;
      }
    },
    [blockId, accessToken, refresh],
  );

  const revert = useCallback(async (requestId: string) => {
    const response = await experienceMapAiControllerRevert({
      request_id: requestId,
    });
    if (!response.result) throw new Error('이전으로 되돌리지 못했어요.');
    await loadExperienceMap();
  }, []);

  const messages = toChatMessages(items).map((message) => {
    if (
      message.role !== 'assistant' ||
      !revertibleRequestId ||
      !message.id.startsWith(`${revertibleRequestId}:`)
    )
      return message;
    return { ...message, onRevert: () => revert(revertibleRequestId) };
  });
  if (
    pendingMessage &&
    !messages.some((message) =>
      message.id.startsWith(`${pendingMessage.id.split(':')[0]}:`),
    )
  ) {
    messages.push(pendingMessage);
  }
  const conversation: AgentConversation = {
    messages,
    isWorking: Boolean(workingRequestId),
    ...(failedNode
      ? {
          failure: {
            nodeId: failedNode,
            ...(failedRequestId
              ? { onRetry: () => retry(failedRequestId) }
              : {}),
          },
        }
      : {}),
  };

  return {
    conversation,
    send,
    stop,
    ready,
    isWorking: Boolean(workingRequestId),
    limitReached,
    error,
  };
}

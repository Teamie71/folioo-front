'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  clearChatNewExperienceId,
  isChatNewExperience,
  setExperienceReturnPath,
  hasCreateloadingEntered,
  clearCreateloadingEntered,
  setChatHistory,
  getChatHistory,
  clearChatHistory,
} from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { usePortfolioCreationStore } from '@/store/usePortfolioCreationStore';
import {
  ChatMessageSection,
  type ChatMessage,
} from '@/features/experience/chat/components/ChatMessageSection';
import { ChatStepSection } from '@/features/experience/chat/components/ChatStepSection';
import type {
  ContentPart,
  FileItem,
} from '@/features/experience/chat/components/ChatInput';
import { ChatCompleteModal } from '@/features/experience/chat/components/ChatCompleteModal';
import { PortfolioCreateModal } from '@/features/experience/chat/components/PortfolioCreateModal';
import { fetchSSEStream } from '@/lib/sseStream';
import {
  getExperienceControllerGetExperienceQueryKey,
  getExperienceControllerGetExperiencesQueryKey,
  useExperienceControllerDeleteExperience,
  useExperienceControllerGetExperience,
  useExperienceControllerUpdateExperience,
} from '@/api/endpoints/experience/experience';
import {
  interviewControllerGetSessionState,
  useInterviewControllerGeneratePortfolio,
} from '@/api/endpoints/interview/interview';
import { getPortfolioControllerGetPortfolioQueryKey } from '@/api/endpoints/portfolio/portfolio';
import {
  GeneratePortfolioResDTO,
  InsightTurnHistoryItemResDTO,
  InterviewSessionStateResDTO,
} from '@/api/models';
import { ExperienceStateResDTOStatus } from '@/api/models/experienceStateResDTOStatus';
import { getExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';

const SESSION_STREAM_PATH = (experienceId: number) =>
  `/interview/experiences/${experienceId}/session/stream`;
const MESSAGES_STREAM_PATH = (experienceId: number) =>
  `/interview/experiences/${experienceId}/messages/stream`;
const EXTEND_STREAM_PATH = (experienceId: number) =>
  `/interview/experiences/${experienceId}/extend/stream`;

/* API currentStage(1~n) + allComplete → 그리드 단계 0~4 */
function toGridStep(currentStage: number, allComplete?: boolean): number {
  if (allComplete) return 4;
  return Math.min(Math.max(0, (currentStage ?? 1) - 1), 4);
}

function ExperienceSettingsChatContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const isNewExperience = searchParams.get('new') === '1';
  const experienceId = id ? Number(id) : NaN;
  const sessionAbortRef = useRef<AbortController | null>(null);

  const { data: experienceData } = useExperienceControllerGetExperience(
    experienceId,
    { query: { enabled: Number.isFinite(experienceId) } },
  );

  const newExperienceScheduleRef = useRef<number | null>(null);
  const removeExperience = useExperienceStore(
    (state) => state.removeExperience,
  );
  const updateExperienceTitle = useExperienceStore(
    (state) => state.updateExperienceTitle,
  );
  const storeTitle = useExperienceStore(
    (state) =>
      state.experienceCards.find((c) => c.id === id)?.title ??
      '새로운 경험 정리',
  );

  const experienceName = experienceData?.result?.name;
  const titleReady = experienceData?.result != null;
  const displayTitle = titleReady
    ? (experienceName ?? storeTitle ?? '새로운 경험 정리')
    : '';

  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isPortfolioCreateModalOpen, setIsPortfolioCreateModalOpen] =
    useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStreamError, setSessionStreamError] = useState<string | null>(
    null,
  );
  /* 새로고침 후 세션 스트림 실패 시 재시도: 증가시키면 세션 스트림 effect가 다시 실행됨 */
  const [sessionStreamKey, setSessionStreamKey] = useState(0);
  /* 인터뷰 단계 */
  const [currentStage, setCurrentStage] = useState(0);
  /* 2·3·4단계(grid 1,2,3) 진입 시에만 해당 단계 툴팁 표시. 진입한 단계 번호 또는 null */
  const [showTooltipForStep, setShowTooltipForStep] = useState<number | null>(
    null,
  );
  /* true면 0단계 진입 툴팁 미표시 (새로고침/복원 시). 새 대화 시작 시 false로 바꿔 툴팁 표시 */
  const [suppressStep0EntryTooltip, setSuppressStep0EntryTooltip] =
    useState(true);
  /* 조회 시 복원: 턴별 인사이트 이력 */
  const [insightTurnHistory, setInsightTurnHistory] = useState<
    InsightTurnHistoryItemResDTO[]
  >([]);
  /* SSE retriever 이벤트로 받은 턴별 인사이트 */
  const [insightsByTurn, setInsightsByTurn] = useState<
    Record<number, InsightTurnHistoryItemResDTO['insights']>
  >({});

  const prevStageRef = useRef(0);
  /* 3턴 이어가기 모드: true면 연장 세션 중 */
  const isExtendedSessionRef = useRef(false);
  /* 연장 세션에서 완료된 턴 수 (AI 응답 1회 = 1턴, 3턴이면 CompleteModal 오픈) */
  const extendedTurnCountRef = useRef(0);
  /* 연장 세션(3턴 블록)을 완료한 횟수 */
  const extendedSessionRoundsRef = useRef(0);
  const pollSessionStatusRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: generatePortfolio } =
    useInterviewControllerGeneratePortfolio();
  const { mutateAsync: updateExperience } =
    useExperienceControllerUpdateExperience();
  const setPendingPortfolio = usePortfolioCreationStore((s) => s.setPending);
  const setResolvedPortfolio = usePortfolioCreationStore((s) => s.setResolved);

  const startPolling = (expId: number) => {
    if (pollSessionStatusRef.current || !Number.isFinite(expId)) return;

    const poll = async () => {
      try {
        const res = await interviewControllerGetSessionState(expId);
        const list = res.result?.messages;
        if (list && list.length > 0) {
          const lastMsg = list[list.length - 1];
          // AI 답변이 도착했고 내용이 있는 경우에만 완료로 간주
          if (lastMsg.type === 'ai' && lastMsg.content) {
            const cached = getChatHistory<ChatMessage>(expId);
            const restoredMessages: ChatMessage[] = list.map((m, idx) => {
              const role = (m.type === 'ai' ? 'ai' : 'user') as 'ai' | 'user';
              const base: ChatMessage = {
                role,
                content: m.content ?? '',
              };
              const prev = cached?.[idx];
              if (prev && prev.role === role) {
                if (prev.files) base.files = prev.files;
                if (prev.contentParts) base.contentParts = prev.contentParts;
              }
              return base;
            });

            setMessages(restoredMessages);
            setChatHistory(expId, restoredMessages);
            setIsStreaming(false);
            pollSessionStatusRef.current = null;
            await syncStageFromServer();
            return;
          }
        }
        // 아직 생성 중이거나 도착하지 않음
        pollSessionStatusRef.current = setTimeout(poll, 2000);
      } catch {
        // 재시도
        pollSessionStatusRef.current = setTimeout(poll, 3000);
      }
    };

    poll();
  };

  useEffect(() => {
    if (!id || !Number.isFinite(experienceId)) return;
    if (experienceData === undefined) return;
    const experience = experienceData?.result;
    if (!experience) {
      router.replace('/experience');
      return;
    }
    const status = experience.status;
    if (status === ExperienceStateResDTOStatus.ON_CHAT) {
      // 생성 로딩(createloading) 진입 플래그가 남아있어도, 실제 상태가 ON_CHAT이면 chat 진입이 맞음
      clearCreateloadingEntered(id);
      return; // 이 페이지에 진입 허용
    }
    if (
      status === ExperienceStateResDTOStatus.GENERATE ||
      status === ExperienceStateResDTOStatus.GENERATE_FAILED
    ) {
      router.replace(`/experience/settings/${id}/createloading`);
      return;
    }
    if (status === ExperienceStateResDTOStatus.DONE) {
      clearCreateloadingEntered(id);
      router.replace(`/experience/settings/${id}/portfolio`);
      return;
    }
    clearCreateloadingEntered(id);
    router.replace('/experience');
  }, [id, experienceId, experienceData, router]);

  const syncStageFromServer = async (skipStageUpdate?: boolean) => {
    if (!Number.isFinite(experienceId)) return;
    try {
      const res = await interviewControllerGetSessionState(experienceId);
      if (skipStageUpdate) return; /* 3턴 연장 중에는 단계 갱신하지 않음 */
      const restoredStage = toGridStep(
        res.result?.currentStage ?? 1,
        res.result?.allComplete,
      );
      prevStageRef.current = restoredStage;
      setCurrentStage(restoredStage);
      if (restoredStage === 4) {
        setIsCompletionModalOpen(true);
      }
    } catch {}
  };

  const handleExtendedTurnDone = () => {
    if (!isExtendedSessionRef.current) return;
    extendedTurnCountRef.current += 1;
    if (extendedTurnCountRef.current < 3) return;
    isExtendedSessionRef.current = false;
    extendedTurnCountRef.current = 0;
    extendedSessionRoundsRef.current += 1;
    if (extendedSessionRoundsRef.current >= 2) {
      setIsPortfolioCreateModalOpen(true);
    } else {
      prevStageRef.current = 4;
      setCurrentStage(4); /* 다음 3턴 연장도 4단계 상태에서 진행 */
      setIsCompletionModalOpen(true);
    }
  };

  /* 단계가 다 채워지면( currentStage === 4 ) 완료 모달 */
  useEffect(() => {
    if (currentStage === 4 && prevStageRef.current !== 4) {
      setIsCompletionModalOpen(true);
    }
    prevStageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    if (titleReady) document.title = `${displayTitle} - Folioo`;
  }, [titleReady, displayTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'chat');
  }, [id]);

  useEffect(() => {
    if (showTooltipForStep == null) return;
    const t = setTimeout(() => setShowTooltipForStep(null), 2000);
    return () => clearTimeout(t);
  }, [showTooltipForStep]);

  /* 스트리밍이 3분 넘게 유지되면 오류 메시지 표시 */
  const STREAM_TIMEOUT_MS = 3 * 60 * 1000;
  useEffect(() => {
    if (!isStreaming) return;
    const t = setTimeout(() => {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'ai') {
          next[next.length - 1] = { ...last, content: '', isError: true };
        }
        return next;
      });
      setIsStreaming(false);
    }, STREAM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isStreaming]);

  // 진입 시: 세션 있으면 기존 대화 로드, 없으면 세션 스트림 시작. sessionStreamKey 변경 시 재시도.
  useEffect(() => {
    if (!id || Number.isNaN(experienceId)) return;

    sessionAbortRef.current = new AbortController();
    const signal = sessionAbortRef.current.signal;
    let cancelled = false;

    const startSessionStream = () => {
      if (cancelled) return;
      const initialMessage: ChatMessage = { role: 'ai', content: '' };
      setMessages([initialMessage]);
      setChatHistory(experienceId, [initialMessage]);
      setSessionStreamError(null);
      setIsStreaming(true);
      setInsightTurnHistory([]);
      setInsightsByTurn({});
      fetchSSEStream({
        path: SESSION_STREAM_PATH(experienceId),
        method: 'POST',
        signal,
        onEvent: (event: {
          delta?: { text?: string };
          message?: {
            ai_response?: string;
            current_stage?: number;
            all_complete?: boolean;
          };
        }) => {
          if (cancelled) return;
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last || last.role !== 'ai') return prev;
            if ('delta' in event && event.delta?.text) {
              next[next.length - 1] = {
                ...last,
                content: last.content + (event.delta.text ?? ''),
              };
              setChatHistory(experienceId, next);
              return next;
            }
            if ('message' in event && event.message?.ai_response != null) {
              next[next.length - 1] = {
                ...last,
                content: event.message.ai_response,
              };
              setChatHistory(experienceId, next);
              if (
                typeof event.message.current_stage === 'number' ||
                event.message.all_complete
              ) {
                const newStage = toGridStep(
                  event.message.current_stage ?? 1,
                  event.message.all_complete,
                );
                if (
                  newStage >= 1 &&
                  newStage <= 3 &&
                  newStage !== prevStageRef.current
                ) {
                  setShowTooltipForStep(newStage);
                }
                if (newStage === 4 && prevStageRef.current !== 4) {
                  prevStageRef.current = 4;
                  setIsCompletionModalOpen(true);
                }
                setCurrentStage(newStage);
              }
              return next;
            }
            return prev;
          });
        },
        onError: (err) => {
          if (cancelled) return;
          setSessionStreamError(err.message);
        },
        onDone: async () => {
          if (cancelled) return;
          setIsStreaming(false);
          await syncStageFromServer();
        },
      });
    };

    (async () => {
      if (sessionStreamKey > 0) {
        startSessionStream();
        return;
      }

      // 백엔드 히스토리 체크
      try {
        const res = await interviewControllerGetSessionState(experienceId);
        if (cancelled) return;
        const result = res?.result as InterviewSessionStateResDTO | undefined;
        const list = result?.messages;
        if (list && list.length > 0) {
          const cachedRaw = getChatHistory<ChatMessage>(experienceId);
          // Blob URL은 새로고침 후 무효화되므로 제거
          const cached = cachedRaw?.map((msg) => ({
            ...msg,
            files: msg.files?.map((f) => ({
              ...f,
              preview: f.preview?.startsWith('blob:') ? undefined : f.preview,
            })),
          }));

          const restoredMessages: ChatMessage[] = list.map((m, idx) => {
            const role = (m.type === 'ai' ? 'ai' : 'user') as 'ai' | 'user';
            const base: ChatMessage = {
              role,
              content: m.content ?? '',
            };
            const prev = cached?.[idx];
            if (prev && prev.role === role) {
              if (prev.files) base.files = prev.files;
              if (prev.contentParts) base.contentParts = prev.contentParts;
            }
            return base;
          });

          const lastMsg = restoredMessages[restoredMessages.length - 1];
          // AI 답변이 와야 하는데 아직 없거나(user가 마지막), 비어있는 AI 메시지가 마지막인 경우 폴링 시작
          const isAIPending =
            (lastMsg.role === 'ai' && !lastMsg.content && !lastMsg.isError) ||
            (lastMsg.role === 'user' && !result?.allComplete);

          if (isAIPending) {
            setIsStreaming(true);
            if (lastMsg.role === 'user') {
              // 로딩 말풍선을 보여주기 위해 빈 AI 메시지 추가
              const aiLoadingMsg: ChatMessage = {
                role: 'ai' as const,
                content: '',
              };
              const newMessages = [...restoredMessages, aiLoadingMsg];
              setMessages(newMessages);
              setChatHistory(experienceId, newMessages);
            } else {
              setMessages(restoredMessages);
              setChatHistory(experienceId, restoredMessages);
            }
            startPolling(experienceId);
          } else {
            setMessages(restoredMessages);
            setChatHistory(experienceId, restoredMessages);
            setIsStreaming(false);
          }

          const restoredStage = toGridStep(
            result?.currentStage ?? 1,
            result?.allComplete,
          );
          prevStageRef.current = restoredStage;
          setCurrentStage(restoredStage);
          if (restoredStage === 4) {
            setIsCompletionModalOpen(true);
          }
          setShowTooltipForStep(null);
          setSessionStreamError(null);
          setInsightTurnHistory(result?.insightTurnHistory ?? []);
          setInsightsByTurn({});
          return;
        }
      } catch {
        if (cancelled) return;
      }

      // sessionHistory 체크 (백엔드 조회 실패 시 대비)
      const cachedMessages = getChatHistory<ChatMessage>(experienceId);
      if (cachedMessages && cachedMessages.length > 0) {
        const lastMsg = cachedMessages[cachedMessages.length - 1];
        const isAIPending =
          (lastMsg.role === 'ai' && !lastMsg.content && !lastMsg.isError) ||
          lastMsg.role === 'user';

        if (isAIPending) {
          setIsStreaming(true);
          if (lastMsg.role === 'user') {
            const aiLoadingMsg: ChatMessage = {
              role: 'ai' as const,
              content: '',
            };
            const newMessages = [...cachedMessages, aiLoadingMsg];
            setMessages(newMessages);
            setChatHistory(experienceId, newMessages);
          } else {
            setMessages(cachedMessages);
          }
          startPolling(experienceId);
        } else {
          setMessages(cachedMessages);
        }

        await syncStageFromServer();
        return;
      }

      const isNewFromUrl =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('new') === '1';
      const skipStatusApi =
        isChatNewExperience(experienceId) || isNewExperience || isNewFromUrl;

      if (skipStatusApi) {
        if (typeof window !== 'undefined') {
          newExperienceScheduleRef.current = window.setTimeout(() => {
            newExperienceScheduleRef.current = null;
            if (cancelled) return;
            setSuppressStep0EntryTooltip(false);
            startSessionStream();
            clearChatNewExperienceId();
            const url = new URL(window.location.href);
            url.searchParams.delete('new');
            window.history.replaceState(
              null,
              '',
              url.pathname + (url.search || ''),
            );
          }, 0);
        } else {
          setSuppressStep0EntryTooltip(false);
          startSessionStream();
          clearChatNewExperienceId();
        }
        return;
      }

      setSuppressStep0EntryTooltip(false);
      startSessionStream();
    })();

    return () => {
      cancelled = true;
      sessionAbortRef.current?.abort();
      if (newExperienceScheduleRef.current != null) {
        window.clearTimeout(newExperienceScheduleRef.current);
        newExperienceScheduleRef.current = null;
      }
    };
    // isNewExperience 제외: replaceState 시 effect 재실행 → cleanup에서 스트림 abort → status 호출로 400 발생 방지
  }, [id, experienceId, sessionStreamKey]);

  // 브라우저 스크롤 차단 및 폴링 정리
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      if (pollSessionStatusRef.current) {
        clearTimeout(pollSessionStatusRef.current);
      }
    };
  }, []);

  /** 새로고침 후 답변 로드 실패 시 세션 스트림 재시도 */
  const handleRetrySession = () => {
    setSessionStreamError(null);
    setSessionStreamKey((k) => k + 1);
  };

  const showRetryButton =
    !!sessionStreamError ||
    (messages.length > 0 &&
      messages[messages.length - 1]?.role === 'ai' &&
      messages[messages.length - 1]?.isError === true);

  const handleSend = (payload: {
    content: string;
    contentParts?: ContentPart[];
    files: FileItem[];
    /** 선택한 인사이트 ID (백엔드가 AI 서버에 mentioned_insight로 전달) */
    mentioned_insight?: string | number;
  }) => {
    if (isStreaming || showRetryButton || (!payload.content.trim() && payload.files.length === 0)) return;

    const fileInfos = payload.files.map((f) => ({
      name: f.file.name,
      size: f.file.size,
      type: f.file.type,
      preview: f.preview,
    }));

    setMessages((prev) => {
      const next: ChatMessage[] = [
        ...prev,
        {
          role: 'user' as const,
          content: payload.content,
          contentParts: payload.contentParts,
          files: fileInfos,
        },
        { role: 'ai' as const, content: '' },
      ];
      setChatHistory(experienceId, next);
      return next;
    });
    setInputValue('');
    setIsStreaming(true);

    const abort = new AbortController();
    const currentTurnIndex = (messages.length - 1) / 2;
    const fd = new FormData();
    fd.append('message', payload.content.trim());
    if (payload.mentioned_insight != null) {
      fd.append('insightId', String(payload.mentioned_insight));
    }
    if (payload.files.length > 0) {
      payload.files.forEach((f) => fd.append('files', f.file));
    }
    const body = fd;

    fetchSSEStream({
      path: MESSAGES_STREAM_PATH(experienceId),
      method: 'POST',
      body,
      signal: abort.signal,
      onEvent: (event: {
        delta?: { text?: string };
        message?: {
          ai_response?: string;
          current_stage?: number;
          all_complete?: boolean;
        };
        type?: string;
        insights?: Array<{
          id: string;
          title: string;
          activity_name?: string;
          category: string;
          content: string;
          similarity_score?: number | null;
          source?: string;
        }>;
      }) => {
        if (
          event &&
          typeof event.type === 'string' &&
          Array.isArray(event.insights)
        ) {
          const mapped = event.insights.map((i) => ({
            id: i.id,
            title: i.title,
            activityName: i.activity_name ?? '',
            category: i.category,
            content: i.content,
            similarityScore: i.similarity_score ?? null,
            source: i.source ?? 'rag',
          }));
          setInsightsByTurn((prev) => ({
            ...prev,
            [currentTurnIndex]: mapped,
          }));
          return;
        }
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last || last.role !== 'ai') return prev;

          if ('delta' in event && event.delta?.text) {
            next[next.length - 1] = {
              ...last,
              content: last.content + (event.delta.text ?? ''),
            };
            setChatHistory(experienceId, next);
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
            setChatHistory(experienceId, next);
            /* 3턴 연장 중에는 단계를 4로 유지 */
            if (!isExtendedSessionRef.current) {
              if (
                typeof event.message.current_stage === 'number' ||
                event.message.all_complete
              ) {
                const newStage = toGridStep(
                  event.message.current_stage ?? 1,
                  event.message.all_complete,
                );
                if (
                  newStage >= 1 &&
                  newStage <= 3 &&
                  newStage !== prevStageRef.current
                ) {
                  setShowTooltipForStep(newStage);
                }
                if (newStage === 4 && prevStageRef.current !== 4) {
                  prevStageRef.current = 4;
                  setIsCompletionModalOpen(true);
                }
                setCurrentStage(newStage);
              }
            }
            return next;
          }
          return prev;
        });
      },
      onError: () => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'ai' && last.content === '') {
            next[next.length - 1] = { ...last, content: '', isError: true };
          }
          setChatHistory(experienceId, next);
          return next;
        });
      },
      onDone: async () => {
        setIsStreaming(false);
        await syncStageFromServer(isExtendedSessionRef.current);
        handleExtendedTurnDone();
      },
    });
  };

  useEffect(() => {
    if (!isPortfolioCreateModalOpen) return;
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      setIsPortfolioCreateModalOpen(false);
      router.replace(`/experience/settings/${id}/createloading`);
    }, 2000);
    generatePortfolio({ experienceId })
      .then((res) => {
        if (cancelled) return;
        const result = res?.result as GeneratePortfolioResDTO | undefined;
        const portfolioId = result?.portfolioId;
        if (portfolioId != null) {
          setPendingPortfolio(id, portfolioId);
          queryClient.invalidateQueries({
            queryKey: getPortfolioControllerGetPortfolioQueryKey(portfolioId),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    isPortfolioCreateModalOpen,
    id,
    experienceId,
    router,
    setPendingPortfolio,
    queryClient,
    generatePortfolio,
  ]);

  const { mutateAsync: deleteExperience } =
    useExperienceControllerDeleteExperience();

  const handleDelete = () => {
    if (!Number.isFinite(experienceId)) {
      removeExperience(id);
      router.push('/experience');
      return;
    }
    deleteExperience({ experienceId })
      .then(() => {
        removeExperience(id);
        clearChatHistory(experienceId);
        return queryClient.refetchQueries({
          queryKey: getExperienceControllerGetExperiencesQueryKey(),
        });
      })
      .then(() => {
        router.push('/experience');
      })
      .catch(() => {
        alert('삭제에 실패했어요. 다시 시도해주세요.');
      });
  };

  /** 3턴 대화 이어가기: 4단계 상태 유지한 채 연장 스트림으로 첫 AI 질문 수신, 3턴만 진행 후 CompleteModal */
  const handleContinueChat = () => {
    setIsCompletionModalOpen(false);
    isExtendedSessionRef.current = true;
    extendedTurnCountRef.current = 0;
    prevStageRef.current = 4;
    setCurrentStage(4); /* 4단계(대화 완료) 상태에서 3턴 연장 진행 */
    setMessages((prev) => {
      const next: ChatMessage[] = [
        ...prev,
        { role: 'ai' as const, content: '' },
      ];
      setChatHistory(experienceId, next);
      return next;
    });
    setIsStreaming(true);
    const abort = new AbortController();
    fetchSSEStream({
      path: EXTEND_STREAM_PATH(experienceId),
      method: 'POST',
      signal: abort.signal,
      onEvent: (event: {
        delta?: { text?: string };
        message?: {
          ai_response?: string;
          current_stage?: number;
          all_complete?: boolean;
        };
      }) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last || last.role !== 'ai') return prev;
          if ('delta' in event && event.delta?.text) {
            next[next.length - 1] = {
              ...last,
              content: last.content + (event.delta.text ?? ''),
            };
            setChatHistory(experienceId, next);
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
            setChatHistory(experienceId, next);
            /* 3턴 연장 중에는 단계를 4로 유지(스트림 이벤트로 단계 변경하지 않음) */
            if (!isExtendedSessionRef.current) {
              if (
                typeof event.message.current_stage === 'number' ||
                event.message.all_complete
              ) {
                const newStage = toGridStep(
                  event.message.current_stage ?? 1,
                  event.message.all_complete,
                );
                if (newStage === 4 && prevStageRef.current !== 4) {
                  prevStageRef.current = 4;
                  setIsCompletionModalOpen(true);
                }
                setCurrentStage(newStage);
              }
            }
            return next;
          }
          return prev;
        });
      },
      onError: () => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'ai' && last.content === '') {
            next[next.length - 1] = { ...last, content: '', isError: true };
          }
          setChatHistory(experienceId, next);
          return next;
        });
      },
      onDone: async () => {
        setIsStreaming(false);
        await syncStageFromServer(isExtendedSessionRef.current);
        handleExtendedTurnDone();
      },
    });
  };

  /* 실패한 AI 메시지에 대해 마지막 사용자 메시지로 재요청 */
  const handleRetryAIMessage = (aiMessageIndex: number) => {
    const userMsg = messages[aiMessageIndex - 1];
    if (!userMsg || userMsg.role !== 'user' || !userMsg.content.trim()) return;
    const content = userMsg.content.trim();
    setMessages((prev) => {
      const next = [
        ...prev.slice(0, aiMessageIndex),
        { role: 'ai' as const, content: '' },
      ];
      setChatHistory(experienceId, next);
      return next;
    });
    setIsStreaming(true);
    const abort = new AbortController();
    const fd = new FormData();
    fd.append('message', content);
    fetchSSEStream({
      path: MESSAGES_STREAM_PATH(experienceId),
      method: 'POST',
      body: fd,
      signal: abort.signal,
      onEvent: (event: {
        delta?: { text?: string };
        message?: {
          ai_response?: string;
          current_stage?: number;
          all_complete?: boolean;
        };
      }) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last || last.role !== 'ai') return prev;
          if ('delta' in event && event.delta?.text) {
            next[next.length - 1] = {
              ...last,
              content: last.content + (event.delta.text ?? ''),
            };
            setChatHistory(experienceId, next);
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
            setChatHistory(experienceId, next);
            if (
              typeof event.message.current_stage === 'number' ||
              event.message.all_complete
            ) {
              const newStage = toGridStep(
                event.message.current_stage ?? 1,
                event.message.all_complete,
              );
              if (
                newStage >= 1 &&
                newStage <= 3 &&
                newStage !== prevStageRef.current
              ) {
                setShowTooltipForStep(newStage);
              }
              if (newStage === 4 && prevStageRef.current !== 4) {
                prevStageRef.current = 4;
                setIsCompletionModalOpen(true);
              }
              setCurrentStage(newStage);
            }
            return next;
          }
          return prev;
        });
      },
      onError: () => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'ai' && last.content === '') {
            next[next.length - 1] = { ...last, content: '', isError: true };
          }
          setChatHistory(experienceId, next);
          return next;
        });
      },
      onDone: async () => {
        setIsStreaming(false);
        await syncStageFromServer(isExtendedSessionRef.current);
        handleExtendedTurnDone();
      },
    });
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full shrink-0 items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <BackButton href='/experience' />
            {titleReady && (
              <InlineEdit
                title={displayTitle}
                isEditing={isEditingTitle}
                onEdit={() => setIsEditingTitle(true)}
                onSave={(newTitle) => {
                  if (!Number.isFinite(experienceId)) {
                    updateExperienceTitle(id, newTitle);
                    setIsEditingTitle(false);
                    return;
                  }
                  updateExperience({
                    experienceId,
                    data: { name: newTitle },
                  })
                    .then(() => {
                      updateExperienceTitle(id, newTitle);
                      queryClient.invalidateQueries({
                        queryKey:
                          getExperienceControllerGetExperienceQueryKey(
                            experienceId,
                          ),
                      });
                      setIsEditingTitle(false);
                    })
                    .catch(() => {
                      setIsEditingTitle(false);
                    });
                }}
              />
            )}
          </div>

          <DeleteModalButton
            title='이 경험 정리를 정말 삭제하시겠습니까?'
            onDelete={handleDelete}
          />
        </div>

        {/* 프로그레스 바 */}
        <div className='shrink-0'>
          <StepProgressBar
            steps={['설정', 'AI 대화', '포트폴리오']}
            currentStep={2}
          />
        </div>

        {/* 채팅 영역: 메시지 영역만 스크롤 */}
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden pb-[9rem]'>
          <ChatMessageSection
            messages={messages}
            isStreaming={isStreaming}
            onRetryAIMessage={handleRetryAIMessage}
            sessionLoadFailed={!!sessionStreamError}
            onRetrySession={handleRetrySession}
            conversationCompleted={currentStage === 4}
            insightTurnHistory={insightTurnHistory}
            insightsByTurn={insightsByTurn}
          />
        </div>
      </div>

      {/* 채팅 입력 창: 브라우저 바닥 기준 4.75rem 고정 */}
      <div className='pointer-events-none fixed bottom-[4.75rem] left-1/2 z-30 flex w-full max-w-[66rem] -translate-x-1/2 items-center px-[1rem]'>
        <ChatStepSection
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          disabled={isStreaming || showRetryButton}
          currentStep={currentStage}
          showTooltipForStep={showTooltipForStep}
          suppressStep0EntryTooltip={suppressStep0EntryTooltip}
          messages={messages}
        />
      </div>

      {/* 대화 완료 모달: 단계가 다 채워졌을 때만 표시 */}
      <ChatCompleteModal
        open={isCompletionModalOpen}
        onOpenChange={setIsCompletionModalOpen}
        onEndConversation={() => {
          setIsCompletionModalOpen(false);
          setIsPortfolioCreateModalOpen(true);
        }}
        onContinueWithCredits={handleContinueChat}
      />

      {/* 3턴 연장 후: 안내 모달 → 포트폴리오 생성 API 호출 후 createloading 이동 (3턴은 한 번만) */}
      <PortfolioCreateModal
        open={isPortfolioCreateModalOpen}
        onOpenChange={setIsPortfolioCreateModalOpen}
      />
    </div>
  );
}

const ChatPageFallback = () => (
  <div className='flex min-h-[50vh] items-center justify-center'>
    <div className='h-[2rem] w-[2rem] animate-spin rounded-full border-2 border-[#5060C5] border-t-transparent' />
  </div>
);

export default function ExperienceSettingsChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ExperienceSettingsChatContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
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
import type { GeneratePortfolioResDTO } from '@/api/models';

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

export default function ExperienceSettingsChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const experienceId = id ? Number(id) : NaN;
  const sessionAbortRef = useRef<AbortController | null>(null);
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

  const { data: experienceData } = useExperienceControllerGetExperience(
    experienceId,
    { query: { enabled: Number.isFinite(experienceId) } },
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

  const prevStageRef = useRef(0);
  /* 3턴 이어가기 모드: true면 연장 세션 중 */
  const isExtendedSessionRef = useRef(false);
  /* 연장 세션에서 완료된 턴 수 (AI 응답 1회 = 1턴, 3턴이면 CompleteModal 오픈) */
  const extendedTurnCountRef = useRef(0);
  const queryClient = useQueryClient();
  const { mutateAsync: generatePortfolio } =
    useInterviewControllerGeneratePortfolio();
  const { mutateAsync: updateExperience } =
    useExperienceControllerUpdateExperience();
  const setPendingPortfolio = usePortfolioCreationStore((s) => s.setPending);
  const setResolvedPortfolio = usePortfolioCreationStore((s) => s.setResolved);

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
      setMessages([{ role: 'ai', content: '' }]);
      setSessionStreamError(null);
      setIsStreaming(true);
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
              return next;
            }
            if ('message' in event && event.message?.ai_response != null) {
              next[next.length - 1] = {
                ...last,
                content: event.message.ai_response,
              };
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
        onDone: () => {
          if (cancelled) return;
          setIsStreaming(false);
        },
      });
    };

    (async () => {
      if (sessionStreamKey > 0) {
        startSessionStream();
        return;
      }
      try {
        const res = await interviewControllerGetSessionState(experienceId);
        if (cancelled) return;
        const list = res?.result?.messages;
        if (list && list.length > 0) {
          setMessages(
            list.map((m) => ({
              role: (m.type === 'ai' ? 'ai' : 'user') as 'ai' | 'user',
              content: m.content ?? '',
            })),
          );
          const restoredStage = toGridStep(
            res.result?.currentStage ?? 1,
            res.result?.allComplete,
          );
          prevStageRef.current = restoredStage;
          setCurrentStage(restoredStage);
          if (restoredStage === 4) {
            setIsCompletionModalOpen(true);
          }
          setShowTooltipForStep(null);
          setSessionStreamError(null);
          setIsStreaming(false);
          return;
        }
      } catch {
        if (cancelled) return;
      }
      startSessionStream();
    })();

    return () => {
      cancelled = true;
      sessionAbortRef.current?.abort();
    };
  }, [id, experienceId, sessionStreamKey]);

  // 브라우저 스크롤 차단
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /** 새로고침 후 답변 로드 실패 시 세션 스트림 재시도 */
  const handleRetrySession = () => {
    setSessionStreamError(null);
    setSessionStreamKey((k) => k + 1);
  };

  const handleSend = (payload: {
    content: string;
    contentParts?: ContentPart[];
    files: FileItem[];
  }) => {
    if (isStreaming || !payload.content.trim()) return;

    const fileInfos = payload.files.map((f) => ({
      name: f.file.name,
      size: f.file.size,
      type: f.file.type,
      preview: f.preview,
    }));

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: payload.content,
        contentParts: payload.contentParts,
        files: fileInfos,
      },
      { role: 'ai', content: '' },
    ]);
    setInputValue('');
    setIsStreaming(true);

    const abort = new AbortController();

    fetchSSEStream({
      path: MESSAGES_STREAM_PATH(experienceId),
      method: 'POST',
      body: JSON.stringify({ message: payload.content.trim() }),
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
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
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
          return next;
        });
      },
      onDone: () => {
        setIsStreaming(false);
        if (isExtendedSessionRef.current) {
          extendedTurnCountRef.current += 1;
          if (extendedTurnCountRef.current >= 3) {
            isExtendedSessionRef.current = false;
            setIsPortfolioCreateModalOpen(true);
          }
        }
      },
    });
  };

  /* PortfolioCreateModal 오픈 시: 포트폴리오 생성 API 호출 → createloading 이동 → 폴러가 완료 시 portfolio로 리다이렉트 */
  useEffect(() => {
    if (!isPortfolioCreateModalOpen) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
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
      .catch(() => {
        if (!cancelled) setIsPortfolioCreateModalOpen(false);
      });
    timeoutId = setTimeout(() => {
      if (cancelled) return;
      setIsPortfolioCreateModalOpen(false);
      router.push(`/experience/settings/${id}/createloading`);
    }, 2000);
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPortfolioCreateModalOpen]);

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

  /** 3턴 대화 이어가기: 모달 닫고 연장 스트림으로 첫 AI 질문 수신, 3턴만 진행 후 CompleteModal */
  const handleContinueChat = () => {
    setIsCompletionModalOpen(false);
    isExtendedSessionRef.current = true;
    extendedTurnCountRef.current = 0;
    setMessages((prev) => [...prev, { role: 'ai', content: '' }]);
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
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
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
              /* 3턴 이어가기에서는 툴팁 표시 안 함 */
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
          return next;
        });
      },
      onDone: () => {
        setIsStreaming(false);
        if (isExtendedSessionRef.current) {
          extendedTurnCountRef.current += 1;
          if (extendedTurnCountRef.current >= 3) {
            isExtendedSessionRef.current = false;
            setIsPortfolioCreateModalOpen(true);
          }
        }
      },
    });
  };

  /* 실패한 AI 메시지에 대해 마지막 사용자 메시지로 재요청 */
  const handleRetryAIMessage = (aiMessageIndex: number) => {
    const userMsg = messages[aiMessageIndex - 1];
    if (!userMsg || userMsg.role !== 'user' || !userMsg.content.trim()) return;
    const content = userMsg.content.trim();
    setMessages((prev) => [
      ...prev.slice(0, aiMessageIndex),
      { role: 'ai' as const, content: '' },
    ]);
    setIsStreaming(true);
    const abort = new AbortController();
    fetchSSEStream({
      path: MESSAGES_STREAM_PATH(experienceId),
      method: 'POST',
      body: JSON.stringify({ message: content }),
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
            return next;
          }
          if ('message' in event && event.message?.ai_response != null) {
            next[next.length - 1] = {
              ...last,
              content: event.message.ai_response,
            };
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
          return next;
        });
      },
      onDone: () => setIsStreaming(false),
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
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden pb-[10.75rem]'>
          <ChatMessageSection
            messages={messages}
            isStreaming={isStreaming}
            onRetryAIMessage={handleRetryAIMessage}
            sessionLoadFailed={!!sessionStreamError}
            onRetrySession={handleRetrySession}
            searchKeyword={
              [...messages].reverse().find((m) => m.role === 'user')?.content ??
              ''
            }
          />
        </div>
      </div>

      {/* 채팅 입력 창: 브라우저 바닥 기준 4.75rem 고정 */}
      <div className='fixed bottom-[4.75rem] left-1/2 z-30 flex w-full max-w-[66rem] -translate-x-1/2 items-center px-[1rem]'>
        <ChatStepSection
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          disabled={isStreaming}
          currentStep={currentStage}
          showTooltipForStep={showTooltipForStep}
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

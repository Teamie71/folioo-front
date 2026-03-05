'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { CommonModal } from '@/components/CommonModal';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ChatMessageSection,
  type ChatMessage,
  type ChatAttachedLog,
} from '@/features/experience/chat/components/ChatMessageSection';
import { ChatStepSection } from '@/features/experience/chat/components/ChatStepSection';
import type { FileItem } from '@/features/experience/chat/components/ChatInput';
import { ChatCompleteModal } from '@/features/experience/chat/components/ChatCompleteModal';
import {
  useInterviewControllerCreateSessionStream,
  useInterviewControllerGetSessionState,
  useInterviewControllerSendChatStream,
} from '@/api/endpoints/interview/interview';
import { insightControllerGetLogs } from '@/api/endpoints/insight/insight';
import { toLogCardDataList } from '@/features/log/utils/toLogCardData';
import type {
  StreamContentBlockDeltaDTO,
  StreamMessageCompleteDTO,
} from '@/api/models';

/** StrictMode 재마운트 시 같은 경험에 대해 startSession이 두 번 호출되는 것을 막기 위한 모듈 레벨 가드 */
let lastStartSessionExperienceId: number | null = null;

export default function ExperienceSettingsChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const isNewExperience = searchParams.get('new') === '1';
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

  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState(storeTitle);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isAnswerStreaming, setIsAnswerStreaming] = useState(false);
  const [stepTooltipStep, setStepTooltipStep] = useState(0);
  /** 새로고침 복원 직후 툴팁 미표시용(세션 적용 후 한 틱만 true) */
  const [suppressStepTooltip, setSuppressStepTooltip] = useState(false);
  const sessionStartedRef = useRef(false);
  /** 방금 전송한 사용자 메시지 — AI 응답 후 연관 인사이트 로그 검색에 사용 */
  const lastSentMessageRef = useRef('');
  /** 단계 완료 시 완료 모달을 이미 한 번 띄웠는지 (중복 오픈 방지) */
  const completionModalAutoOpenedRef = useRef(false);
  /* '3턴 계속하기' 선택 시 남은 추가 대화 턴 수 (0이면 추가 턴 아님) */
  const [extraTurnsRemaining, setExtraTurnsRemaining] = useState(0);
  /* 추가 3턴 중 마지막(3번째) 메시지 응답 수신 후 포트폴리오 안내 모달 띄우기 플래그 */
  const pendingShowTransitionModalRef = useRef(false);
  /* '3턴 계속하기' 선택 후 추가 대화 모드 */
  const inExtraTurnsModeRef = useRef(false);
  /* 답변 생성 오류 시 재시도할 마지막 사용자 메시지 */
  const lastFailedMessageRef = useRef('');
  /* 세션 재연결(3턴 선택·재시도) 시 startSession 호출 중 — onSuccess에서 기존 메시지 덮어쓰지 않음 */
  const isReconnectFlowRef = useRef(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const numericId = Number(id);

  const computeStepFromProgress = (
    stage?: number,
    allComplete?: boolean,
  ): number => {
    if (allComplete) return 4;
    if (!stage || stage <= 1) return 0;
    if (stage === 2) return 1;
    if (stage === 3) return 2;
    if (stage >= 4) return 3;
    return 0;
  };

  const updateStepTooltip = (stage?: number, allComplete?: boolean) => {
    const next = computeStepFromProgress(stage, allComplete);
    setStepTooltipStep((prev) => (next > prev ? next : prev));
  };

  const {
    data: sessionStateData,
    isLoading: isSessionStateLoading,
    refetch: refetchSessionState,
  } = useInterviewControllerGetSessionState(
    Number.isNaN(numericId) ? 0 : numericId,
    {
      query: {
        enabled:
          // 새로 생성된 경험(new=1)인 경우에는 아직 세션이 없으므로
          // 상태 조회를 먼저 호출하지 않는다.
          !isNewExperience &&
          !!id &&
          !Number.isNaN(numericId) &&
          sessionRestoreAttempted &&
          !!accessToken,
      },
    },
  );

  useEffect(() => {
    const state = sessionStateData?.result;
    if (!state) return;

    const msgs = state.messages ?? [];
    if (msgs.length === 0) return;

    setSuppressStepTooltip(true);
    updateStepTooltip(state.currentStage, state.allComplete);

    setMessages((prev) => {
      const mapped: ChatMessage[] = msgs.map((m) => {
        const role = m.type?.toLowerCase() === 'ai' ? 'ai' : 'user';
        const content = m.content ?? '';
        const base: ChatMessage = { role, content };
        if (role === 'user' && content) {
          const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
          const sameContent = prev.find(
            (p) =>
              p.role === 'user' &&
              p.mentionTitle &&
              norm(p.content) === norm(content),
          );
          if (sameContent?.mentionTitle) {
            return { ...base, mentionTitle: sameContent.mentionTitle };
          }
        }
        return base;
      });
      // 서버에서 불러와도, 이미 붙여 둔 연관 인사이트 로그(attachedLogs) 및 mentionTitle 유지
      return mapped.map((m, i) => ({
        ...m,
        attachedLogs:
          prev[i]?.role === 'ai' && prev[i].attachedLogs?.length
            ? prev[i].attachedLogs
            : undefined,
      }));
    });
    setIsSessionLoading(false);
    const t = setTimeout(() => setSuppressStepTooltip(false), 0);
    return () => clearTimeout(t);
  }, [sessionStateData]);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'chat');
  }, [id]);

  useEffect(() => {
    if (stepTooltipStep === 4 && !completionModalAutoOpenedRef.current) {
      completionModalAutoOpenedRef.current = true;
      setIsCompletionModalOpen(true);
    }
  }, [stepTooltipStep]);

  const { mutate: startSession } = useInterviewControllerCreateSessionStream({
    mutation: {
      onSuccess: (event) => {
        if (isReconnectFlowRef.current) {
          isReconnectFlowRef.current = false;
          setIsSessionLoading(false);
          return;
        }
        const maybeDelta = event as StreamContentBlockDeltaDTO;
        const maybeComplete = event as StreamMessageCompleteDTO;

        if ('message' in maybeComplete && maybeComplete.message) {
          const text = maybeComplete.message.ai_response ?? '';
          setMessages([{ role: 'ai', content: text }]);
          updateStepTooltip(
            maybeComplete.message.current_stage,
            maybeComplete.message.all_complete,
          );
        } else if ('delta' in maybeDelta && maybeDelta.delta?.text) {
          const text = maybeDelta.delta.text;
          setMessages([{ role: 'ai', content: text }]);
        }
        setIsSessionLoading(false);

        if (isNewExperience) {
          router.replace(`/experience/settings/${id}/chat`);
        }
      },
      onError: (err: unknown) => {
        if (isReconnectFlowRef.current) {
          isReconnectFlowRef.current = false;
        }
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const is409 = status === 409;
        if (is409 && numericId) {
          refetchSessionState().then((result) => {
            const state = result.data?.result;
            const msgs = state?.messages ?? [];
            if (msgs.length > 0) {
              setMessages(
                msgs.map((m) => ({
                  role: m.type?.toLowerCase() === 'ai' ? 'ai' : 'user',
                  content: m.content ?? '',
                })),
              );
            }
            if (isNewExperience) {
              router.replace(`/experience/settings/${id}/chat`);
            }
          });
        }
        setIsSessionLoading(false);
      },
    },
  });

  const { mutate: sendChat } = useInterviewControllerSendChatStream({
    mutation: {
      onSuccess: async (event) => {
        // SSE 스트림 완료 이벤트(StreamMessageCompleteDTO)에 다음 단계 질문이 포함될 수 있음 → 즉시 반영
        const complete = event as StreamMessageCompleteDTO;
        if (complete?.message?.ai_response != null) {
          const nextText = complete.message.ai_response.trim();
          if (nextText) {
            setMessages((prev) => [...prev, { role: 'ai', content: nextText }]);
          }
        }
        try {
          updateStepTooltip(
            complete?.message?.current_stage,
            complete?.message?.all_complete,
          );
          await refetchSessionState();
          // 채팅 중 연관 인사이트 로그 자동 검색: 방금 보낸 사용자 메시지로 검색 후 마지막 AI 메시지에 로그 카드 첨부
          const keyword = lastSentMessageRef.current.trim();
          if (keyword) {
            try {
              const res = await insightControllerGetLogs({ keyword });
              const list = res?.result ?? [];
              const cards: ChatAttachedLog[] = toLogCardDataList(list).slice(
                0,
                5,
              );
              if (cards.length > 0) {
                setMessages((prev) => {
                  const next = [...prev];
                  const lastIdx = next.length - 1;
                  if (
                    lastIdx >= 0 &&
                    next[lastIdx].role === 'ai' &&
                    next[lastIdx].content
                  ) {
                    next[lastIdx] = {
                      ...next[lastIdx],
                      attachedLogs: cards,
                    };
                  }
                  return next;
                });
              }
            } catch {
              // 인사이트 검색 실패 시 무시 (메시지는 그대로 유지)
            }
          }
          if (pendingShowTransitionModalRef.current) {
            pendingShowTransitionModalRef.current = false;
            inExtraTurnsModeRef.current = false;
            setIsTransitionModalOpen(true);
          }
        } finally {
          setIsAnswerStreaming(false);
        }
      },
      onError: () => {
        setIsAnswerStreaming(false);
        lastFailedMessageRef.current = lastSentMessageRef.current;
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: '', isError: true },
        ]);
      },
    },
  });

  useEffect(() => {
    if (!id) return;
    if (!sessionRestoreAttempted) return;

    // 인증 실패 상태면 로그인 페이지로 리다이렉트
    if (!accessToken) {
      router.replace(
        `/login?redirect_to=${encodeURIComponent(
          `/experience/settings/${id}/chat`,
        )}`,
      );
      return;
    }

    // 세션 상태 조회가 끝나지 않았으면 대기
    if (!isNewExperience && isSessionStateLoading) return;

    const hasExistingSession =
      !!sessionStateData?.result?.messages &&
      sessionStateData.result.messages.length > 0;
    // 이미 세션이 존재하면 새 세션 생성하지 않음
    if (!isNewExperience && hasExistingSession) return;

    // StrictMode 재마운트 시 ref가 초기화되므로, 같은 experienceId에 대한 중복 호출은 모듈 레벨에서도 막는다.
    if (lastStartSessionExperienceId === numericId) return;
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;
    lastStartSessionExperienceId = numericId;

    if (Number.isNaN(numericId)) return;
    setIsSessionLoading(true);
    startSession({ experienceId: numericId });
  }, [
    id,
    accessToken,
    sessionRestoreAttempted,
    isSessionStateLoading,
    sessionStateData,
    numericId,
    startSession,
    router,
    isNewExperience,
  ]);

  // 브라우저 스크롤 차단
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSend = (payload: {
    content: string;
    files: FileItem[];
    insightId?: number;
    mentionTitle?: string;
  }) => {
    // 메시지 전송, TODO: 파일 업로드 처리
    const content = payload.content.trim();
    if (!content && !payload.mentionTitle) return;

    if (extraTurnsRemaining > 0) {
      const nextRemaining = extraTurnsRemaining - 1;
      setExtraTurnsRemaining(nextRemaining);
      if (nextRemaining === 0) {
        pendingShowTransitionModalRef.current = true;
      }
    }

    // 로그 멘션 + 입력 내용을 한 개 메시지로 표시 (mentionTitle 있으면 말풍선 안에서만 로그 부분 pill 스타일)
    lastSentMessageRef.current = content;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content,
        ...(payload.mentionTitle != null && {
          mentionTitle: payload.mentionTitle,
        }),
      },
    ]);
    setInputValue('');
    setIsAnswerStreaming(true);

    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    sendChat({
      experienceId: numericId,
      data: {
        message: content,
        ...(payload.insightId != null && { insightId: payload.insightId }),
      },
    });
  };

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  const handleRetryRequest = () => {
    const content = lastFailedMessageRef.current.trim();
    if (!content || !id) return;
    const numId = Number(id);
    if (Number.isNaN(numId)) return;
    setMessages((prev) => {
      const next = [...prev];
      if (next[next.length - 1]?.role === 'ai' && next[next.length - 1].isError) {
        next.pop();
      }
      return next;
    });
    setIsAnswerStreaming(true);
    isReconnectFlowRef.current = true;
    startSession(
      { experienceId: numId },
      {
        onSettled: () => {
          isReconnectFlowRef.current = false;
          sendChat({
            experienceId: numId,
            data: { message: content },
          });
        },
      },
    );
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full shrink-0 items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <BackButton href='/experience' />
            <InlineEdit
              title={experienceTitle}
              isEditing={isEditingTitle}
              onEdit={() => setIsEditingTitle(true)}
              onSave={(newTitle) => {
                setExperienceTitle(newTitle);
                updateExperienceTitle(id, newTitle);
                setIsEditingTitle(false);
              }}
            />
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
            showLoading={isSessionLoading || isAnswerStreaming}
            onRetryRequest={handleRetryRequest}
          />
        </div>
      </div>

      {/* 채팅 입력 창: 브라우저 바닥 기준 4.75rem 고정 */}
      <div className='fixed bottom-[4.75rem] left-1/2 z-30 flex w-full max-w-[66rem] -translate-x-1/2 items-center px-[1rem]'>
        <ChatStepSection
          currentStep={
            isNewExperience || sessionStateData?.result != null
              ? stepTooltipStep
              : null
          }
          suppressTooltip={
            (sessionStateData?.result == null && !isNewExperience) ||
            suppressStepTooltip
          }
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
        />
      </div>

      {/* 대화 완료 모달 */}
      <ChatCompleteModal
        open={isCompletionModalOpen}
        onOpenChange={setIsCompletionModalOpen}
        onEndConversation={() => {
          setIsCompletionModalOpen(false);
          setIsTransitionModalOpen(true);
        }}
        onContinueWithCredits={() => {
          setIsCompletionModalOpen(false);
          setExtraTurnsRemaining(3);
          inExtraTurnsModeRef.current = true;
        }}
      />

      {/* 포트폴리오 생성 시작 안내 모달 (2초 후 자동 닫힘 → 포트폴리오 페이지 이동) */}
      <CommonModal
        open={isTransitionModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsTransitionModalOpen(false);
            router.push(`/experience/settings/${id}/createloading`);
          }
        }}
        title={
          <>
            AI 컨설턴트가 충분한 정보를 학습했어요!
            <br />
            대화 내용을 바탕으로 텍스트형 포트폴리오 생성을 시작할게요.
          </>
        }
      />
    </div>
  );
}

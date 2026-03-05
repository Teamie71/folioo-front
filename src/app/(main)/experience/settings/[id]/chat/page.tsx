'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
} from '@/features/experience/chat/components/ChatMessageSection';
import { ChatStepSection } from '@/features/experience/chat/components/ChatStepSection';
import type { FileItem } from '@/features/experience/chat/components/ChatInput';
import { ChatCompleteModal } from '@/features/experience/chat/components/ChatCompleteModal';
import {
  useInterviewControllerCreateSessionStream,
  useInterviewControllerGetSessionState,
  useInterviewControllerSendChatStream,
} from '@/api/endpoints/interview/interview';
import type {
  StreamContentBlockDeltaDTO,
  StreamMessageCompleteDTO,
  StreamPingDTO,
  StreamRetrieverResultDTO,
  StreamRetrieverStatusDTO,
} from '@/api/models';

export default function ExperienceSettingsChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
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
  const sessionStartedRef = useRef(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const numericId = Number(id);

  const {
    data: sessionStateData,
    isLoading: isSessionStateLoading,
    refetch: refetchSessionState,
  } = useInterviewControllerGetSessionState(
    Number.isNaN(numericId) ? 0 : numericId,
    {
      query: {
        enabled:
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

    const mapped: ChatMessage[] = msgs.map((m) => ({
      role: m.type.toLowerCase() === 'ai' ? 'ai' : 'user',
      content: m.content ?? '',
    }));

    setMessages(mapped);
    setIsSessionLoading(false);
  }, [sessionStateData]);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'chat');
  }, [id]);

  const { mutate: startSession } = useInterviewControllerCreateSessionStream({
    mutation: {
      onSuccess: (event) => {
        const maybeDelta = event as StreamContentBlockDeltaDTO;
        const maybeComplete = event as StreamMessageCompleteDTO;

        if ('message' in maybeComplete && maybeComplete.message) {
          const text = maybeComplete.message.ai_response ?? '';
          setMessages([{ role: 'ai', content: text }]);
        } else if ('delta' in maybeDelta && maybeDelta.delta?.text) {
          const text = maybeDelta.delta.text;
          setMessages([{ role: 'ai', content: text }]);
        }
        setIsSessionLoading(false);
      },
      onError: () => {
        setIsSessionLoading(false);
      },
    },
  });

  const { mutate: sendChat } = useInterviewControllerSendChatStream({
    mutation: {
      onSuccess: async () => {
        try {
          await refetchSessionState();
        } finally {
          setIsAnswerStreaming(false);
        }
      },
      onError: () => {
        setIsAnswerStreaming(false);
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
    if (isSessionStateLoading) return;

    const hasExistingSession =
      !!sessionStateData?.result?.messages &&
      sessionStateData.result.messages.length > 0;
    // 이미 세션이 존재하면 새 세션 생성하지 않음
    if (hasExistingSession) return;

    // StrictMode에서 effect가 두 번 실행되는 것을 방지하기 위한 가드
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

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
  ]);

  // 브라우저 스크롤 차단
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSend = (payload: { content: string; files: FileItem[] }) => {
    // 메시지 전송, TODO: 파일 업로드 처리
    const content = payload.content.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content,
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
      },
    });
  };

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
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
            onAIMessageClick={() => setIsCompletionModalOpen(true)}
          />
        </div>
      </div>

      {/* 채팅 입력 창: 브라우저 바닥 기준 4.75rem 고정 */}
      <div className='fixed bottom-[4.75rem] left-1/2 z-30 flex w-full max-w-[66rem] -translate-x-1/2 items-center px-[1rem]'>
        <ChatStepSection
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
        onContinueWithCredits={() => setIsCompletionModalOpen(false)}
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

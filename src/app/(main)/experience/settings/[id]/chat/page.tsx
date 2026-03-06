'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { CommonModal } from '@/components/CommonModal';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
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
import { fetchSSEStream } from '@/lib/sseStream';
import { interviewControllerGetSessionState } from '@/api/endpoints/interview/interview';

const SESSION_STREAM_PATH = (experienceId: number) =>
  `/interview/experiences/${experienceId}/session/stream`;
const MESSAGES_STREAM_PATH = (experienceId: number) =>
  `/interview/experiences/${experienceId}/messages/stream`;

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

  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState(storeTitle);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStreamError, setSessionStreamError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    document.title = `${experienceTitle} - Folioo`;
  }, [experienceTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'chat');
  }, [id]);

  // 진입 시: 세션 있으면 기존 대화 로드, 없으면 세션 스트림 시작
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
          message?: { ai_response?: string };
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
  }, [id, experienceId]);

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
        message?: { ai_response?: string };
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
            next[next.length - 1] = {
              ...last,
              content: '응답을 불러오지 못했어요. 다시 시도해주세요.',
            };
          }
          return next;
        });
      },
      onDone: () => {
        setIsStreaming(false);
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
            isStreaming={isStreaming}
            searchKeyword={
              [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
            }
            onAIMessageClick={() => setIsCompletionModalOpen(true)}
          />
          {sessionStreamError && (
            <p className='mt-2 text-sm text-red-600'>{sessionStreamError}</p>
          )}
        </div>
      </div>

      {/* 채팅 입력 창: 브라우저 바닥 기준 4.75rem 고정 */}
      <div className='fixed bottom-[4.75rem] left-1/2 z-30 flex w-full max-w-[66rem] -translate-x-1/2 items-center px-[1rem]'>
        <ChatStepSection
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          disabled={isStreaming}
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

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { CommonModal } from '@/components/CommonModal';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ChatMessageSection } from '@/features/experience/chat/components/ChatMessageSection';
import { ChatStepSection } from '@/features/experience/chat/components/ChatStepSection';
import { ChatCompleteModal } from '@/features/experience/chat/components/ChatCompleteModal';

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

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState(storeTitle);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<
    Array<{ role: 'ai' | 'user'; content: string }>
  >([{ role: 'ai', content: '내용' }]);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'chat');
  }, [id]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'ai', content: '내용' },
    ]);
    setInputValue('');
  };

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-full max-w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
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

        {/* 채팅 영역: 메시지 영역만 스크롤, 브라우저 바닥 10rem까지 */}
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden pb-[10rem]'>
          <ChatMessageSection
            messages={messages}
            onAIMessageClick={() => setIsCreditModalOpen(true)}
            onUserMessageClick={() => setIsCompletionModalOpen(true)}
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
        onContinueWithCredits={() => {
          setIsCompletionModalOpen(false);
          setIsCreditModalOpen(true);
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
            대화 내용을 바탕으로 텍스트형 포트폴리오 생성을 시작할게요
          </>
        }
      />

      {/* 크레딧 사용 확인 모달 */}
      <CommonModal
        open={isCreditModalOpen}
        onOpenChange={setIsCreditModalOpen}
        title={
          <>
            10 크레딧을 사용하여
            <br />
            대화를 계속하시겠습니까?
          </>
        }
        description='크레딧 사용 시 3턴의 대화가 추가로 진행돼요.'
        cancelBtnText='취소'
        primaryBtnText='사용'
        onCancelClick={() => setIsCreditModalOpen(false)}
        onPrimaryClick={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
}

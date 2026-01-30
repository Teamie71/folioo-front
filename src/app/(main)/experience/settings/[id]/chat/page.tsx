'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { CommonModal } from '@/components/CommonModal';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ChatMessageSection } from '@/features/experience/chat/components/ChatMessageSection';
import { ChatStepSection } from '@/features/experience/chat/components/ChatStepSection';

export default function ExperienceSettingsChatPage() {
  const params = useParams();
  const router = useRouter();
  const removeExperience = useExperienceStore(
    (state) => state.removeExperience,
  );
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<
    Array<{ role: 'ai' | 'user'; content: string }>
  >([{ role: 'ai', content: '내용' }]);

  const id = typeof params.id === 'string' ? params.id : '';

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
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[1.25rem]'>
            <BackButton href='/experience' />
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
          </div>

          <DeleteModalButton
            title='이 경험 정리를 정말 삭제하시겠습니까?'
            onDelete={handleDelete}
          />
        </div>

        {/* 프로그레스 바 */}
        <StepProgressBar
          steps={['설정', 'AI 대화', '포트폴리오']}
          currentStep={2}
        />

        {/* 채팅 영역
        TODO: 채팅 입력창, 채팅 메시지 영역 분리 + 채팅 메시지 영역 스크롤 기능 추가
        */}
        <div className='flex flex-col gap-[1.5rem]'>
          {/* 채팅 메시지 */}
          <ChatMessageSection
            messages={messages}
            onAIMessageClick={() => setIsCreditModalOpen(true)}
          />

          {/* 채팅 입력 창 */}
          <div className='fixed bottom-[4.5rem] left-1/2 flex w-[66rem] min-w-[66rem] -translate-x-1/2 items-center gap-[1.25rem]'>
            <ChatStepSection
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
            />
          </div>
        </div>
      </div>

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

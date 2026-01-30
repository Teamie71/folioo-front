'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonModal } from '@/components/CommonModal';
import { useExperienceStore } from '@/store/useExperienceStore';

interface ExperienceSettingsChatStartProps {
  onValidationError: (
    errors: Partial<Record<'experienceName' | 'desiredJob', string>>,
  ) => void;
}

export function ExperienceSettingsChatStart({
  onValidationError,
}: ExperienceSettingsChatStartProps) {
  const router = useRouter();
  const [isStartChatModalOpen, setIsStartChatModalOpen] = useState(false);
  const { formData, validateForm, addExperience, resetForm } =
    useExperienceStore();

  const handleStartChat = () => {
    const id = crypto.randomUUID();
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    addExperience({
      id,
      title: formData.experienceName,
      tag: formData.desiredJob,
      date,
    });
    resetForm();
    setIsStartChatModalOpen(false);
    router.push(`/experience/settings/${id}/chat`);
  };

  const handleStartChatClick = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      onValidationError(validation.errors);
      return;
    }
    onValidationError({});
    setIsStartChatModalOpen(true);
  };

  return (
    <>
      {/* 시작하기 버튼 */}
      <button
        onClick={handleStartChatClick}
        className='fixed bottom-[7.5rem] left-1/2 mx-auto flex -translate-x-1/2 cursor-pointer gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
      >
        {/* TODO: 아이콘 추가 */}
        <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
        <span className='text-[1rem] font-bold text-[#FFFFFF]'>
          AI와 대화 시작하기
        </span>
      </button>

      {/* 시작하기 모달 */}
      <CommonModal
        open={isStartChatModalOpen}
        onOpenChange={setIsStartChatModalOpen}
        title={
          <>
            30 크레딧을 사용하여
            <br />
            경험 정리를 진행하시겠습니까?
          </>
        }
        cancelBtnText='취소'
        primaryBtnText='진행'
        onPrimaryClick={handleStartChat}
      />
    </>
  );
}

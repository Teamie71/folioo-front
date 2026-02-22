'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ChatStartIcon } from '@/components/icons/ChatStartIcon';

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
      <CommonButton
        variantType='Primary'
        onClick={handleStartChatClick}
        className='flex'
        px='2.25rem'
        py='0.75rem'
      >
        <ChatStartIcon />
        AI와 대화 시작하기
      </CommonButton>

      {/* 시작하기 모달 */}
      <CommonModal
        open={isStartChatModalOpen}
        onOpenChange={setIsStartChatModalOpen}
        title={
          <>
            경험 정리 1회권을 사용하여
            <br />
            진행하시겠습니까?
          </>
        }
        cancelBtnText='취소'
        primaryBtnText='진행'
        onPrimaryClick={handleStartChat}
      />
    </>
  );
}

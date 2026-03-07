'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ChatStartIcon } from '@/components/icons/ChatStartIcon';
import { useExperienceControllerCreateExperience } from '@/api/endpoints/experience/experience';
import {
  CreateExperienceReqDTOHopeJob,
  type CreateExperienceReqDTOHopeJob as HopeJobType,
} from '@/api/models';

/* 폼 희망 직군 라벨 → API hopeJob enum 매핑 */
const DESIRED_JOB_TO_HOPE_JOB: Record<string, HopeJobType> = {
  미정: CreateExperienceReqDTOHopeJob.NONE,
  기획: CreateExperienceReqDTOHopeJob.PLANNING,
  '광고/마케팅': CreateExperienceReqDTOHopeJob.MARKETING,
  디자인: CreateExperienceReqDTOHopeJob.DESIGN,
  'IT 개발': CreateExperienceReqDTOHopeJob.DEV,
  '영상/미디어': CreateExperienceReqDTOHopeJob.MEDIA,
  데이터: CreateExperienceReqDTOHopeJob.DATA,
};

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

  /* 경험 정리 생성 */
  const { mutateAsync: createExperience, isPending: isCreating } =
    useExperienceControllerCreateExperience();

  const handleStartChat = async () => {
    if (isCreating) return;

    const hopeJob =
      DESIRED_JOB_TO_HOPE_JOB[formData.desiredJob] ??
      CreateExperienceReqDTOHopeJob.NONE;

    try {
      const response = await createExperience({
        data: {
          name: formData.experienceName.trim(),
          hopeJob,
        },
      });

      const result = response?.result;
      if (!result) {
        onValidationError({
          experienceName: '경험 정리 생성에 실패했어요. 다시 시도해주세요.',
        });
        return;
      }

      const date = result.createdAt.slice(0, 10);
      addExperience({
        id: String(result.id),
        title: result.name,
        tag: formData.desiredJob,
        date,
      });
      resetForm();
      setIsStartChatModalOpen(false);
      router.push(`/experience/settings/${result.id}/chat`);
    } catch {
      onValidationError({
        experienceName: '경험 정리 생성에 실패했어요. 다시 시도해주세요.',
      });
    }
  };

  /* 경험 정리 생성 버튼 클릭 시 */
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
        footer={
          <>
            <button
              type='button'
              className='w-[6.75rem] cursor-pointer rounded-[0.5rem] border-[0.1rem] border-[#74777D] py-[0.5rem] text-[1rem] transition-colors hover:bg-[#F6F8FA]'
              onClick={() => !isCreating && setIsStartChatModalOpen(false)}
            >
              취소
            </button>
            <button
              type='button'
              disabled={isCreating}
              className='w-[6.75rem] cursor-pointer rounded-[0.5rem] bg-[#5060C5] py-[0.5rem] text-[1rem] font-semibold text-[#FFFFFF] transition-colors hover:bg-[#404D9E] disabled:cursor-not-allowed'
              onClick={handleStartChat}
            >
              {isCreating ? '진행' : '진행'}
            </button>
          </>
        }
      />
    </>
  );
}

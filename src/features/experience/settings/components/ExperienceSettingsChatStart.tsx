'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ChatStartIcon } from '@/components/icons/ChatStartIcon';
import { useExperienceControllerCreateExperience } from '@/api/endpoints/experience/experience';
import { CreateExperienceReqDTOHopeJob } from '@/api/models/createExperienceReqDTOHopeJob';

const JOB_LABEL_TO_HOPE_JOB: Record<string, CreateExperienceReqDTOHopeJob> = {
  미정: CreateExperienceReqDTOHopeJob.NONE,
  기획: CreateExperienceReqDTOHopeJob.PLANNING,
  '광고/마케팅': CreateExperienceReqDTOHopeJob.MARKETING,
  디자인: CreateExperienceReqDTOHopeJob.DESIGN,
  'IT 개발': CreateExperienceReqDTOHopeJob.DEV,
  '영상/미디어': CreateExperienceReqDTOHopeJob.MEDIA,
  데이터: CreateExperienceReqDTOHopeJob.DATA,
};

const HOPE_JOB_TO_LABEL: Record<CreateExperienceReqDTOHopeJob, string> =
  Object.fromEntries(
    Object.entries(JOB_LABEL_TO_HOPE_JOB).map(([label, hopeJob]) => [
      hopeJob,
      label,
    ]),
  ) as Record<CreateExperienceReqDTOHopeJob, string>;

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

  const { mutate: createExperience } = useExperienceControllerCreateExperience(
    {
      mutation: {
        onSuccess: (response) => {
          const experience = response.result;
          if (!experience) return;

          const cardId = String(experience.id);
          const createdDate = experience.createdAt?.slice(0, 10);
          const hopeJobLabel =
            HOPE_JOB_TO_LABEL[experience.hopeJob] ?? '미정';

          addExperience({
            id: cardId,
            title: experience.name,
            tag: hopeJobLabel,
            date: createdDate ?? '',
          });

          resetForm();
          setIsStartChatModalOpen(false);
          router.push(`/experience/settings/${cardId}/chat`);
        },
        onError: () => {
          // TODO: 에러 토스트/모달 연결 시 교체
          // eslint-disable-next-line no-console
          console.error('경험 생성에 실패했습니다.');
        },
      },
    },
  );

  const handleStartChat = () => {
    const hopeJob = JOB_LABEL_TO_HOPE_JOB[formData.desiredJob];

    if (!hopeJob) {
      onValidationError({
        desiredJob: '희망 직군을 다시 선택해주세요.',
      });
      return;
    }

    createExperience({
      data: {
        name: formData.experienceName,
        hopeJob,
      },
    });
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

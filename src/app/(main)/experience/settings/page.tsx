'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { CommonModal } from '@/components/CommonModal';
import { StepProgressBar } from '@/components/StepProgressBar';
import { ExperienceSettingsForm } from '@/features/experience/settings/components/ExperienceSettingsForm';
import { ExperienceSettingsChatStart } from '@/features/experience/settings/components/ExperienceSettingsChatStart';

export default function ExperienceSettingsPage() {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<'experienceName' | 'desiredJob', string>>
  >({});

  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex items-center gap-[1.25rem]'>
          <BackButton onClick={() => setIsCancelModalOpen(true)} />
          <div className='flex items-center gap-[0.75rem]'>
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className='pb-[4.5rem]'>
          <StepProgressBar
            steps={['설정', 'AI 대화', '포트폴리오']}
            currentStep={1}
          />
        </div>
      </div>

      {/* 경험명, 희망 직무 폼 */}
      <ExperienceSettingsForm errors={errors} />

      {/* AI 대화 시작 */}
      <div className='mt-[5rem] flex justify-center'>
        <ExperienceSettingsChatStart onValidationError={setErrors} />
      </div>

      {/* 취소 모달 */}
      <CommonModal
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        title='이 경험 정리를 정말 그만두시겠습니까?'
        description='지금 돌아가면, 작성하신 내용이 저장되지 않아요.'
        secondaryBtnText='그만두기'
        primaryBtnVariant='outline'
        cancelBtnText='취소'
        onSecondaryClick={() => router.back()}
      />
    </div>
  );
}

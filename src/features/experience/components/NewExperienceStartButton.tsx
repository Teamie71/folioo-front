'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { useExperienceControllerGetExperiences } from '@/api/endpoints/experience/experience';
import { ExperienceCardMaxModal } from './ExperienceCardMaxModal';

const MAX_EXPERIENCE_CARDS = 15;

export function NewExperienceStartButton() {
  const { data } = useExperienceControllerGetExperiences();
  const [modalOpen, setModalOpen] = useState(false);
  const experienceCount = data?.result?.length ?? 0;
  const isMaxCards = experienceCount >= MAX_EXPERIENCE_CARDS;

  if (isMaxCards) {
    return (
      <>
        <CommonButton
          variantType='StartChat'
          onClick={() => setModalOpen(true)}
        >
          새로운 경험 정리 시작하기
        </CommonButton>
        <ExperienceCardMaxModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  return (
    <Link href='/experience/settings' className='no-underline'>
      <CommonButton variantType='StartChat'>
        새로운 경험 정리 시작하기
      </CommonButton>
    </Link>
  );
}
